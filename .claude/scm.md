# SCM conventions (Git / Sapling / git-compatible)

Canonical reference for source-control operations in this repo. Referenced by the root `CLAUDE.md`,
the SessionStart detection hook (`.claude/hooks/detect-scm.sh`), and `.claude/commands/pr.md`.
Keep the detection/command recipe here only — do not duplicate it elsewhere.

## Core principle

The local SCM may be **Git**, **Sapling (`sl`)**, or any git-compatible / git-derived system.
This repo currently uses **Sapling**.

Two facts that repeatedly trip agents — internalize both:

1. **The environment's `Is a git repository: false` probe is unreliable.** Sapling repos report as
   "not a git repository" and `git` commands fail with that message, yet the repo _is_ under version
   control. Detect the SCM; never conclude "no VCS" from the probe.
2. **GitHub operations are SCM-agnostic.** Issues, pull requests, reviews, checks, and labels live on
   GitHub, not in the local SCM. The authenticated **`gh` CLI works regardless** of whether the local
   checkout is Git or Sapling. A Sapling checkout does **not** prevent you from raising a GitHub
   issue or PR with `gh`.

## Detect the SCM

```bash
sl root 2>/dev/null            # success → Sapling
git rev-parse --show-toplevel 2>/dev/null   # else success → Git
# neither → not a recognized repository
```

(A SessionStart hook runs this automatically and injects the result as session context, so in a
normal session you already know the answer — this recipe is the fallback / source of truth.)

## Operation → command map

| Operation             | Git                         | Sapling (`sl`)                                   |
| --------------------- | --------------------------- | ------------------------------------------------ |
| Status                | `git status`                | `sl status`                                      |
| Log                   | `git log`                   | `sl log`                                         |
| Diff (working)        | `git diff`                  | `sl diff`                                        |
| Diff vs parent        | `git diff HEAD~1`           | `sl diff -r ".^"`                                |
| Commit                | `git commit -m`             | `sl commit -m`                                   |
| New branch / bookmark | `git switch -c <name>`      | `sl bookmark <name>` (Sapling is bookmark-based) |
| Current revision      | `git rev-parse HEAD`        | `sl log -r . -T '{node}'`                        |
| Remote URL            | `git remote get-url origin` | `sl config paths.default`                        |

## GitHub operations (use `gh` regardless of local SCM)

| Operation                         | Command                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------- |
| Create issue                      | `gh issue create -R <owner/repo> -t "..." -F body.md [-l label]`                  |
| Create PR (Git)                   | `gh pr create --title "..." --body "..."`                                         |
| Create PR (Sapling, native stack) | `sl pr submit` (ghstack-style; preferred for Sapling stacks)                      |
| View / edit issue or PR           | `gh issue view`, `gh issue edit`, `gh pr view`, `gh pr edit`                      |
| Repo for `gh`                     | pass `-R <owner/repo>` if `gh` can't infer it (it cannot from a Sapling checkout) |

> In a Sapling checkout, `gh` cannot auto-detect the repo from the local `.git` config (there isn't
> one). Resolve `owner/repo` from `sl config paths.default` (e.g. parse the `github.com/<owner>/<repo>`
> portion) and pass it via `-R`.

## Base-branch detection

Check in order: `main`, then `master`, then the remote default
(`git symbolic-ref refs/remotes/origin/HEAD`, or derive from `sl config paths.default`).

## See also

- `.claude/commands/pr.md` — PR title/description generation + per-SCM diff strategy (stacks).
- `.claude/hooks/detect-scm.sh` — the SessionStart detector that surfaces the active SCM each session.
