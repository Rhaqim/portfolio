---
layout: ../layouts/Doc.astro
slug: buckt
description: "Buckt is a Go media management library: folder hierarchies, metadata, image derivatives, dedup and lifecycle events on top of local disk, S3, R2, GCS or Azure Blob."
---

Buckt sits inside your Go application and manages media workflows, delegating the
actual bytes to whatever backend you point it at. MinIO answers *"where should
the bytes be stored?"* Buckt answers *"how should my application manage
media?"* You can run both: Buckt happily uses MinIO as a backend.

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                  ┌────────▼─────────┐
                  │   buckt.Client   │  ◄── direct API or web client
                  └────────┬─────────┘
            ┌──────────────┼──────────────┐
            │              │              │
       ┌────▼────┐   ┌─────▼─────┐  ┌─────▼──────┐
       │ Folder  │   │   File    │  │   Cache    │
       │ Service │   │  Service  │  │  Manager   │
       └────┬────┘   └─────┬─────┘  └────────────┘
            │              │
       ┌────▼──────────────▼─────┐
       │   Repository (GORM)     │  ◄── SQLite or Postgres
       └────┬────────────────────┘
            │
       ┌────▼─────────────────────────────────────┐
       │            FileBackend                   │
       │  ┌──────┐ ┌─────┐ ┌─────┐ ┌──────┐ ┌──┐  │
       │  │Local │ │ S3  │ │ GCS │ │Azure │ │R2│  │
       │  └──────┘ └─────┘ └─────┘ └──────┘ └──┘  │
       └──────────────────────────────────────────┘
```

## Install

```bash
go get github.com/Rhaqim/buckt
```

Cloud backends and the web UI are separate Go modules, so the core stays lean.
Pull in only the SDKs you actually use.

```bash
go get github.com/Rhaqim/buckt/cloud/aws     # S3 + Cloudflare R2
go get github.com/Rhaqim/buckt/cloud/gcp     # Google Cloud Storage
go get github.com/Rhaqim/buckt/cloud/azure   # Azure Blob Storage
go get github.com/Rhaqim/buckt/client/web    # Web UI + HTTP API
```

## Quick start

```go
package main

import (
  "log"
  "github.com/Rhaqim/buckt"
)

func main() {
  client, err := buckt.Default()
  if err != nil {
    log.Fatal(err)
  }
  defer client.Close()

  fileID, err := client.UploadFile(
    "user123",    // owner
    "",           // parent folder ID (empty = root)
    "hello.txt",
    "text/plain",
    []byte("hello world"),
  )
  if err != nil {
    log.Fatal(err)
  }

  file, _ := client.GetFile(fileID)
  log.Println(string(file.Data))
}
```

Files land in `./media`, metadata in `./db.sqlite`. No extra setup.

## Configuration

Functional options. Everything is optional, `Default()` gives you working
defaults.

```go
client, err := buckt.Default(
  buckt.WithLog(buckt.LogConfig{LogTerminal: true, LogFile: "logs"}),
  buckt.WithDB(buckt.Postgres, sqlDB),
  buckt.WithBackend(s3Backend),
  buckt.WithMaxFileSize(buckt.DefaultMaxFileSize),
  buckt.MediaDir("./uploads"),
  buckt.FlatNameSpaces(true),
)
```

| Option | Description |
|---|---|
| `WithLog(LogConfig)` | Terminal/file logging, or pass a custom `*log.Logger` |
| `WithDB(driver, *sql.DB)` | Bring your own connection (Postgres or SQLite) |
| `WithTablePrefix(string)` | Prefix table names to share a database with other apps |
| `WithCache(CacheConfig)` | Custom cache manager + LRU file-cache tuning |
| `WithBackend(Backend)` | Set the storage backend |
| `WithMigration(MigrationConfig)` | Dual-write migration between two backends |
| `WithImageDerivatives(...DerivativeSpec)` | Define resized image variants |
| `WithImageProcessor(imageproc.Processor)` | Swap the image processor (e.g. WebP) |
| `WithEventHandler(events.Handler)` | Post-operation lifecycle hook |
| `WithUploadScanner(scan.Scanner)` | Reject uploads before they're stored |
| `WithDedup()` | Collapse identical uploads in a folder to one blob |
| `WithMetrics(metrics.Recorder)` | Per-backend operation metrics |
| `WithMaxFileSize(int64)` | Reject oversized uploads (0 = no limit) |
| `WithMaxTrashBatchSize(int)` | Cap descendants moved in a single folder delete |
| `WithBackendOpTimeout(duration)` | Bound backend I/O during a delete |
| `MediaDir(string)` | Local media directory |
| `FlatNameSpaces(bool)` | UUID filenames at the root vs. hierarchical paths |

## Storage backends

The `FileBackend` interface lets you swap providers without touching
application code.

| Backend | Module | Use case |
|---|---|---|
| Local FS | built in | Development, single-server deployments |
| AWS S3 | `cloud/aws` | Production cloud, durable object storage |
| Cloudflare R2 | `cloud/aws` | S3-compatible, zero egress fees |
| Google Cloud Storage | `cloud/gcp` | GCP-native applications |
| Azure Blob | `cloud/azure` | Azure-native applications |
| MinIO / Ceph | `cloud/aws` | Self-hosted S3-compatible storage |

```go
import (
  "github.com/Rhaqim/buckt"
  "github.com/Rhaqim/buckt/cloud/aws"
)

s3, err := aws.NewBackend(aws.Config{
  AccessKey: "AKIA...",
  SecretKey: "...",
  Region:    "us-east-1",
  Bucket:    "my-bucket",
})
if err := s3.Ping(ctx); err != nil { /* fail fast on bad credentials */ }

client, _ := buckt.Default(buckt.WithBackend(s3))
```

R2 is S3-compatible, so the `cloud/aws` backend auto-detects it from the endpoint
suffix and switches to path-style addressing. Leave `Region` empty; it defaults
to `auto`.

```go
r2, err := aws.NewBackend(aws.Config{
  AccessKey: "your-r2-access-key",
  SecretKey: "your-r2-secret",
  Bucket:    "my-bucket",
  Endpoint:  "https://<ACCOUNT_ID>.r2.cloudflarestorage.com",
})
```

Every cloud backend exposes `Ping(ctx)`. Call it after `NewBackend` so
credential and network problems surface at startup instead of on the first
upload.

## Live migration

Moving from local disk to S3, or S3 to R2, without downtime. Migration mode
dual-writes, reads from both, and lazily migrates forward on read.

```
              ┌───────────┐    Put   ┌──────────────┐
   Write ────►│  Primary  ├─────────►│  Secondary   │
              │ (current) │          │   (target)   │
              └─────┬─────┘          └──────┬───────┘
                    │                       │
                    │  Get: try primary,    │
                    │  fall back to         │
                    │  secondary if missing │
                    │                       │
                    └─────────► File ◄──────┘
```

```go
s3, _ := aws.NewBackend(s3Config)

client, _ := buckt.Default(buckt.WithMigration(buckt.MigrationConfig{
  From:        buckt.LocalBackend(), // current source of truth
  To:          s3,                   // target
  Concurrency: 16,                   // default 8
}))
```

| Operation | Behavior |
|---|---|
| `Put` | Writes to both. Primary failure is a hard error; secondary failure is logged. |
| `Get` | Primary first, lazy-mirrors to secondary. Falls back to secondary if primary is missing. |
| `Delete` | Deletes from both. |
| `Move` | Moves in both. |

Migration is **always forward**. The primary is the source of truth and is never
overwritten by secondary content.

Dual-write only mirrors *new* activity. To copy everything that predates the
cutover, call `MigrateAll` and poll:

```go
if err := client.MigrateAll(ctx); err != nil {
  log.Fatal(err) // ErrBackendUnavailable if not built WithMigration
}

for {
  done, total, _ := client.MigrationStatus(ctx)
  log.Printf("migrated %d/%d", done, total)
  if total > 0 && done >= total {
    break
  }
  time.Sleep(time.Second)
}

if failed, _ := client.MigrationFailures(ctx); failed > 0 {
  log.Printf("%d file(s) failed after retries; fix the cause and re-run", failed)
}
```

`MigrateAll` is **resumable and idempotent**: each copied object is recorded in
`buckt_migration_models`, so a restarted migration skips what it already did
rather than re-scanning the target. Each in-flight file is buffered in full, so
higher concurrency trades memory and provider rate-limit headroom for
throughput.

`client.BackendName()` reports the active backend: `"local"`, `"s3"`, or
`"local->s3"` mid-migration. Once you're done, drop migration mode:

```go
client, _ := buckt.Default(buckt.WithBackend(s3))
```

## Image derivatives

Generate resized variants from uploads. The built-in processor is pure Go and
handles JPEG and PNG with no external dependencies.

```go
client, _ := buckt.Default(
  buckt.WithImageDerivatives(
    buckt.DerivativeSpec{Name: "thumbnail", MaxWidth: 200},
    buckt.DerivativeSpec{Name: "medium", MaxWidth: 800},
  ),
)

_ = client.GenerateDerivatives(fileID)

data, contentType, err := client.GetDerivative(fileID, "thumbnail")
```

| Field | Description |
|---|---|
| `Name` | Variant name used to fetch it back |
| `MaxWidth` | Max width in px; aspect ratio preserved, never upscaled |
| `Format` | `""` keeps the source format; `jpeg`/`png` built in; `webp` needs a matching processor |

WebP lives in its own module so the core stays dependency-free:

```go
import "github.com/Rhaqim/buckt/imageproc/webp"

client, _ := buckt.Default(
  buckt.WithImageProcessor(webp.New()),
  buckt.WithImageDerivatives(
    buckt.DerivativeSpec{Name: "thumbnail", MaxWidth: 200, Format: "webp"},
  ),
)
```

> Resizing runs inline with `GenerateDerivatives`. For heavy workloads, call it
> from an event handler that enqueues to a worker rather than blocking the
> upload.

## Events and scanning

Lifecycle handlers run **synchronously after** the operation commits. Keep them
fast. The intended pattern is enqueue-and-return. A panicking handler is
recovered and never fails the originating call.

```go
import "github.com/Rhaqim/buckt/pkg/events"

onEvent := func(ctx context.Context, e events.Event) {
  if e.Type == events.FileUploaded {
    _ = client.GenerateDerivatives(e.FileID)
  }
}

client, _ := buckt.Default(buckt.WithEventHandler(onEvent))
```

| Event | Fires when |
|---|---|
| `events.FileUploaded` | A new file's bytes are committed |
| `events.FileTrashed` | A file is moved to trash |
| `events.FileRestored` | A trashed file is restored |
| `events.FilePurged` | A file is hard-deleted |

Events fire *after* the write, so they can't block an upload. To reject a file
*before* it's stored, register a scanner. Buckt ships no scanning engine by
design. You supply one (ClamAV, VirusTotal, a content-type allowlist).

```go
import "github.com/Rhaqim/buckt/pkg/scan"

scanner := scan.ScannerFunc(func(ctx context.Context, name string, data []byte) error {
  return clamav.Scan(ctx, data) // non-nil rejects the upload
})

client, _ := buckt.Default(buckt.WithUploadScanner(scanner))
```

```go
_, err := client.UploadFile(userID, "", "invoice.pdf", "application/pdf", data)
if errors.Is(err, buckt.ErrUploadRejected) {
  // err also wraps the scanner's own reason
}
```

The scanner runs at Buckt's single upload chokepoint, so **every** upload path is
covered. A caller can't forget to wire it in per call site.

## Dedup, metadata, metrics

With `WithDedup()`, an upload whose bytes hash-match a file already in the
**same target folder** for the same owner returns the existing file's ID instead
of writing the blob again. Scoped to the folder, so it composes with nested
namespaces and never resurrects a trashed duplicate. Off by default.

```go
client, _ := buckt.Default(buckt.WithDedup())
```

Arbitrary key/value metadata attaches to any file, stored as JSON on the record:

```go
_ = client.SetFileMetadata(fileID, map[string]string{
  "source": "web-ui",
  "album":  "vacation-2026",
})

meta, _ := client.GetFileMetadata(fileID)
```

Metrics use a pluggable recorder; the built-in collector has no dependencies and
costs nothing when unused.

```go
import "github.com/Rhaqim/buckt/pkg/metrics"

collector := metrics.NewCollector()
client, _ := buckt.Default(buckt.WithMetrics(collector))

snap := collector.Snapshot() // map[backend]map[operation]metrics.Stat
```

Each `Stat` holds `Count`, `Errors`, `Bytes` and `TotalDur`. Implement the
one-method `metrics.Recorder` interface to forward to Prometheus, StatsD, or
your own sink.

## Trash and deletion

| Action | Result | API |
|---|---|---|
| Move to trash | Moved to a per-user `__trash__` folder. Reversible. | `DeleteFile` / `DeleteFolder` |
| Delete permanently | Hard-deleted from DB and backend. Irreversible. | `DeleteFilePermanently` / `DeleteFolderPermanently` |

The trash folder is a real folder hidden from normal listings, and hierarchy is
preserved when items are trashed. Calling `DeleteFile` on something already in
trash hard-deletes it, giving you an "empty trash" mechanism with no extra API.

```go
trash, _ := client.GetTrashFolder("user123")

client.MoveFile(fileID, originalParentID) // restore
client.DeleteFile(fileID)                 // already trashed → hard delete
```

In non-flat namespace mode, deleted items are physically moved on the backend so
paths stay consistent, not just renamed in the database.

## Web client

An optional Gin-based HTTP API and Tailwind UI, in its own module.

```go
import (
  "github.com/Rhaqim/buckt"
  web "github.com/Rhaqim/buckt/client/web"
)

func main() {
  bucktClient, _ := buckt.Default()
  defer bucktClient.Close()

  router, _ := web.NewClient(bucktClient)
  router.Run(":8080")
}
```

| Mode | Routes |
|---|---|
| `WebModeAll` (default) | UI at `/web` + API |
| `WebModeAPI` | API only |
| `WebModeUI` | UI only |
| `WebModeMount` | API only, for mounting onto a parent Gin engine |

The UI gives you breadcrumb navigation, image/video/audio/PDF previews,
drag-and-drop moves, inline rename, a folder browser for move targets, and both
delete modes.

## API reference

```go
// Folders
NewFolder(userID, parentID, name, description string) (string, error)
ListFolders(folderID string) ([]FolderModel, error)
GetFolderWithContent(userID, folderID string) (*FolderModel, error)
GetTrashFolder(userID string) (*FolderModel, error)
MoveFolder(userID, folderID, newParentID string) error
RenameFolder(userID, folderID, newName string) error
DeleteFolder(folderID string) (string, error)                     // → trash
DeleteFolderPermanently(userID, folderID string) (string, error)  // → hard delete

// Files
UploadFile(userID, parentID, name, contentType string, data []byte) (string, error)
UploadFileFromReader(userID, parentID, name, contentType string, r io.Reader) (string, error)
GetFile(fileID string) (*FileModel, error)
GetFileStream(fileID string) (*FileModel, io.ReadCloser, error)
ListFiles(folderID string) ([]FileModel, error)
ListFilesMetadata(folderID string) ([]FileModel, error)
MoveFile(fileID, newParentID string) error
DeleteFile(fileID string) (string, error)              // → trash
DeleteFilePermanently(fileID string) (string, error)   // → hard delete

// Metadata
SetFileMetadata(fileID string, metadata map[string]string) error
GetFileMetadata(fileID string) (map[string]string, error)

// Derivatives
GenerateDerivatives(fileID string) error
GetDerivative(fileID, name string) (data []byte, contentType string, err error)

// Migration (only WithMigration)
MigrateAll(ctx context.Context) error
MigrationStatus(ctx context.Context) (completed, total int64, ok bool)
MigrationFailures(ctx context.Context) (failed int64, ok bool)
BackendName() string
```

Every method has a `*Context` variant taking an explicit `context.Context`.

Branch on failures with `errors.Is` using the re-exported sentinels:

| Sentinel | Meaning | Suggested status |
|---|---|---|
| `ErrNotFound` | File, folder or derivative doesn't exist | 404 |
| `ErrInvalidID` | Not a valid UUID | 400 |
| `ErrInvalidName` | Empty or unsafe name | 400 |
| `ErrAlreadyExists` | Name collision on create/move/rename | 409 |
| `ErrFileTooLarge` | Exceeds `WithMaxFileSize` | 413 |
| `ErrUploadRejected` | Rejected by an upload scanner | 422 |
| `ErrTrashBatchExceeded` | Folder delete exceeds the trash batch cap | 409 |
| `ErrBackendUnavailable` | Backend unreachable / feature not enabled | 503 |

## Security defaults

| Protection | Details |
|---|---|
| Path traversal | All paths validated against the media directory boundary |
| File size limits | Oversized uploads rejected before allocating memory (`io.LimitReader`) |
| Content sniffing | Real content type detected from bytes when the client sends a generic one |
| Filename injection | RFC 6266 percent-encoded `Content-Disposition` |
| MIME sniffing | `X-Content-Type-Options: nosniff` on all file-serving endpoints |
| Command injection | Path validation before passing to `ffmpeg`/`convert` |
| Self-move | Folders can't be moved into themselves or their descendants |
| Constraint integrity | Unique `(user_id, parent_id, name)` prevents collisions |

The repo also runs [gitleaks](https://github.com/gitleaks/gitleaks) as a
pre-commit hook and in CI, so credentials never land in git.
