---
layout: ../layouts/Doc.astro
slug: conexus
description: "CoNexus is an interactive AI storytelling platform: a Go backend orchestrating LLMs, media generation and vector search behind a real-time narrative runtime. Built from first commit to production."
---

CoNexus turns a prompt into a story you can walk through. Every turn, several
models run at once: one writes the prose, others read what it wrote and derive
continuity, imagery and structure from it. The hard part was never the model
call. It was everything around it.

I built it from the first commit and lead its engineering. Underneath, it runs
on two libraries I wrote on my own initiative and maintain myself:
[buckt](/buckt), my MIT-licensed media library, and loom, my agent engine, at the
stable release I handed over to DGRS Labs. I develop loom independently as
[Noewright](/noewright).

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

## The libraries underneath

CoNexus uses two of my libraries rather than keeping that code in the
application.

**Media storage: [buckt](/buckt).** Uploading, organising and serving generated
media across providers without pinning the application to one of them: folder
hierarchies, metadata, image derivatives, dedup and live backend migration.
DGRS Labs uses buckt under its MIT licence.

**Agent orchestration: loom.** CoNexus's agents run on loom: versioned agents and
prompts, session branching, hook pipelines, cost budgets, judge scoring and a test
harness. DGRS Labs runs CoNexus on the stable loom release I handed over; changes
made to that copy since then are DGRS Labs' own.

**Evaluation.** Narrative quality is not a unit test, so CoNexus scores its output
with loom's judges: a model rates it against explicit rubric dimensions, or
compares two variants pairwise.

loom carries on as [Noewright](/noewright): a general-purpose, modality-agnostic
engine I develop independently, including for my MSc research. Noewright is not
tied to CoNexus or to storytelling.
