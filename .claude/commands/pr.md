Generate a pull request title and description based on the current changes.

## SCM & base-branch detection

Detect the active SCM (`sl` vs `git`) and the base branch using the canonical recipe in
[`.claude/scm.md`](../scm.md) — `sl root` → else `git rev-parse`; base branch `main` → `master` →
remote default. A SessionStart hook already surfaces the active SCM each session. The diff and
PR-submission steps below branch on that detected SCM.

## Source of truth

The **local environment is the single source of truth** for a PR's title and description.
Author them locally and publish through the SCM's native flow — never by editing the PR on the
host afterward.

- **Sapling**: the commit message _is_ the PR title (first line) and body (the rest). Set them
  with `sl metaedit` and publish with `sl pr submit`. **Do NOT use `gh pr edit` to change a
  Sapling PR's title/body** — the next `sl pr submit` regenerates the PR from the commit message
  and silently erases any host-side edit. (`gh` remains correct for SCM-agnostic GitHub actions —
  comments, reviews, labels, merges — per [`.claude/scm.md`](../scm.md); just not the title/body.)
- **Git**: the title/body are set with `gh pr create` / `gh pr edit`; nothing regenerates them,
  so keep them recoverable locally (commit message / PR template) to stay authoritative.

## Getting the Diff

### Git

Use three-dot diff to compare against the merge-base (avoids noise from upstream changes):

```bash
git diff <base>...HEAD
```

### Sapling

First, detect if we're in a stack by checking if the parent commit is a draft:

```bash
sl log -r ".^ and draft()" --template "{node}"
```

- **If parent is public (empty result)**: Not in a stack, diff against parent:

  ```bash
  sl diff -r ".^"
  ```

- **If parent is draft (has result)**: We're in a stack. Ask the user:
  - **"Current commit only"**: `sl diff -r ".^"`
  - **"Entire stack from base"**: `sl diff -r "ancestor(., <base>)"`

## Title Guidelines

- Use conventional commit format: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`
- Keep under 72 characters
- Use imperative mood ("Add feature" not "Added feature")
- Describe the **delivered capability**, not an internal plan item — no "Wave N", "phase",
  "step", or tracker-issue numbers in the title

## Description Format

```markdown
[2-3 sentences explaining what this PR does, why, and any benefits, you MUST keep each line under 100 characters]

## Key Changes

- [Max 3 bullet points of key changes]
- [Be specific but concise]
- [Each line under 100 characters]
```

**Voice and focus**: describe what was delivered and the value it brings to library users.
Do not reference internal planning scaffolding — no "Wave N", "phase", "step", "plan",
"prerequisite", "epic number", "per request", or "in-flight housekeeping" language.
Tracker-issue links belong in the footer only, not in the narrative.

## After Generating

Present the title and description to the user, then ask if they want to create the PR.

### If Using Git

1. Check if `gh` CLI is installed: `gh --version 2>/dev/null`
2. **If installed**: Ask user if they want to create/update the PR
   - Create: `gh pr create --title "..." --body "..."`
   - Update (if PR exists): `gh pr edit --title "..." --body "..."`
3. **If not installed**: Inform the user that PRs can be created automatically with the GitHub CLI, and provide installation link: <https://cli.github.com/>

### If Using Sapling

The commit message is the single source of truth (see [Source of truth](#source-of-truth)) — set
the title/body there, never with `gh pr edit`.

1. Update the commit message so its first line is the title and the rest is the body
   (`sl metaedit` opens an editor; `-m` only fits a one-line message).
2. Submit / refresh the PR: `sl pr submit`
