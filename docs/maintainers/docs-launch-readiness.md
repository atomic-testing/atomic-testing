# Docs launch-readiness rubric & scorecard

A **repeatable** way to grade the documentation site against fixed criteria, so "is it good enough to launch?" has an evidence-based answer instead of a vibe. Tracked by umbrella issue [#938](https://github.com/atomic-testing/atomic-testing/issues/938).

This file is the single source of truth for **what** we measure, **how** we grade, and the **bar** to clear. Re-grade and update the scorecard whenever the docs change materially (and before any docs launch / major announcement).

## Criteria

Five criteria, each graded A–F. The first two are launch-blocking because they can carry `critical` findings.

| # | Criterion | What it measures |
|---|-----------|------------------|
| 1 | **Technical accuracy & drift** | Every code sample, import, API name, signature, capability table, and version claim matches the real, currently-built packages. |
| 2 | **Walkthrough / build a unit test** | A newcomer can go install → configure a runner → render → assert → clean up and reach a green test **from the docs alone**. |
| 3 | **Architecture clarity** | One early, correct, canonical picture maps Driver / Interactor / ScenePart / Locator / TestEngine and where each binds to React / Vue / Playwright / DOM. |
| 4 | **Homepage / elevator pitch** | The landing page names the problem, makes the unique value credible and provable, and lets a reader imagine the gains. |
| 5 | **Information architecture & navigation** | Coherent Diátaxis-shaped structure, working links, curated bridge into the generated API, no dead ends. |

## Grading bands

| Grade | Meaning |
|-------|---------|
| **A** | Exemplary. No open findings above `low`. A skeptic finds nothing material. |
| **B** | Solid. No `critical`/`high`; only `medium`/`low` polish remains. |
| **C** | Serviceable but flawed. No `critical`, but `high` issues remain that a careful reader will hit. |
| **D** | Misleading. At least one `critical`, or many `high`, that break trust or block the happy path. |
| **F** | Broken. The primary path fails (e.g. the first copy-pasted example doesn't compile). |

Use `+`/`−` for within-band nuance.

### Severity of individual findings

| Severity | Definition |
|----------|------------|
| `critical` | Breaks the reader's happy path or headline claim (e.g. the hero/Quick-Start code doesn't compile). |
| `high` | Materially misleads or blocks a common task; a careful reader hits it. |
| `medium` | Wrong/confusing but with a workaround or limited blast radius. |
| `low` | Minor inaccuracy or polish. |
| `nit` | Cosmetic. |

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

| Criterion | Grade | Open `critical` | Launch-ready? | Issue |
|-----------|:-----:|:---------------:|:-------------:|-------|
| 1. Technical accuracy & drift | **C** | 1 | ❌ | [#939](https://github.com/atomic-testing/atomic-testing/issues/939) |
| 2. Walkthrough / build a unit test | **C−** | 3 | ❌ | [#940](https://github.com/atomic-testing/atomic-testing/issues/940) |
| 3. Architecture clarity | **C+** | 0 | ⚠️ (≥C but improve) | [#941](https://github.com/atomic-testing/atomic-testing/issues/941) |
| 4. Homepage / elevator pitch | **C+** | 1 | ❌ | [#942](https://github.com/atomic-testing/atomic-testing/issues/942) |
| 5. Information architecture | **C+** | 0 | ⚠️ (≥C but improve) | [#943](https://github.com/atomic-testing/atomic-testing/issues/943) |

**Overall: NOT launch-ready** — 4 open `critical` findings (all one root cause: inline examples were never compiled). The doc-accuracy gate reproduces them (`node docs/scripts/check-doc-accuracy.mjs` currently reports them). Clearing #939 + #940 + #942 removes every `critical` and should move all criteria to ≥ C.

<!-- Append a new dated row-set here after each re-grade. Do not overwrite history. -->
