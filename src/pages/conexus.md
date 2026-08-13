---
layout: ../layouts/Doc.astro
slug: conexus
description: "CoNexus is an interactive AI storytelling platform: a Go backend orchestrating LLMs, media generation and vector search behind a real-time narrative runtime. Built from first commit to production."
---

CoNexus turns a prompt into a story you can walk through. Every turn, several
models run at once: one writes the prose, others read what it wrote and derive
continuity, imagery and structure from it. The hard part was never the model
call. It was everything around it.

I built it from the first commit and still lead it. Two of the libraries on this
site, [buckt](/buckt) and [loom](/loom), exist because CoNexus needed them
first.

## What it does

A session is a branching narrative. The player acts, a lead agent streams prose
back token by token, and follower agents analyse that prose concurrently to keep
the world consistent, generate imagery and title the chapter. Sessions can be
forked at any point to explore an alternative path, with the original left
untouched.

Everything is persisted (history, state, cost, every intermediate result) so a
session can be replayed, audited or resumed weeks later.

## Architecture

| Layer | Responsibility |
|---|---|
| Story runtime | Turn orchestration, streaming, branching, replay |
| Agent layer | Versioned prompts and agents per modality, hook pipeline |
| Media pipeline | Async image and video generation, derivative processing |
| Retrieval | Vector search over prior turns and world state for continuity |
| Storage | Media, derivatives and metadata across local disk and object storage |
| Identity | Wallet-linked accounts and on-chain entitlements |

The runtime is Go. Postgres holds sessions, steps and state; Redis handles
transient session data and fan-out; vector search backs narrative continuity.
Media lands wherever it's cheapest to keep.

## What came out of it

Three problems turned out to be general enough to extract into their own
libraries rather than keep as application code.

**Media storage.** Uploading, organising and serving generated media across
providers without pinning the application to one of them became
[buckt](/buckt): folder hierarchies, metadata, image derivatives, dedup and
live backend migration.

**Agent orchestration.** Versioned agents and prompts, session branching, hook
pipelines, cost budgets, judge scoring and a test harness became
[loom](/loom), the same runtime, now modality-agnostic and reusable.

**Evaluation.** Narrative quality is not a unit test. Scoring outputs with a
model against explicit rubric dimensions, and comparing two variants pairwise,
became loom's judge subsystem.

Extracting them made CoNexus smaller and easier to reason about. It also meant
the interesting parts survive independently of any one product.
