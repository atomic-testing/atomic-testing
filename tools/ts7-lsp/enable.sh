#!/usr/bin/env bash
# Idempotently enable the TypeScript 7 native (tsc) LSP plugin for Claude Code.
#
# Safe to run from either:
#   - an environment setup script (PREFERRED — runs pre-launch, so LSP is live from
#     session 1 and no plugin-load race is possible), or
#   - a SessionStart hook (converges after one session; see README).
#
# Idempotent and non-fatal by design: it never exits non-zero, so it can't break
# session startup. Problems are surfaced as WARN lines, never as silent failures.
set -uo pipefail

log() { printf '[ts7-lsp] %s\n' "$*"; }

# Resolve repo root: prefer Claude Code's env var, else derive from this script's path.
REPO="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
MARKETPLACE_DIR="$REPO/tools/ts7-lsp"
MIN_CC_VERSION="2.1.205"   # below this, restartOnCrash/shutdownTimeout cause a silent server skip

# The plugin CLI only exists in real Claude Code installs; skip cleanly elsewhere.
if ! command -v claude >/dev/null 2>&1; then
  log "claude CLI not found; nothing to do"
  exit 0
fi

# Warn loudly (never silently) if this Claude Code predates the LSP restart fields.
ver="$(claude --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"
if [ -n "$ver" ] && [ "$(printf '%s\n%s\n' "$MIN_CC_VERSION" "$ver" | sort -V | head -1)" != "$MIN_CC_VERSION" ]; then
  log "WARN: Claude Code $ver < $MIN_CC_VERSION — restartOnCrash/shutdownTimeout in .lsp.json will make"
  log "WARN: this build skip the LSP server entirely. Remove those two fields, or upgrade Claude Code."
fi

# The plugin only wires up the connection — it does not bundle the server. The TS 7
# native compiler (tsc) is installed as `@typescript/native` (npm:typescript@^7.0.2),
# which exposes the `tsc` binary, so `pnpm install` must have run.
if ! pnpm -C "$REPO" exec tsc --version >/dev/null 2>&1; then
  log "WARN: 'pnpm exec tsc' not resolvable in $REPO — run 'pnpm install' first (provides tsc)."
fi

if claude plugin list 2>/dev/null | grep -q "typescript-lsp-native"; then
  log "plugin already installed"
  exit 0
fi

log "installing typescript-lsp-native from $MARKETPLACE_DIR"
claude plugin marketplace add "$MARKETPLACE_DIR" >/dev/null 2>&1 || log "WARN: marketplace add failed"
if claude plugin install typescript-lsp-native@atomic-testing-ts7 >/dev/null 2>&1; then
  log "installed. If the LSP tool isn't active this session, run /reload-plugins (or start a fresh session)."
else
  log "WARN: plugin install failed — see 'claude plugin' output"
fi

exit 0
