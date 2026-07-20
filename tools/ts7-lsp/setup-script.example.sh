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
#
# Keep the whole script under the platform's ~5-minute setup budget (see the Claude
# Code web docs) so the environment cache can build — that's why the heavy full
# build is left to a SessionStart hook (step 3), not run here.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# Resolve the repo checkout. A setup script runs as root, before Claude launches,
# from the HOME directory with the repo already cloned into a SUBDIRECTORY
# (e.g. /home/user/<repo>). Two traps this avoids:
#   • CLAUDE_PROJECT_DIR is a SessionStart-*hook* variable and is NOT set for setup
#     scripts, so don't rely on it.
#   • cwd is the parent dir, not the checkout, so `pnpm -C "$(pwd)"` looks in the wrong
#     place and fails with `ERR_PNPM_NO_PKG_MANIFEST  No package.json found`.
# So locate the checkout by its .git directory instead of trusting either.
REPO="${CLAUDE_PROJECT_DIR:-}"
if [ -z "$REPO" ] || [ ! -f "$REPO/package.json" ]; then
  if [ -f "$PWD/package.json" ]; then
    REPO="$PWD"
  else
    REPO="$(find "$PWD" -mindepth 2 -maxdepth 2 -name .git -printf '%h\n' 2>/dev/null | head -n1)" || true
  fi
fi
if [ -z "${REPO:-}" ] || [ ! -f "$REPO/package.json" ]; then
  echo "ERROR: could not locate the repo checkout under '$PWD'. Set REPO=/path/to/checkout explicitly." >&2
  exit 1
fi
echo "[ts7-lsp setup] using REPO=$REPO"

# 1. Install workspace deps — this provides the TS 7 `tsc` binary (@typescript/native),
#    which IS the LSP server the plugin runs.
pnpm -C "$REPO" install

# 2. Enable the TypeScript 7 native LSP plugin (idempotent). Doing this here, pre-launch,
#    is what gets the LSP tool onto the menu from session 1.
bash "$REPO/tools/ts7-lsp/enable.sh"

# 3. Pre-build so cross-package go-to-definition has a dist target to resolve to.
#    Build just `core` here — it's fast, it's the most-imported cross-package target,
#    and it keeps this script within the ~5-minute setup-cache budget. To make
#    go-to-definition resolve into EVERY @atomic-testing/* package, run the full
#    `pnpm -C "$REPO" run build:packages` (topological, skips all publish steps) from a
#    background SessionStart hook instead — that keeps the heavier build off the setup
#    budget. See tools/ts7-lsp/README.md → "Cross-package navigation".
pnpm -C "$REPO" --filter @atomic-testing/core build || true
