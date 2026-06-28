# Lessons: authoring & running multi-step plans (`run-plan.sh`)

Hard-won notes for anyone authoring a `~/.claude/scripts/run-plan.sh` plan (per the `plan-author` skill) against this repo. A multi-step Astryx plan was run headlessly; **step 1 failed under the runner while every step later completed cleanly when executed interactively.** The gap is instructive — these are the failure modes to design around.

## What actually happened

The runner drives each step as a fresh headless `claude -p` invocation, then gates on `verify.cmd` and (when `handoff_summary: true`) the existence of a non-empty handoff file. Step 1's log ended both attempts with:

```
✓ verify.cmd passed
✗ handoff file missing or empty: .run-state/handoff/1-modifier-keys.md
```

So `verify.cmd` passed, yet the step was marked failed because **the handoff was never written** — and it was never written because the headless agent responded _conversationally_ instead of executing: attempt 1 said _"Once you give the go-ahead… I'll implement…"_ and waited; attempt 2 wrote out a plan and stopped. There is no human to "give the go-ahead" in `claude -p`, so it stalled before doing the work.

## Failure modes (and how to design around them)

### 1. "Ask-first" behavior stalls headless steps

This repo's `CLAUDE.md` mandates _"Scrutinize first… Ask in batches of 4 before starting."_ That is exactly right **interactively** — but in unattended `claude -p` it makes the per-step agent ask-and-wait into a void, so it never implements and never writes the handoff.

**Design fixes:**

- Write each step prompt to be **headless-safe**: explicitly _"Execute autonomously. Do NOT ask for approval. If you hit a genuine fork, choose the documented default, record the choice in the handoff, and continue."_
- Reserve real human-decision steps (e.g. "which npm package + version pin") as **explicit STOP checkpoints**, or pre-resolve the decision _before_ running. Do not bury a question-only-a-human-can-answer inside an autonomous step.
- Run with `--auto-approve` only when the prompts genuinely don't ask anything.

### 2. `verify.cmd` that "runs whatever tests exist" can't detect missing work

Step 1's gate `npx jest KeyboardEvent && npx playwright test KeyboardEvent` **passed on pre-existing tests** even though the new modifier-key feature/tests had not been added. A gate that re-runs a name-filtered suite proves nothing about _new_ behavior.

**Design fixes:**

- Make `verify.cmd` assert the **new** behavior: reference a test that does not exist before the step (so an empty filter fails), or add a cheap presence check (`grep -q '<new symbol>' <file>` / `test -f <new test>`) ahead of the suite.
- `expect_artifacts` should list the **specific new files** the step must produce, not a directory.

### 3. A partial run leaves `state.json` a trap

After an aborted run, `.run-state/state.json` records only the steps the runner reached. A later `--resume` then restarts from the wrong point and can **clobber work that was actually completed by other means** (interactively, or a later manual run).

**Design fixes:**

- Don't `--resume` after a partial/aborted run without reconciling `state.json` against the real repo state first.
- For steps with genuine _discovery_ (real DOM shapes, ESM/bundler quirks, cross-browser behavior), prefer interactive or Workflow execution — the runner's one-shot-per-step model can't adapt mid-step.

## What worked: the interactive / Workflow cadence

Every step completed cleanly when driven interactively: execute end-to-end, **probe real behavior before committing** (render-and-look for DOM/ESM reality), run the **authoritative gates** (jsdom + Playwright on all three browsers, not a name-filtered subset), adversarially review the result, then write the handoff. The runner is fine for mechanical, fully-specified, discovery-free steps; anything requiring adaptation or a human decision wants a human (or a Workflow) in the loop.
