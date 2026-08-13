---
layout: ../layouts/Doc.astro
slug: brisa
description: "Public site and programme directory for the Brisa Women's Foundation. Built to be fast on poor connections and editable by people who don't write code."
---

A non-profit's website has two audiences that pull in opposite directions: the
people it serves, often on slow connections and older devices, and the small
team that has to keep it current without an engineer on call.

## Constraints

Static rendering, no client-side framework runtime on content pages, and images
sized for the device that requests them. The site had to stay usable on a 3G
connection and a five-year-old phone, because that is what a meaningful share of
the audience actually has.

On the other side, every piece of copy, programme listing and image is editable
without touching a repository. No deploy step in an editor's workflow, no
engineer in the loop to fix a typo.

## Outcome

A Next.js site with a content layer the team owns. Programme pages, events and
contact routing are all managed by staff. The engineering surface is small on
purpose. The failure mode of a non-profit site is not slow queries, it's a
stale page nobody could figure out how to change.
