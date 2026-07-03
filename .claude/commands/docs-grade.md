---
description: Grade the docs site against the launch-readiness rubric and print the scorecard (objective gate always; add "deep" for a full multi-agent re-grade)
argument-hint: '[deep]'
---

You are producing a **launch-readiness scorecard** for the Atomic Testing documentation site.

`$ARGUMENTS` selects the mode: empty / `fast` → fast mode; `deep` or `full` → deep re-grade.

## Source of truth (read first)

Read `docs/maintainers/docs-launch-readiness.md`. It defines the five criteria, the A–F grading
bands, the severity scale, and the **launch bar**. Do not invent criteria or thresholds — use that
file. The umbrella tracking issue is #938; child issues are #939–#943.

## Step 1 — Objective checks (always run)

Run the deterministic gate and report pass/fail with any findings:

```bash
node docs/scripts/check-doc-accuracy.mjs
```

In **deep** mode also verify links/build (slower):

```bash
cd docs && pnpm build   # fails on broken internal links when onBrokenLinks: 'throw'
```

These cover the objective half of **criterion 1 (accuracy)** and the link half of **criterion 5 (IA)**.
A green gate is necessary but not sufficient for launch.

## Step 2 — Grades

**Fast mode (default):** do NOT re-run the multi-agent audit. Present the most recent recorded
scorecard from the rubric doc, clearly labelled as the last recorded qualitative grade, and fold in
today's objective-gate result. Tell the user to run `/docs-grade deep` to refresh the letter grades.

**Deep mode (`deep`/`full`):** regenerate all five letter grades by running the saved audit harness.
First resolve the absolute repo root, then invoke the workflow passing it through (the harness reads
files by absolute path):

1. `sl root` (or `git rev-parse --show-toplevel`) → `<REPO>`.
2. Call the Workflow tool:
   `Workflow({ scriptPath: "<REPO>/docs/scripts/audit/docs-audit.workflow.js", args: { repoRoot: "<REPO>" } })`
3. **Warn the user first**: this fans out dozens of subagents and is token-expensive (~minutes).
4. From the workflow result, take each dimension's `grade` plus its `critical`/`high` finding counts
   (use verified findings; ignore any marked `refuted`).
5. Append a new dated section to the `## Scorecard` area of `docs/maintainers/docs-launch-readiness.md`
   — append, never overwrite prior rows — and note any new findings worth filing under #938.

## Step 3 — Verdict

Evaluate against the launch bar (currently _moderate_: **zero `critical`** findings + **every criterion ≥ C**

- clean docs build / gate green). Output:

* The scorecard table (criterion · grade · open criticals · issue link).
* **GO / NO-GO** against the bar, with the specific blockers and their issue numbers.
* In fast mode, state plainly that grades are "last recorded" unless the gate or known fixes changed them.

Keep the report tight; cite `file:line` for any new concrete finding.
