# Roadmap

A living summary of what's currently being worked on in Atomic Testing. This
is manually synced from the issue tracker — there's no GitHub Milestone or
Project board wired up yet, so it may lag. **The
[issue tracker](https://github.com/atomic-testing/atomic-testing/issues) is
the source of truth**; if something here looks stale, check the linked issue.

## Core API → 1.0 stabilization

Freezing and finishing the public API surface ahead of a 1.0 release (see
[ADR-006](agent-docs/adr/006-1.0-api-freeze-and-evolution.md)).

- Epic: [#956](https://github.com/atomic-testing/atomic-testing/issues/956)
- Split the versioning policy out of the ADR into standalone docs:
  [#964](https://github.com/atomic-testing/atomic-testing/issues/964)
- Remaining API cleanup:
  [#972](https://github.com/atomic-testing/atomic-testing/issues/972),
  [#973](https://github.com/atomic-testing/atomic-testing/issues/973),
  [#974](https://github.com/atomic-testing/atomic-testing/issues/974)
- [#961](https://github.com/atomic-testing/atomic-testing/issues/961)

## Storybook 10 integration

A `StorybookInteractor` and supporting developer experience, so scenes can be
driven directly against Storybook stories.

- Umbrella: [#944](https://github.com/atomic-testing/atomic-testing/issues/944)
- `StorybookInteractor`, DX helpers, validation fixture, and docs:
  [#945](https://github.com/atomic-testing/atomic-testing/issues/945)–[#953](https://github.com/atomic-testing/atomic-testing/issues/953)

## Radix UI / shadcn/ui component drivers

New component driver packages for Radix UI primitives and the shadcn/ui shim
built on top of them.

- Umbrella: [#1001](https://github.com/atomic-testing/atomic-testing/issues/1001)
  (`component-driver-radix-v1` + `component-driver-shadcn-v1`)

## MUI-X v9 driver coverage

Extending MUI-X v9 driver support beyond what's currently covered:

- DataGrid interactive features
- A `Chart` driver
- Picker `setValue` support

## Angular support

Exploratory work on bringing the component-driver pattern to Angular
applications, following the same `Interactor` abstraction used by the
React/Vue/Playwright adapters.
