---
layout: ../layouts/Doc.astro
slug: ussd
description: "ussdframework is a Rust toolkit for building USSD applications: declarative JSON menus, session management, input validation, expression routing, and an optional database-backed menu builder with a visual flow editor."
---

USSD is how most of a continent banks. It runs on feature phones, over the
signalling channel, with no app store and no internet, and every flow is a
state machine with a two-second budget. `ussdframework` handles session
management, screen navigation, input validation, function dispatch and routing,
so you write business logic instead of a state machine.

An optional **Menu Builder** module adds an admin portal and REST API for
managing menu configuration in a database, with a visual flow editor, JSON
import/export, and SQLite or PostgreSQL behind it.

```
+-------------------------------+
|         Telco / Gateway       |
|  formats USSD requests and    |
|  serializes responses         |
+---------------+---------------+
                |
                v
+-------------------------------+
|      USSD Framework Layer     |
|                               |
|  ┌──────────┐  ┌───────────┐  |
|  │  Router  │  │  Session  │  |
|  └────┬─────┘  └─────┬─────┘  |
|       │              │        |
|  ┌────▼──────────────▼─────┐  |
|  │     Screen Executor     │  |
|  │  Menu / Input / Router  │  |
|  │  Function / Quit        │  |
|  └────────────┬────────────┘  |
+---------------+---------------+
                |
                v
+-------------------------------+
|        Service Layer          |
|  Your Rust functions, HTTP    |
|  calls, database queries      |
+-------------------------------+
```

## Install

```toml
[dependencies]
ussdframework = "0.1.0"
```

With the Menu Builder (SQLite is the default backend):

```toml
ussdframework = { version = "0.1.0", features = ["menubuilder"] }
```

With PostgreSQL instead:

```toml
ussdframework = { version = "0.1.0", features = ["menubuilder", "db-postgres"], default-features = false }
```

| Feature | Default | Description |
|---|:---:|---|
| `db-sqlite` | yes | SQLite database backend |
| `db-postgres` | no | PostgreSQL database backend |
| `menubuilder` | no | Admin portal and REST API |

## Quick start

```rust
use ussdframework::prelude::*;

fn main() {
    let mut app = UssdApp::new(true, None);

    // Load screen definitions
    let content = include_str!("../examples/data/menu.json");
    let menus: USSDMenu = serde_json::from_str(content).unwrap();

    // Register your business-logic functions
    app.register_functions(my_functions());

    let request = USSDRequest {
        msisdn: "1234567890".to_string(),
        session_id: "session-abc".to_string(),
        input: "1".to_string(),
        service_code: "*123#".to_string(),
        language: "en".to_string(),
    };

    let response = app.run(request, menus);
    println!("{}", response.message);
}
```

## Screen types

Every screen declares a `screen_type` that determines how the framework handles
it.

| Type | Displays | Waits for input | Use |
|---|:---:|:---:|---|
| `Initial` | no | no | Entry point; auto-advances to `default_next_screen` |
| `Menu` | yes | yes | Numbered options; validates the selection |
| `Input` | yes | yes | Free-text prompt with regex + max-length validation |
| `Function` | no | no | Calls a registered function; stores the result in session data |
| `Router` | no | no | Evaluates conditions against session data and branches |
| `Quit` | yes | no | Final message; ends the session |

The request lifecycle:

```
Incoming request
      │
      ▼
 Resolve or create session
      │
      ▼
 Has session timed out? ──Yes──► Restart from InitialScreen
      │ No
      ▼
 Loop over current screen:
  ├── Initial  ──► auto-advance, no display
  ├── Function ──► call registered function, advance
  ├── Router   ──► evaluate expressions, advance
  ├── Menu     ──► display options, wait for input
  ├── Input    ──► display prompt, validate input, wait
  └── Quit     ──► display message, end session
      │
      ▼
 Persist session, return response
```

Two navigation shortcuts are built into every screen: `0` goes back one screen,
`00` returns to the first screen visited.

## Screen properties

| Property | Type | Required | Description |
|---|---|:---:|---|
| `text` | string or `{"lang": "..."}` map | yes* | Display text; supports `{{variable}}` interpolation. *Not rendered for Function/Router/Initial. |
| `screen_type` | string | yes | One of the six types above |
| `default_next_screen` | string | yes | Fallback when no condition matches |
| `menu_items` | object | Menu only | Map of named option objects |
| `input_identifier` | string | Input only | Session key the input is stored under |
| `validation_regex` | string | no | Pattern the input must match |
| `max_length` | number | no | Max character count |
| `max_retries` | number | no | Failed attempts before redirecting |
| `timeout_screen` | string | no | Where to send the user once retries run out |
| `function` | string | Function only | Name of the registered function |
| `router_options` | array | Router only | Ordered `{ router_option, next_screen }` pairs |
| `service_code` | string | no | Service code that activates this entry point |

```json
"menu_items": {
  "UniqueKey": {
    "option": "1",
    "display_name": "Balance Inquiry",
    "next_screen": "BalanceScreen"
  }
}
```

## Menu configuration

The top-level JSON has two keys: the screens themselves, and the services they
can call.

```json
{
  "menus": {
    "ScreenName": { }
  },
  "services": {
    "check_balance": {
      "function_name": "check_balance",
      "function_url":  "http://my-app:3000/ussd/check_balance",
      "data_key":      "balance_result"
    }
  }
}
```

| Field | Description |
|---|---|
| `function_name` | Must match a key registered via `register_functions()`. If no Rust function is found, `function_url` is tried instead. |
| `function_url` | HTTP endpoint the framework POSTs the session to. This is what makes functions polyglot. |
| `data_key` | Where the result lands in `session.data`; reference it as `{{data_key.field}}` |

## Validation and retries

```json
"EnterPinScreen": {
  "text": "Enter your 4-digit PIN:",
  "screen_type": "Input",
  "input_identifier": "pin",
  "validation_regex": "^[0-9]{4}$",
  "max_length": 4,
  "max_retries": 3,
  "timeout_screen": "PinLockedScreen",
  "default_next_screen": "VerifyPinFunctionScreen"
}
```

`max_length` is checked before the regex. After `max_retries` consecutive
failures the user is sent to `timeout_screen`, usually a Quit screen explaining
the lockout.

## Routing

A Router screen evaluates `router_options` in order and jumps to the first
match, falling through to `default_next_screen` if nothing matches. Expressions
that don't parse are logged as warnings at menu-load time by
`validate_router_expressions`, not at 2 a.m. in production.

```json
"router_options": [
  { "router_option": "{{balance.status == 'success'}}", "next_screen": "BalanceResultScreen" },
  { "router_option": "{{balance.status == 'failed'}}",  "next_screen": "NetworkErrorScreen" }
]
```

Syntax is `{{<session_key> <op> '<value>'}}`, supporting `==`, `>`, `>=`, `<`
and `<=`.

## Sessions

The framework keeps one session per `session_id`.

| Field | Description |
|---|---|
| `session_id` | Unique identifier from the incoming request |
| `msisdn` | Caller's phone number |
| `language` | Language code used for multi-language text lookup |
| `data` | Key-value store for collected inputs and function results |
| `current_screen` | Screen being processed |
| `visited_screens` | Stack backing `0` (back) navigation |
| `screen_attempts` | Per-screen failed-attempt counter |
| `end_session` | `true` once a Quit screen is reached |

There is a default in-memory store, but you should replace it in production.
Implement `SessionCache` and pass it to `UssdApp::new`:

```rust
use ussdframework::prelude::*;

pub struct RedisSession { /* ... */ }

impl SessionCache for RedisSession {
    fn store_session(&self, session: &USSDSession) -> Result<(), String> {
        let json = serde_json::to_string(session).map_err(|e| e.to_string())?;
        // write json to Redis under session.session_id
        Ok(())
    }

    fn retrieve_session(&self, session_id: &str) -> Result<Option<USSDSession>, String> {
        // read from Redis, deserialize, return
        Ok(None)
    }
}

fn main() {
    let mut app = UssdApp::new(false, Some(Box::new(RedisSession::new())));
}
```

## Functions

Registered functions conform to
`USSDFunction: fn(&USSDSession, &str) -> USSDData`. The return value is stored in
`session.data` under the service's `data_key`.

```rust
use ussdframework::prelude::*;

fn get_balance(session: &USSDSession, input: &str) -> USSDData {
    let json = json!({ "status": "success", "balance": "KES 1,234.56" });
    USSDData::new(Some(json))
}

fn main() {
    let mut app = UssdApp::new(true, None);

    let mut fns = std::collections::HashMap::new();
    fns.insert("get_balance".to_string(), get_balance as USSDFunction);

    app.register_functions(fns);
}
```

### Webhook functions

When a service's `function_name` is **not** registered in the Rust
`FunctionMap`, the framework POSTs the full session to `function_url` instead.
That makes handlers polyglot: Python, Go, TypeScript, whatever your team
already runs, with no Rust in your main project.

```python
# FastAPI
@app.post("/ussd/check_balance")
async def check_balance(request: Request):
    session = await request.json()
    # session["data"] holds every previously collected input
    return {"balance": "KES 1,234.56"}
```

Whatever JSON you return is stored at `session.data[data_key]`.

> A registered Rust function always wins. The webhook is only called when no
> Rust function is found, and both modes can coexist in the same menu.

## Multi-language

`text` accepts either a plain string or a language map:

```json
"text": {
  "en": "Welcome to Demo Bank",
  "fr": "Bienvenue à Demo Banque",
  "sw": "Karibu Demo Benki"
}
```

Resolution uses `session.language`, falling back to `"default"` (the value
stored when a plain string is used), then to an empty string. Set the user's
language with an Input screen early in the flow.

## Menu builder

An optional database-backed admin portal for editing screens at runtime. No
code changes, no redeploy. `app.serve()` starts a single Actix-web server
handling both `POST /ussd` and the portal, running migrations on startup.

```rust
use ussdframework::prelude::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mut app = UssdApp::new(true, None);
    app.register_functions(my_functions());

    app.serve(
        8080,                            // port
        Some("examples/data/menu.json"), // optional JSON seed, loaded once
        None,                            // DB URL; falls back to USSD_DATABASE_URL
    ).await
}
```

The portal manages screens, menu items, router options and services, and does
JSON import/export. `/admin/menu_nodes` opens a ReactFlow visual editor: a
colour-coded node graph of the whole flow, edges labelled with menu options and
router conditions, click-to-edit panels, a legend and a minimap. All screens
load in three parallel requests and are grouped client-side, with no per-screen
round-trips.

### REST API

Everything the portal does is available at `http://localhost:8080/api/`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/screens` | List all screens |
| `POST` | `/api/screens` | Create a screen |
| `PUT` | `/api/screens` | Update a screen |
| `GET` | `/api/screens/{name}` | Get a screen by name |
| `DELETE` | `/api/screens/{name}` | Delete a screen |
| `GET` | `/api/screens/multiple?ScreenName=X` | Get screens matching a query |

The same five verbs exist for `/api/menu_items`, `/api/router_options` and
`/api/services`, each with a `multiple?ScreenName=X` variant. Bulk operations
live at `POST /api/upload` (seed the database from JSON) and `GET /api/download`
(export the live configuration).

```rust
use ussdframework::builder::menubuilder::MenuBuilder;

MenuBuilder::to_json(Some("output/menu.json"));   // export
MenuBuilder::from_json(Some("input/menu.json"));  // import
```

## Self-hosting

Run the framework as a standalone Docker service and call it over HTTP, with no Rust
required anywhere in your stack.

| Variable | Default | Description |
|---|---|---|
| `USSD_PORT` | `8080` | Port the server binds to |
| `USSD_DATABASE_URL` | `/app/data/menu.sqlite3` | SQLite path or Postgres connection string |
| `USSD_JSON_SEED` | unset | JSON seed file loaded once on first run |

```bash
docker run --rm -p 8080:8080 \
  -v "$(pwd)/examples/data/menu.json:/app/menu.json:ro" \
  -e USSD_JSON_SEED=/app/menu.json \
  ussdframework:latest
```

The included Compose file starts the framework alongside an example Python
webhook handler:

```bash
make docker-up    # start
make docker-down  # stop
```

```
Telco gateway  ──POST /ussd──►  ussdframework container
                                        │
                           webhook POST │ (Function screen)
                                        ▼
                               your-app container
                               (Python / Go / Node.js)
```

## Example

The bundled example covers main-menu navigation, balance inquiry with PIN
validation and retry limits, a send-money input chain with confirmation, airtime
purchase, account management, English/French selection, and error, network-error
and lockout screens.

```bash
make run             # menu builder + /ussd on :8080
make run-standalone  # plain /ussd on :8081, no DB or portal
```

```json
POST http://127.0.0.1:8080/ussd

{
  "msisdn": "0712345678",
  "session_id": "test-session-1",
  "input": "",
  "service_code": "*123#",
  "language": "en"
}
```
