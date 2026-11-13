---
layout: ../layouts/Doc.astro
slug: loom
description: "loom is a modality-agnostic Go engine for multi-agent AI applications: versioned agents and prompts, multi-agent turns, shared multiplayer sessions with live event streams, branching and replay, hooks, cost budgets, LLM-as-judge scoring and a YAML-driven test harness."
---

Most LLM applications rewrite the same infrastructure: session state, prompt
versioning, retries, cost accounting, evaluation. loom is that infrastructure as
a library. Text, image, video, audio, 3D assets and structured output move
through one pipeline, so switching modality means swapping an agent, not
rewriting the runtime.

> Building with loom using an AI assistant? Point it at
> [`llms.txt`](https://github.com/rhaqim/loom/blob/main/llms.txt), a
> self-contained, task-oriented guide to the API written for LLMs.

## Install

```bash
go get github.com/rhaqim/loom
```

Requires Go 1.26+ and a Postgres or SQLite database. The Anthropic adapter is
its own module, so the SDK's dependencies stay out of loom:

```bash
go get github.com/rhaqim/loom/generator/anthropic
```

## Quick start

```go
package main

import (
    "context"
    "database/sql"
    "fmt"
    "log"
    "os"

    _ "github.com/lib/pq"

    loom "github.com/rhaqim/loom"
    "github.com/rhaqim/loom/generator/openai"
    "github.com/rhaqim/loom/schema"
)

func main() {
    db, _ := sql.Open("postgres", "postgres://user:pass@localhost/mydb?sslmode=disable")
    ctx := context.Background()

    // Apply the loom schema (idempotent).
    schema.NewLoader(schema.DialectPostgres).Apply(ctx, db)

    e, _ := loom.New(loom.Config{
        DB:      db,
        Dialect: loom.DialectPostgres,
        Generators: map[string]loom.Generator{
            "gpt4o": openai.NewChatGenerator(os.Getenv("OPENAI_API_KEY"), "gpt-4o"),
        },
    })

    e.Prompts().Create(ctx, &loom.Prompt{
        Slug: "assistant-sys", Version: 1, Kind: loom.PromptKindSystem,
        Body: "You are a vivid storyteller. Keep responses to 2-3 paragraphs.",
    })
    e.Prompts().Create(ctx, &loom.Prompt{
        Slug: "assistant-user", Version: 1, Kind: loom.PromptKindUserTemplate,
        Body: "The user says: {{.Action.Payload.text}}",
    })

    // Registry reads are scoped by owner. Single-tenant apps pass "".
    sys, _ := e.Prompts().Get(ctx, "", "assistant-sys", 1)
    user, _ := e.Prompts().Get(ctx, "", "assistant-user", 1)

    e.Agents().Create(ctx, &loom.Agent{
        Slug: "assistant", Version: 1, Modal: loom.ModalityText,
        GeneratorSlug:  "gpt4o",
        SystemPromptID: sys.ID,
        UserTemplateID: user.ID,
    })

    sess := &loom.Session{PlatformID: "user-1", State: loom.State{Modality: loom.ModalityText}}
    e.Sessions().Create(ctx, sess)

    step, err := e.RunStep(ctx, sess, loom.StepRequest{
        AgentSlug: "assistant",
        Action: &loom.Action{
            Kind:    loom.ActionFreeText,
            Payload: map[string]any{"text": "I push open the ancient door."},
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(step.Result.(*loom.TextResult).Content)
}
```

## Agents and prompts

An **Agent** bundles a generator slug, system prompt, user template, generation
params and an optional response format. Both agents and prompts are versioned.
Increment the version to roll out a new prompt or model without breaking
sessions already in flight.

```go
e.Prompts().Create(ctx, &loom.Prompt{
    Slug: "my-sys", Version: 1, Kind: loom.PromptKindSystem, Body: "...",
})

e.Agents().Create(ctx, &loom.Agent{
    Slug: "my-agent", Version: 1,
    GeneratorSlug:  "openai",
    SystemPromptID: sysPrompt.ID,
    UserTemplateID: userPrompt.ID,
})
```

User templates are Go `text/template` strings with this data available:

```text
{{.Vars}}            -> session.State.Vars (map[string]any)
{{.Action}}          -> the current Action
{{.Action.Payload}}  -> the action's payload
{{.Inputs}}          -> per-step inputs (e.g. a turn's lead output)
{{.Params}}          -> per-call tuning knobs
{{.Session}}         -> a minimal whitelisted view: .ID, .PlatformID, .Tags, .State
```

`{{.Session}}` deliberately excludes `Metadata` and `History` so a template
can't exfiltrate secrets or cross-turn data, and `{{define}}`/`{{template}}` are
rejected because they enable unbounded recursion.

## Sessions and steps

A **Session** holds conversation history, state variables and tags. A **Step** is
one agent invocation, recording the request, result, action and duration.

```go
sess := &loom.Session{
    PlatformID: "user-123",
    State: loom.State{
        Modality: loom.ModalityText,
        Vars:     map[string]any{"scene": "A dark tavern"},
    },
}
e.Sessions().Create(ctx, sess)

step, err := e.RunStep(ctx, sess, loom.StepRequest{
    AgentSlug: "assistant",
    Action: &loom.Action{
        Kind:    loom.ActionFreeText,
        Payload: map[string]any{"text": "I order a drink."},
    },
    OnChunk: func(c loom.Chunk) { fmt.Print(c.Content) }, // streaming
})
```

Actions carry structured input into a step:

| Kind | Payload | Use case |
|---|---|---|
| `ActionFreeText` | `{"text": "..."}` | Open text input |
| `ActionSelect` | `{"option_index": 0, "option_id": "..."}` | Choose from presented options |
| `ActionSpatial` | `{"direction": "north"}` | Movement / map navigation |
| `ActionInventory` | custom | Item use / equipment |
| `ActionGesture` | custom | Touch / controller input |
| `ActionCustom` | any | Escape hatch |

## Turns and multi-agent flows

`RunStep` runs one agent. Real platforms need a *turn* composed of several. A
streaming "author" produces prose, then a "logician", a "sensory director" and a
"titler" analyse it in parallel. A `Flow` declares that turn as data. `RunTurn`
runs the lead first (optionally streaming), injects its output into the
followers, then runs the followers concurrently. Every resulting step is
persisted under one `turn_id`.

```go
flow := loom.Flow{
    Slug: "chat-turn",
    Lead: loom.FlowAgent{AgentSlug: "author", Stream: true, OutputKey: "Prose"},
    Followers: []loom.FlowAgent{
        {AgentSlug: "logician"}, // sees the lead's prose via {{.Inputs.Prose}}
        {AgentSlug: "sensory"},
    },
}

turn, err := e.RunTurn(ctx, sess, loom.TurnRequest{
    Flow:    flow,
    Action:  &loom.Action{Kind: loom.ActionFreeText, Payload: map[string]any{"text": "I open the door."}},
    OnChunk: func(c loom.Chunk) { fmt.Print(c.Content) },
})
prose := loom.ResultText(turn.Lead.Result)
logician := turn.Followers["logician"].Result // a *StructuredResult
```

Because every agent in a flow is an ordinary versioned agent, the only thing
that changes between products, or between text, image, video and spatial
modalities, is the set of agents the flow references plus the registered
generators.

Followers don't have to be flat. A follower whose template reads another
follower's `OutputKey` runs after it, so a flow is planned into dependency
layers that each run concurrently. `Flows().Validate` rejects a variable nobody
produces, or a cycle, before you publish; `Flows().Plan` returns the layers and
edges as data for a UI. Followers' hooks can all write session state: each
step's changes are merged three-way against the state it started from, so
parallel writers never clobber each other, and a real conflict is logged.

`StepRequest.Inputs` is exposed to templates as `{{.Inputs.x}}` and forwarded to
the generator. Pre-hooks run **before** the template renders and receive the
session, so a memory-recall hook can inject context the prompt then uses.
`GeneratorOverride`, `ParamOverride` and `Overrides` allow per-request provider,
parameter and key/model routing.

## Shared sessions

For a session several people share, such as a multiplayer game:

```go
// Participants are checkpointed state: a fork from before a join drops them.
e.AddParticipant(ctx, sess, loom.Participant{ID: "wren", Role: "player"})

// A step a person wrote: persisted, checkpointed, hooks run, no generator or cost.
e.RecordStep(ctx, sess, loom.ExternalStep{
    AgentSlug: "human-dm", Author: "participant:host",
    Result:    loom.NewTextResult(narration, "stop", 0, 0),
})

// A human-led turn: the host's text is the lead, AI followers work on it.
e.RunTurn(ctx, sess, loom.TurnRequest{
    Flow: flow, LeadResult: loom.NewTextResult(narration, "stop", 0, 0), LeadAuthor: "participant:host",
})

// Everyone watches live: step.started, chunk, step.done, step.failed, turn.done, forked.
sub, _ := e.Subscribe(ctx, sess.ID, loom.SubscribeOptions{FromStep: 0})
for ev := range sub.Events { /* fan out to clients */ }
```

`Action.ParticipantID` is checked against membership (`loom.ErrNotParticipant`)
and stored on the step. Subscriptions replay persisted steps from `FromStep`
(pass `-1` for live only), resume after a disconnect from the last step seen,
and drop a consumer that falls too far behind. The broadcaster is in-process by
default; set `Config.Broadcaster` when several engine instances share sessions.
Turn-taking itself stays application code.

## Branching and replay

Fork a session at any step index to explore an alternative timeline. The parent
is untouched; stale branches are collected by the GC worker.

```go
branch, err := e.Sessions().Fork(ctx, sess.ID, 2)
e.RunStep(ctx, branch, loom.StepRequest{AgentSlug: "assistant", Action: action})

tree, _ := e.Sessions().BranchTree(ctx, sess.ID)
```

Retention rules expire whole sessions, roots included, for short-lived data
such as a public demo:

```go
loom.New(loom.Config{ /* ... */
    BranchGC: &loom.BranchGCConfig{ /* ... */
        Retention: []loom.RetentionRule{
            {Name: "demo", Tags: []string{"demo"}, MaxIdle: 48 * time.Hour, Action: loom.RetentionPurge},
        },
    },
})
```

## Generators

| Package | Constructor | Modality |
|---|---|---|
| `generator/openai` | `NewChatGenerator(key, model)` | Text (streaming) |
| `generator/anthropic` | `NewChatGenerator(key, model)` | Text (streaming), on the official Anthropic Go SDK; its own module |
| `generator/replicate` | `NewImageGenerator(key, model)` | Image (async) |
| `generator/runway` | `NewVideoGenerator(key, model)` | Video (async) |
| `generator/meshy` | `NewModel3DGenerator(key)` | 3D asset, GLB (async, text- or image-to-3D) |
| `generator/echo` | `New(prefix)` | Text, stub for testing |

The Anthropic adapter maps `Params.Extra["effort"]` to `output_config.effort`,
can send a response format as native structured outputs
(`.WithNativeStructuredOutputs()`), defaults `max_tokens` to 16000, and returns
safety refusals as `*loom.GenerationError{Kind: GenerationRejected}`.

Bring your own by implementing one of three interfaces, then register it via
`Config.Generators` or `e.RegisterGenerator("slug", gen)`:

```go
// Sync: the minimum.
type Generator interface {
    Modality() Modality
    Generate(ctx context.Context, req GenerateRequest) (Result, error)
}

// Streaming: optional, word-by-word.
type StreamingGenerator interface {
    Generator
    GenerateStream(ctx context.Context, req GenerateRequest) (<-chan Chunk, <-chan Result, error)
}

// Async: optional, for slow image/video jobs. Generate returns a pending
// Result; the engine's poller calls Poll until it resolves.
type AsyncGenerator interface {
    Generator
    Poll(ctx context.Context, handle TaskHandle) (Result, error)
}
```

> **Security note.** The built-in `openai` and `anthropic` generators accept a
> per-request `Overrides["base_url"]` **only** if the URL is allowlisted via
> `WithAllowedBaseURLs(...)`. An un-allowlisted base URL would let a caller
> redirect the request, and your API key, to an arbitrary host.

## Hooks

Hooks intercept every step for validation, retry logic, moderation or
annotation. They're registered by name and run in registration order.

```go
// Pre-hook: cancel a step if conditions aren't met.
e.Hooks().RegisterPre("check-hp", func(ctx context.Context, req *loom.StepRequest) error {
    if character.CurrentHP <= 0 {
        return loom.ErrSkip // silently skip the step
    }
    return nil
})

// Post-hook: retry if the output contains a forbidden phrase.
e.Hooks().RegisterPost("no-spoilers", func(ctx context.Context, req *loom.StepRequest, res loom.Result) (loom.Result, error) {
    tr := res.(*loom.TextResult)
    if strings.Contains(tr.Content, "THE KILLER IS") {
        return nil, loom.ErrRetryWith(loom.RetryAnnotation{
            Reason: "Do not reveal the killer's identity.",
        })
    }
    return res, nil
})
```

## Cost and budgets

Every step records input/output tokens and USD cost inside its own transaction.
Token-billed models are priced from `Config.Pricing` (per model id) or
`Config.DefaultPrice`; image, video, audio and 3D jobs from `Config.JobPricing`.
loom ships no price list, because prices go stale between releases. Rows priced
from the built-in placeholder rate are marked `Estimated`, and a summary's
`PricingConfigured` is false if any row it sums was estimated, so you never
show placeholder dollars as real ones.

Budgets cap spend per platform key (`TargetPlatformID`) or per session
(`TargetSessionID`, one shared game whoever acts). Enforcement is best-effort:
it reads prior recorded spend and fails open on DB errors, not a hard
transactional ceiling.

```go
e.Budgets().Create(ctx, &loom.Budget{
    Name:     "user-daily-cap",
    Target:   loom.BudgetTarget{Kind: loom.TargetPlatformID, Key: "user-123"},
    Window:   loom.BudgetWindowDay,
    Limit:    loom.BudgetLimit{USD: 0.50}, // USD/Tokens/Steps; 0 = no cap on that axis
    OnExceed: loom.BudgetBlock,            // or BudgetDowngrade / BudgetNotify
    Active:   true,                        // an inactive budget is ignored
})

usage, _ := e.Cost().SessionUsage(ctx, sess.ID)
fmt.Printf("Session cost: $%.4f (%d tokens)\n", usage.TotalUSD, usage.TotalTokens)
```

On block, `RunStep` returns `*loom.BudgetExceededError`, carrying used and limit
USD, tokens and steps.

Before anything runs, check a key and price a call:

```go
// Asks the provider's models endpoint: no tokens spent.
info, err := e.VerifyGenerator(ctx, "claude", map[string]any{"api_key": key})
if errors.Is(err, loom.ErrKeyRejected) { /* 401/403 */ }

est, _ := e.Cost().Estimate(ctx, loom.EstimateRequest{Model: "claude-haiku-5-5", InputTokens: 7000, OutputTokens: 1800})
```

## Judges

Score and compare outputs using another model as judge.

```go
import "github.com/rhaqim/loom/judge"

rubric := e.Judges().Rubric("quality-judge")
verdict, _ := rubric.Score(ctx, judge.ScoreRequest{
    Input:      userPrompt,
    Output:     dmResponse,
    Dimensions: []string{"immersion", "rules_accuracy", "narrative_coherence"},
})
fmt.Printf("Immersion: %.1f/10\n", verdict.Scores["immersion"])

pair := e.Judges().Pairwise("ab-judge")
result, _ := pair.Compare(ctx, judge.PairwiseRequest{
    Input: prompt, OutputA: responseA, OutputB: responseB,
})
// result.Winner == "A" | "B" | "tie"
```

## Evaluations (experimental)

A generator *produces* content; an evaluator *decides* things about it. It
answers typed questions (yes/no, pick one, rate on a rubric) as calibrated
probabilities in one round trip, with each question judged independently.

```go
eval, _ := e.Evaluate(ctx, prose, map[string]loom.EvalQuestion{
    "cliched": loom.EvalNoul("Does this lean on stock clichés?"),
    "quality": loom.EvalScore("Rate the prose", "generic", "flat", "vivid", "striking"),
})
if eval.Answers.Yes("cliched", 0.7) { /* retry */ }
```

`e.EvalGate` turns answers into a post-hook that accepts, retries or rejects;
`FlowAgent.When` skips a follower entirely when one cheap question says it isn't
needed. It's opt-in (`Config.Evaluator`) and the API may still change.

## Test harness

Test plans in code or YAML. The harness runs every variant in parallel.

```go
import (
    loom "github.com/rhaqim/loom"
    "github.com/rhaqim/loom/harness"
)

plan := &harness.TestPlan{
    Name: "assistant-v2",
    Session: harness.SessionScript{
        PlatformID: "test-user",
        Steps: []harness.ScriptedStep{
            {AgentSlug: "assistant", ActionPayload: "I enter the cave."},
            {AgentSlug: "assistant", ActionPayload: "I search for traps."},
        },
    },
    Variants: harness.VariantMatrix{
        Providers: []string{"openai", "anthropic"},
    },
    Assertions: []harness.Assertion{
        harness.MinLength(80),
        harness.NoKeyword("ERROR"),
        harness.HasStatus(loom.ResultStatusReady),
    },
}

report, err := harness.Run(ctx, e, plan)
fmt.Printf("Passed: %v\n", report.Passed())
```

## Errors

`RunStep` returns typed errors. Match with `errors.Is` / `errors.As`, never
string comparison.

```go
step, err := e.RunStep(ctx, sess, req)
switch {
case err == nil:
    // ok
case loom.IsSkip(err):
    // a pre-hook skipped the step (not a failure)
case errors.Is(err, loom.ErrNotFound):
    var nf *loom.NotFoundError // nf.Kind ("agent"/"prompt"/...), nf.Key
    errors.As(err, &nf)
case errors.Is(err, loom.ErrGeneratorNotRegistered):
    // misconfiguration
default:
    var ge *loom.GenerationError
    if errors.As(err, &ge) && ge.Kind == loom.GenerationTransport {
        // provider transport failure, safe to retry
    }
}
```

Also typed: `*loom.BudgetExceededError`, `*loom.RetryError` (via `loom.IsRetry` /
`loom.RetryAnnotationFrom`), `loom.ErrInvalidConfig` from `loom.New`,
`loom.ErrNotParticipant` for an action from a non-member, `loom.ErrKeyRejected`
from `VerifyGenerator`, and a `GenerationError` of kind `GenerationRejected` for
a provider's safety refusal. `loom.ErrSessionNotPersisted` is the one partial
success: the step committed but the session row is stale, so recover it with
`Sessions().StateAt`.

## CLI

```bash
loom-cli migrate         # apply the schema
loom-cli seed seed.yaml  # seed agents and prompts
loom-cli test plan.yaml  # run a test plan
```

Set the DSN via `LOOM_DSN` or `--dsn-file <path>`. `--dsn <string>` works but
exposes credentials in `ps`, so prefer the others.

```yaml
prompts:
  - slug: assistant-sys
    version: 1
    kind: system
    category: chat
    body: "You are a vivid storyteller."

agents:
  - slug: assistant
    version: 1
    modal: text
    generator_slug: openai
```

## Project layout

The public API is a thin **facade**: applications import only
`github.com/rhaqim/loom`. The implementation lives under `internal/engine`,
unimportable by other modules, so its layout can change without breaking you.

```
loom/
├── aliases.go          # GENERATED public API: aliases + re-exports
├── llms.txt            # AI-oriented guide
├── internal/engine/    # the implementation, grouped by domain
├── schema/             # idempotent DDL loader (Postgres + SQLite)
├── generator/          # openai, anthropic (own module), replicate, runway, meshy, echo
├── judge/              # RubricJudge, PairwiseJudge, ConstraintJudge
├── evaluator/          # experimental decision primitive (Noul / Choice / Score)
├── gc/                 # background branch GC worker
├── harness/            # TestPlan, VariantMatrix, Assertion DSL
├── cmd/loom-cli/       # migrate, seed, test
└── examples/           # each has its own go.mod
```

`examples/conexus-loom` is a full multi-agent, multimodal session driven by
`RunTurn` that runs with no API keys at all.
