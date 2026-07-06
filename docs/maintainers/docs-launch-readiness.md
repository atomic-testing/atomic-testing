# Docs launch-readiness rubric & scorecard

A **repeatable** way to grade the documentation site against fixed criteria, so "is it good enough to launch?" has an evidence-based answer instead of a vibe. Tracked by umbrella issue [#938](https://github.com/atomic-testing/atomic-testing/issues/938).

This file is the single source of truth for **what** we measure, **how** we grade, and the **bar** to clear. Re-grade and update the scorecard whenever the docs change materially (and before any docs launch / major announcement).

## Criteria

Five criteria, each graded A–F. The first two are launch-blocking because they can carry `critical` findings.

| #   | Criterion                                 | What it measures                                                                                                                                          |
| --- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Technical accuracy & drift**            | Every code sample, import, API name, signature, capability table, and version claim matches the real, currently-built packages.                           |
| 2   | **Walkthrough / build a unit test**       | A newcomer can go install → configure a runner → render → assert → clean up and reach a green test **from the docs alone**.                               |
| 3   | **Architecture clarity**                  | One early, correct, canonical picture maps Driver / Interactor / ScenePart / Locator / TestEngine and where each binds to React / Vue / Playwright / DOM. |
| 4   | **Homepage / elevator pitch**             | The landing page names the problem, makes the unique value credible and provable, and lets a reader imagine the gains.                                    |
| 5   | **Information architecture & navigation** | Coherent Diátaxis-shaped structure, working links, curated bridge into the generated API, no dead ends.                                                   |

## Grading bands

| Grade | Meaning                                                                                         |
| ----- | ----------------------------------------------------------------------------------------------- |
| **A** | Exemplary. No open findings above `low`. A skeptic finds nothing material.                      |
| **B** | Solid. No `critical`/`high`; only `medium`/`low` polish remains.                                |
| **C** | Serviceable but flawed. No `critical`, but `high` issues remain that a careful reader will hit. |
| **D** | Misleading. At least one `critical`, or many `high`, that break trust or block the happy path.  |
| **F** | Broken. The primary path fails (e.g. the first copy-pasted example doesn't compile).            |

Use `+`/`−` for within-band nuance.

### Severity of individual findings

| Severity   | Definition                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `critical` | Breaks the reader's happy path or headline claim (e.g. the hero/Quick-Start code doesn't compile). |
| `high`     | Materially misleads or blocks a common task; a careful reader hits it.                             |
| `medium`   | Wrong/confusing but with a workaround or limited blast radius.                                     |
| `low`      | Minor inaccuracy or polish.                                                                        |
| `nit`      | Cosmetic.                                                                                          |

## Launch bar (current policy: **moderate**)

Docs are "good enough to launch" when **all** hold:

1. **Zero `critical` findings** across all five criteria.
2. **Every criterion ≥ C.**
3. **Clean docs build** with `onBrokenLinks: 'throw'` in `docusaurus.config.ts`, and the **doc-accuracy gate green**.

Known `medium`/`low` debt may ship if it is tracked under the umbrella.

## How to re-measure

### Objective checks (fast, run on every docs PR)

- **Symbol/import accuracy:** `node docs/scripts/check-doc-accuracy.mjs` — verifies every `@atomic-testing/*` import in the docs (including code embedded as template strings on the homepage) resolves to a real package export, and denylists known-fabricated names. Exit 0 = clean.
- **Links & build:** `cd docs && pnpm build` with `onBrokenLinks: 'throw'` fails the build on any broken internal link.

The gate is **wired into CI** and currently green: the symbol fixes landed alongside it, so the build stays green on every docs PR and red-bars the moment a fabricated symbol or invalid import reappears. The step in `.github/workflows/doc-ci.yml` runs before "Build packages":

```yaml
# .github/workflows/doc-ci.yml
- name: Check doc accuracy (imports match real package exports)
  run: node docs/scripts/check-doc-accuracy.mjs
```

These two cover most of **criterion 1** and the link half of **criterion 5** automatically. They are the durable guardrails — green here is necessary but not sufficient for launch.

### Qualitative re-grade (criteria 2–5 and the prose half of 1)

Re-run the saved audit harness, which fans out market research + a five-dimension evaluation and adversarially re-verifies every finding against the source:

- Harness: `docs/scripts/audit/docs-audit.workflow.js`
- Run it via Claude Code's Workflow tooling (it orchestrates subagents; it is **not** a `node` script). Update the `DOCS` / `PKGS` / `REPO` path constants at the top to match the local checkout, then launch it and watch with `/workflows`.
- Record the returned per-criterion grades + any new findings back into the scorecard below, and open/update child issues as needed.

### Future enhancement

Add a snippet-level `tsc` doctest (extract fenced `ts`/`tsx` blocks and type-check them against the published `.d.ts`, or convert inline examples to `raw-loader` snippets like the ones under `docs/docs/snippets/`). That upgrades criterion 1 from "symbol exists" to "the whole sample type-checks."

## Scorecard

### Baseline — 2026-06-29 (initial audit)

| Criterion                          | Grade  | Open `critical` |    Launch-ready?    | Issue                                                               |
| ---------------------------------- | :----: | :-------------: | :-----------------: | ------------------------------------------------------------------- |
| 1. Technical accuracy & drift      | **C**  |        1        |         ❌          | [#939](https://github.com/atomic-testing/atomic-testing/issues/939) |
| 2. Walkthrough / build a unit test | **C−** |        3        |         ❌          | [#940](https://github.com/atomic-testing/atomic-testing/issues/940) |
| 3. Architecture clarity            | **C+** |        0        | ⚠️ (≥C but improve) | [#941](https://github.com/atomic-testing/atomic-testing/issues/941) |
| 4. Homepage / elevator pitch       | **C+** |        1        |         ❌          | [#942](https://github.com/atomic-testing/atomic-testing/issues/942) |
| 5. Information architecture        | **C+** |        0        | ⚠️ (≥C but improve) | [#943](https://github.com/atomic-testing/atomic-testing/issues/943) |

**Overall: NOT launch-ready** — 4 open `critical` findings (all one root cause: inline examples were never compiled). The doc-accuracy gate reproduces them (`node docs/scripts/check-doc-accuracy.mjs` currently reports them). Clearing #939 + #940 + #942 removes every `critical` and should move all criteria to ≥ C.

### 2026-07-06 (goal: B+ minimum — 5 deep audits, 8 fix rounds, 15 commits)

A user-directed push to bring all five criteria to at least B+. Investigation, fixing, and re-grading
ran in a loop: re-verify findings → dispatch parallel sonnet subagents scoped to non-overlapping files
→ verify (doc-accuracy gate + `pnpm build`) → commit/push → re-run the full audit workflow → repeat.

**Round 1** (re-verified the 2026-06-29 baseline's own findings, which had already been fixed by
unrelated PRs #954/#999/#1009/#1000/#1008 landed 06-29→07-02): 3 commits closing residual/new items —
`b58c024`, `458c32a`, `f25c85a`.

**Rounds 2–8** (5 fresh full audits via `docs/scripts/audit/docs-audit.workflow.js`, ~40 agents/
~2M tokens each): each audit's `high`/`critical` findings were fixed and re-verified. 12 further
commits — `4e43a4a`, `9a69fe5`, `a2ca5c1`, `f6cdb2c`, `e1f546c`, `2c22762`, `4beb5e0`, `dd635cc`,
`4556f94`, `8bfa9ab`, `8d23d54`, `7d197f9`. Representative fixes: a critical copy-paste-breaking
install bug (`@atomic-testing/core` missing from quick-start's Vue/Playwright tabs); a critical Vue
Vitest `ReferenceError` (missing `globals: true`); fabricated capability claims (a nonexistent
"Bootstrap" driver, an RTL-vs-`@testing-library/dom` misattribution); a documented
custom-Interactor workflow no `createTestEngine` factory actually supports; missing
`ContainerDriver`/`ListComponentDriver`/`StorybookInteractor` coverage; a 404ing `editUrl` on ~681
generated API pages; `api-overview.mdx` covering only 10 of ~29 packages; stale MUI/MUI-X driver
tables missing ~a third of real exports; broken architecture-diagram deep-links; IA fixes (sidebar
reorder, FAQ recategorized, navbar/footer "front door" conflict).

**Objective gates**: `check-doc-accuracy.mjs`, `check-doc-driver-sync.mjs`, and `pnpm build`
(`onBrokenLinks: 'throw'`) all green after every commit in this session.

**Grades — last fully-audited state (5th audit, before the round-8 fix commit `7d197f9`)**, with the
rubric's severity rule applied literally (any open `high`/`critical` caps a criterion below B,
regardless of the audit's own holistic letter):

| Criterion                          | Open `critical`/`high` (5th audit) | Fixed after, unverified by a 6th audit |
| ----------------------------------- | :---------------------------------: | --------------------------------------- |
| 1. Technical accuracy & drift      | 1 high (stale MUI tables), 1 medium | ✅ both fixed in `7d197f9`               |
| 2. Walkthrough / build a unit test | 1 **critical**, 1 high              | ✅ both fixed in `8d23d54`               |
| 3. Architecture clarity            | 0 (3 medium, 1 low only)            | already clear                           |
| 4. Homepage / elevator pitch       | 1 high (Angular absent from live demo) | ❌ **not fixed** — see below          |
| 5. Information architecture        | 1 high (navbar/footer disagree)     | ✅ fixed in `8d23d54`                    |

**Homepage (#942) is the one known gap against the B+ goal.** Across 3 separate audit passes, the
homepage's Angular positioning oscillated between two failure modes: claiming Angular parity the
live 3-tab demo doesn't show (fixed by removing the claim), and — once removed — the demo itself
correctly being flagged as incomplete for omitting a fully-shipped, versioned framework. The honest
fix is a 4th, verified Angular tab in the interactive demo; every round assessed this as a real
UI/content lift disproportionate to that round's scope and deferred it. It is unfixed today and is
the most concrete, actionable remaining item — filed here rather than silently dropped.

**Process note for future re-grades**: this session's 5 independent full-audit passes did not
converge to a single "zero highs everywhere" snapshot — each fresh ~40-agent audit surfaced some
genuinely different specific defects even in files the prior round had just fixed (Technical
Accuracy went clean → 1 new high next round → clean again; Architecture and Homepage similarly
oscillated). In a docs site this large (19+ narrative pages, 27+ packages, ~681 generated files),
a single audit pass has real, non-trivial variance in what it happens to dig into deeply — treat
any one audit's "zero highs" as strong evidence, not a permanent proof. The `check-doc-accuracy.mjs`
gate catches import/symbol drift on every PR; it does not catch prose accuracy, cross-page
consistency, or IA structure, which is why these findings kept surfacing despite a green gate. The
"Future enhancement" snippet-level `tsc` doctest (below) would close part of that gap; a
periodic (not per-PR) re-run of the full audit workflow is the only current lever for the rest.

<!-- Append a new dated row-set here after each re-grade. Do not overwrite history. -->
