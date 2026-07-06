<!--
PRs are squash-merged: this PR's title becomes the commit subject, which is
also the CHANGELOG's raw material. Title it `type(scope): summary` per the
convention in CONTRIBUTING.md — see "Commit & PR message conventions".
-->

## Summary

<!-- What changed, and why. -->

## Checks

- [ ] `pnpm run check:type`
- [ ] `pnpm run check:lint`
- [ ] `pnpm run check:style`
- [ ] `pnpm test:dom` (relevant packages)
- [ ] `pnpm test:e2e` (relevant packages, all three browsers)

## Breaking change

- [ ] This PR introduces a breaking change (title uses `!`, e.g. `feat(core)!: ...`)
