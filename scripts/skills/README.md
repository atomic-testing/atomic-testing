# Skills governance & the golden-fixture harness

Tooling that keeps the four adopter-facing Claude Code Skills
(`.claude/skills/{scaffold-test-driver,author-component-tests,diagnose-test-failure,sync-test-driver}/SKILL.md`)
honest, and that regression-tests the "correct decomposition" they teach.

The skills are **instructions for an agent**, not a codegen program — there is
no function to invoke that mechanically regenerates a driver. So this harness
splits cleanly into the part that **can** be automated (structural invariants,
claim-syncing) and the part that **cannot** (grading an agent's regenerated
driver), which is documented as a manual eval step rather than half-automated.

## Scripts

| Script                       | What it does                                                                                     | Wired as                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------- |
| `driverStructure.mjs`        | Pure analyzer: driver-file source → structural findings (errors + advisory warnings).           | library                       |
| `check-driver-structure.mjs` | CLI over the analyzer. No args → scans the golden example drivers. `--page` for a page scene.    | `pnpm check:driver-structure` |
| `check-golden-fixtures.mjs`  | Asserts the golden fixtures stay structurally clean **and** the signup anti-pattern still holds. | `pnpm check:golden-fixtures`  |
| `antiPattern.mjs`            | Detects whether `example-mui-signup-form` grew a wizard page object (an **inverted** check).     | library                       |
| `snapshot-fixture.mjs`       | Strip / restore a golden driver for the eval workflow below.                                     | run directly                  |
| `fixtureStrip.mjs`           | Pure consumer-un-wiring transforms used by the snapshot tool.                                    | library                       |

The `skillClaims.mjs` / `check-skill-sync.mjs` / `skillEmbed.mjs` /
`gen-skill-content.mjs` scripts (the `check:skill-sync` claim-drift gate and the
scaffolder's embedded skill copy) land alongside these and are documented where
they are wired.

Unit tests (`*.test.mjs`) run with Node's built-in runner: `pnpm test:skills`
(`node --test`). No extra dependency.

## The structural analyzer

`analyzeDriverSource(source, { fileName, page })` classifies a file as a driver
or a scene and checks the fixed composite-driver idioms from
`scaffold-test-driver` Phase 5:

- **Errors** (fail the build): the contravariant-constructor rule is violated by
  a parameterized `IComponentDriverOption<…>`; a parts object lacks
  `satisfies ScenePart`; a page-level scene has ≠1 root entry (rule 6).
- **Warnings** (surfaced, never fail): a driver exceeds the ~7–10 direct-parts
  ceiling (some single-domain drivers legitimately do — `AdminSettingsDriver`
  has 13); the `AssertScenePlaceableDriver` lock is absent (the shipped example
  drivers omit it and are still correct, so it is advisory).

Point it at any driver — hand-written or agent-generated:

```bash
node scripts/skills/check-driver-structure.mjs path/to/MyDriver.ts
```

## Golden-fixture eval workflow (the manual part is manual on purpose)

The example apps under `examples/` are the answer key: each uses one thin
page-object driver composing feature drivers. To regression-test the
`scaffold-test-driver` skill against a real, known-good target:

1. **Strip** a golden driver to create a clean, repeatable coverage gap:

   ```bash
   node scripts/skills/snapshot-fixture.mjs strip admin-settings
   ```

   This backs up `AdminSettingsDriver.ts` and `WorkspaceDriver.ts` (gitignored),
   deletes the driver, and un-wires it from the page object.

2. **Regenerate** — hand the stripped example to an agent session driving the
   `scaffold-test-driver` skill (Phases 1–6). **This step is not scripted**: a
   script must never spawn an LLM invocation here; that is the eval-time human/
   agent action.

3. **Score** — deterministically, with the two gates the harness provides:

   ```bash
   node scripts/skills/check-driver-structure.mjs \
     examples/example-astryx-workspace/src/testing/AdminSettingsDriver.ts
   ( cd examples/example-astryx-workspace && pnpm test:dom )   # and pnpm test:e2e
   ```

   Structural findings + the example's own existing tests are the objective
   scorecard. (The example's tests import the driver tree, so a good
   regeneration turns them green; a bad one shows up as structural errors or red
   tests.)

4. **Restore** the golden files byte-for-byte:

   ```bash
   node scripts/skills/snapshot-fixture.mjs restore admin-settings
   ```

`git checkout` / `sl revert` on the two files also restores them; the backup is
just an SCM-agnostic convenience.

## The inverted anti-pattern check

`example-mui-signup-form` is the repo's named decomposition anti-pattern: each
wizard step has a feature driver, but no page-object driver composes them.
`check-golden-fixtures.mjs` asserts that gap **still exists** — so the check is
green today. The day someone adds a composing wizard driver, the check goes red
on purpose, prompting whoever fixed it to flip the assertion (in
`antiPattern.mjs`) into a positive "the wizard has a page object" requirement and
to update the anti-pattern framing in
`docs/docs/guides/decomposing-driver-trees.md`.

## What is deliberately NOT automated

The "un-seeded completeness check" — handing the skill a component from an
external app and having a human grade it — is out of scope for this harness. It
requires human judgment on a novel target and is tracked as future work on the
issue, not attempted here.
