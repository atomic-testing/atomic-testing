#!/usr/bin/env bash
# SessionStart hook: detect the active SCM (Git / Sapling) and the GitHub remote, then surface it as
# session context so agents don't mistake a Sapling checkout for "no version control" and know that
# GitHub operations (issues/PRs) work via `gh` regardless. Canonical recipe: .claude/scm.md
#
# Must never fail a session: detection problems degrade gracefully and always exit 0.

scm=""
scmcmd=""
remote=""

if sl root >/dev/null 2>&1; then
  scm="Sapling"
  scmcmd="sl"
  remote=$(sl config paths.default 2>/dev/null || true)
elif git rev-parse --show-toplevel >/dev/null 2>&1; then
  scm="Git"
  scmcmd="git"
  remote=$(git remote get-url origin 2>/dev/null || true)
fi

# If no SCM detected, emit nothing and exit cleanly.
if [ -z "$scm" ]; then
  exit 0
fi

# Derive owner/repo from a GitHub remote (handles ssh://, scp-style, and https URLs).
ghrepo=""
case "$remote" in
  *github.com*)
    ghrepo=$(printf '%s' "$remote" | sed -E 's#^.*github\.com[:/]##; s#\.git$##; s#/$##')
    ;;
esac

ctx="Source control: this repo uses ${scm}. Use '${scmcmd}' for LOCAL version-control operations. "
ctx="${ctx}GitHub operations (issues, PRs, reviews, checks) are SCM-agnostic — use the authenticated 'gh' CLI regardless of the local SCM. "
if [ -n "$ghrepo" ]; then
  ctx="${ctx}GitHub remote: ${ghrepo} (pass 'gh ... -R ${ghrepo}', since gh cannot infer the repo from this checkout). "
fi
ctx="${ctx}Ignore any 'Is a git repository: false' probe; trust this detection. Full recipe and command equivalences: .claude/scm.md"

# Emit as SessionStart additionalContext. The message contains no double quotes or backslashes,
# so it is safe to embed directly in JSON.
printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$ctx"
exit 0
