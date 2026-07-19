#!/usr/bin/env bash
# SessionStart hook: ensure the TypeScript 7 native (tsgo) LSP plugin is installed.
#
# The PREFERRED enablement path is the environment setup script (see
# tools/ts7-lsp/setup-script.example.sh) — it runs pre-launch, so the LSP is live
# from session 1. This hook is the in-repo fallback for when you can't edit the
# environment setup script.
#
# Boundaries:
#   * Auto-install runs only in the remote/cloud environment (CLAUDE_CODE_REMOTE=true),
#     to avoid silently mutating a local developer's global Claude Code config.
#   * On first run the plugin installs but the LSP tool may not attach until the next
#     session (or `/reload-plugins`); it persists thereafter for the environment's life.
#   * Always exits 0 — a hook must never break session startup.
set -uo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  bash "${CLAUDE_PROJECT_DIR:-.}/tools/ts7-lsp/enable.sh" || true
else
  if command -v claude >/dev/null 2>&1 && ! claude plugin list 2>/dev/null | grep -q "typescript-lsp-native"; then
    printf '[ts7-lsp] Not installed. To enable tsgo LSP locally: bash tools/ts7-lsp/enable.sh\n'
  fi
fi
exit 0
