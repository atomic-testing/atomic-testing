#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Example ENVIRONMENT SETUP SCRIPT for Claude Code on the web / Cloud VM.
#
# This is NOT wired up automatically — paste its body into your environment's
# setup script in the Claude Code web UI (Environment settings → Setup script).
# The setup script runs once, as root, BEFORE Claude launches, and its filesystem
# result is cached into the environment image (~7 days). Running the enable step
# here (rather than in a SessionStart hook) means:
#   • the tsc (TS 7) LSP server is live from session 1 (no plugin-load race), and
#   • the install is baked into the cached image, so later sessions start ready.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPO="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# 1. Install workspace deps — this provides the TS 7 `tsc` binary (@typescript/native).
pnpm -C "$REPO" install

# 2. Enable the TypeScript 7 native LSP plugin (idempotent).
bash "$REPO/tools/ts7-lsp/enable.sh"

# 3. (Optional) Pre-build core so cross-package go-to-definition resolves. Without a
#    build, imports of @atomic-testing/* have no target for the LSP to jump to.
#    See tools/ts7-lsp/README.md → "Cross-package navigation" for the tradeoffs.
pnpm -C "$REPO" --filter @atomic-testing/core build || true
