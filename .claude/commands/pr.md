Generate a pull request title and description based on the current changes.

## Workflow

1. Run `sl diff -r main` to get the diff
2. Analyze changes and generate PR content
3. Run `sl metaedit -m "..."` with the title and description
4. Run `sl pr submit` to create the PR

## Title Guidelines

- Use conventional commit format: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`
- Keep under 72 characters
- Use imperative mood ("Add feature" not "Added feature")

## Description Format

```markdown
## Summary

[2-3 sentences explaining what this PR does, why, and any benefits]

## Key Changes

- [Max 3 bullet points of key changes]
- [Be specific but concise]
- [Each line under 100 characters]
```

## After Generating

Present the title and description to the user, then ask if they want to create the PR.
If yes, use `sl metaedit` and `sl pr submit`.
