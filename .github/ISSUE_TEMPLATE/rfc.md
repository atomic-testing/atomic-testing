---
name: RFC
about: Propose a design/architecture change for discussion before implementation
title: '[RFC] '
labels: rfc
assignees: ''
---

Use this template for proposals too large for a single issue or PR: a new
driver family, a breaking API change, a new package, or a cross-cutting
architecture change. Smaller requests (a new method on an existing driver, a
new driver for one component) belong in a regular "Feature request" issue
instead.

The sections below mirror the repo's ADR format
(`agent-docs/adr/`, indexed in `agent-docs/INDEX.md`) so accepted RFCs can be
carried forward into an ADR with minimal rework.

**Summary**
A one- or two-paragraph description of the change, written so a maintainer
can understand what's being proposed without reading the rest of the issue.

**Motivation / problem**
What problem does this solve, and why now? What's the cost of not doing it?
Link related issues/discussions if any.

**Proposed approach**
The design itself: affected packages/interfaces, new types or exports, and
how it fits the existing layer stack (`TestEngine` → `ComponentDriver` →
`Interactor` → `PartLocator`). Sketch the public API surface where relevant.

**Alternatives considered**
Other approaches you considered (including "do nothing") and why they were
not chosen.

**Impact**

- Breaking change? If yes, describe the migration path.
- New package? If yes, proposed name and its position in `packages/`.
- Does this touch the frozen 1.0 API surface (see
  [ADR-006](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/006-1.0-api-freeze-and-evolution.md))?
  If so, note whether it's additive (minor-compatible) or requires a major bump.
- Any affected `Interactor` implementers, per the post-1.0 evolution
  constraint in ADR-006 §6 /
  [ADR-007](https://github.com/atomic-testing/atomic-testing/blob/main/agent-docs/adr/007-interactor-evolution-and-composition.md).

**Open questions**
Anything unresolved that needs maintainer or community input before this can
move to an ADR and implementation.
