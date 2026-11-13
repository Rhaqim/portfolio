---
layout: ../../layouts/Note.astro
slug: linking-records
---

A client needed one view of each person across a dozen independent public
sources, each with its own usernames and no shared IDs. Downstream, a team acted
on that view, so a wrong merge was worse than a missed one: it put one person's
history in front of decisions about another. These are the rules the system
ended up with. I've moved them to a neutral example: one person who exists as
`ada.l` in a web shop, `AdaL` in a support desk and `ada_l` on a newsletter list.

## Two kinds of match, and only one merges

Normalising usernames (case, separators, unicode confusables) makes the three
records above **exact** matches, and those join automatically into a
*provisional* group. Anything looser, such as `adal1815` or `ada.lovelace`, is a
**candidate**: it gets a confidence score and a place in a review queue, and
nothing else. Fuzzy matching never merges on its own.

Provisional isn't the same as confirmed. A provisional group can be looked at,
but anything that acts on a person (here, exporting them to the team) refuses
until someone confirms the group with evidence: an email in a ticket, a matching
avatar, a shared order address. "Probably the same" is a fine reason to look and
a bad reason to act.

## Decisions live on pairs, not on groups

The obvious model stores membership: account → group. It breaks the first time
someone says "these two are *not* the same", because the next import sees two
exact matches and joins them right back.

So human decisions are stored on **pairs of accounts**, separately from
membership:

```sql
CREATE TABLE identity_reviews (
  account_a   INTEGER NOT NULL,
  account_b   INTEGER NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('confirmed', 'rejected', 'detached')),
  evidence    TEXT NOT NULL,
  reviewed_by TEXT NOT NULL,
  reviewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (account_a, account_b),
  CHECK (account_a < account_b)   -- one row per pair, whichever way round
);
```

The automatic joiner reads this table before it joins anything. A rejected pair
is never re-joined, a detached account stays out of its old group, and a
confirmed pair survives any amount of re-ingestion. Evidence and reviewer are
mandatory, so every link has a reason someone can read later.

## Membership changes are moves, and every move is logged

Splitting and merging are both expressed as moving an account from one group to
another, and each move writes an audit row: account, from-group, to-group,
action, evidence, reviewer, time. Undoing a bad merge is a move back, not a
restore from backup, and "why are these together?" has an answer for every
account in every group.

## Evidence belongs to accounts

Every observation (a sighting, a purchase, a ticket) is attached to the
**account** that produced it, never to the group. Groups are a view computed
over accounts. Split a group and each half keeps exactly the history that is
really its own; nothing has to be re-attributed, and nothing is lost.

The same goes for restrictions. A "do not contact" flag set on one account stays
on that account and applies to whatever group it is currently in. Merge it into
a new group and the whole group is restricted; split it out and the restriction
leaves with it. One rule outlived every merge: an account that has already been
acted on can't be acted on again through a different group after a split.

## Revisions make stale decisions fail loudly

Each group has a revision number that increments on every membership change.
Anything downstream that depends on "who is this person" records the revision it
was made against. An approval made before a merge is stale after it: the export
re-checks the revision, sees the mismatch and refuses, rather than acting on a
group that no longer means what the reviewer saw.

## Recompute only when the evidence moved

Scoring every group on a timer is wasteful and, worse, nondeterministic: two runs
over the same data in the same day could produce different queues. Instead, SQLite
triggers bump a single, monotonic **evidence revision** on any insert or update to
the tables that feed scoring: observations, identity decisions, restrictions and
review outcomes. A worker checks it every minute and rebuilds only when it changed.

A rebuild reads groups in keyset-paginated chunks, computes every assessment, and
publishes the whole batch in one transaction, so a crash leaves the previous queue
intact rather than half of a new one. Each assessment is immutable and stores its
inputs and the reasons for its result, so "why is this person on hold?" is a
lookup, not a re-derivation.

## Unknown is not zero

Several sources reported numbers in different currencies, periods and units, and
some reported partial lists. The rule that saved the most arguments: an
observation keeps where it came from (source, period, currency, conversion rate
and when it was fetched), and anything that can't be compared stays marked as
not comparable. A missing value contributes nothing to a score; it never gets
quietly filled in as zero, and a partial list is never treated as complete.

## What I'd keep

- Auto-merge only on exact, normalised matches. Score everything else for a human.
- Store human decisions on pairs, and make the automatic path obey them.
- Attach evidence and restrictions to the smallest unit (the account), and compute
  groups over them.
- Version identity, and make every downstream action check the version.
- Drive recomputation from a revision counter, publish atomically, and keep the
  inputs with every result.

None of this is exotic. It's mostly about putting each fact at the level where it
stays true when everything around it changes.
