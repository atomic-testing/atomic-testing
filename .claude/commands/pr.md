Generate a pull request title and description based on the current changes.

## SCM & base-branch detection

Detect the active SCM (`sl` vs `git`) and the base branch using the canonical recipe in
[`.claude/scm.md`](../scm.md) — `sl root` → else `git rev-parse`; base branch `main` → `master` →
remote default. A SessionStart hook already surfaces the active SCM each session. The diff and
PR-submission steps below branch on that detected SCM.

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

## Description Format

```markdown
[2-3 sentences explaining what this PR does, why, and any benefits, you MUST keep each line under 100 characters]

## Key Changes

- [Max 3 bullet points of key changes]
- [Be specific but concise]
- [Each line under 100 characters]
```

## After Generating

Present the title and description to the user, then ask if they want to create the PR.

### If Using Git

1. Check if `gh` CLI is installed: `gh --version 2>/dev/null`
2. **If installed**: Ask user if they want to create/update the PR
   - Create: `gh pr create --title "..." --body "..."`
   - Update (if PR exists): `gh pr edit --title "..." --body "..."`
3. **If not installed**: Inform the user that PRs can be created automatically with the GitHub CLI, and provide installation link: <https://cli.github.com/>

### If Using Sapling

1. Update the commit message: `sl metaedit -m "..."`
2. Submit the PR: `sl pr submit`
