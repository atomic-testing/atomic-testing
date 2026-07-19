# Adopting an LSP for AI Coding Agents — an evaluation & adoption guide

> **What this is.** A standalone, repo-agnostic guide to deciding whether — and how — to
> give an AI coding agent (Claude Code, or any LSP/MCP-capable agent) real code
> intelligence via a **Language Server Protocol (LSP)** backend, for both **local
> development** and **cloud agent environments** (e.g. Claude Code on the web / a Cloud VM).
>
> It generalizes the lessons from one real adoption (a TypeScript monorepo, mid-2026) into
> durable principles. Where a fact is version- or ecosystem-specific it is dated and
> flagged — **re-verify current details before you rely on them.** The concrete, working
> implementation this guide was distilled from lives in [`tools/ts7-lsp/`](../tools/ts7-lsp/)
> and [ADR-016](adr/016-defer-paths-src-cross-package-navigation.md); read this first, then
> use those as a worked example.
>
> No prior context is assumed.

---

## 1. TL;DR

- An **LSP** gives an agent IDE-grade navigation — **go-to-definition, find-references,
  hover, workspace-symbol, implementations, call hierarchy** — plus **live diagnostics
  after edits**. This is type-aware, unlike `grep`/text search.
- The benefit is **precision and fewer wasted turns**: the agent jumps to the *right*
  symbol instead of wading through text matches, and learns immediately when an edit
  breaks a type.
- **Whether it pays off depends on your codebase, not on hype.** Adopt it if your repo is
  large, cross-referential, and strongly typed. Skip it if it's small or the noise it
  removes is negligible.
- There are **two integration paths**: a **native LSP tool** (built into the agent, config
  via a plugin) and an **MCP-wrapped LSP server** (portable across MCP clients). Both drive
  a real language-server binary you install separately.
- The single most important technical principle: **drive the LSP with the same compiler
  your CI type-checks with**, so the agent's view of the code matches what gates merges.
- Cloud adoption has its own mechanics (ephemeral containers, setup scripts, workspace
  trust). Local adoption is simpler. Both are covered below.

---

## 2. Background — why an LSP helps an agent

By default, coding agents explore code with **text tools**: `grep`, `glob`, read-file.
That works, but it is *lexical*, not *semantic*:

- A search for a common method or class name returns **every textual occurrence** — across
  unrelated definitions, comments, and strings — and the agent must spend reasoning (and
  tokens, and turns) filtering them.
- The agent cannot reliably answer "where is *this* symbol defined?" or "who calls it?"
  without reading many candidates.

An LSP answers those questions **by type**, in one call:

| Operation | What the agent gets |
| --- | --- |
| `goToDefinition` | The exact definition of the symbol under the cursor |
| `findReferences` | Every real reference (not text matches) |
| `hover` | The resolved type signature + doc comment |
| `workspaceSymbol` | Fuzzy symbol search across the whole workspace |
| `goToImplementation` | Concrete implementations of an interface/abstract member |
| call hierarchy | Incoming/outgoing callers of a function |
| diagnostics | Type/lint errors, pushed automatically after each edit |

**An honest word on evidence.** As of mid-2026, public head-to-head benchmarks of
"LSP-tooled agent vs. grep-only agent" (token cost, task success, latency) are **thin and
mostly vendor- or blog-sourced** — treat specific multipliers ("Nx fewer tokens") with
skepticism. The durable, checkable signal is **your own repo's structure** (next section),
not someone's benchmark. Adopt on fit, not on a number.

---

## 3. Should you adopt it? — an evaluation framework

LSP navigation pays off in proportion to how much *semantic ambiguity* your codebase has
that text search cannot resolve. Score your repo against these:

**Strong signals to adopt**

- **Size**: many files / a large monorepo. Navigation cost grows super-linearly with size.
- **Symbol reuse & naming collisions**: the same method/class/interface names recur across
  unrelated modules (common in design-system or plugin architectures — `SelectDriver`,
  `getValue`, `render` implemented dozens of times). Text search cannot tell them apart; the
  LSP resolves by type in one hop.
- **Cross-module dependency fan-out**: many files import a shared core; "who uses X" and
  "where does X come from" are constant questions.
- **A real type system** (TypeScript, Rust, Go, Java, typed Python…). The stronger the
  types, the more precise the LSP.

**Signals it may not be worth it**

- Small codebase where `grep` is already unambiguous.
- Weak/absent static typing where the language server can't resolve much.
- A team unwilling to own the (modest but real) setup + maintenance surface.

**A 60-second test.** Pick a common symbol name and search the repo:

```bash
# git grep is layout-agnostic (works whether sources sit in src/ or packages/*/src/)
# and respects .gitignore (excludes node_modules/dist). If this returns dozens/hundreds
# of hits across unrelated definitions, grep-based navigation is high-noise — exactly
# what an LSP collapses to one answer.
git grep -n "getValue" | wc -l        # occurrences   ;  git grep -l ... | wc -l for files
```

The worked-example repo had `getValue` *appearing* (textual matches, not distinct
definitions — which is the point) **256 times across 112 files**, and **444** exported
`*Driver` classes sharing names across packages — a textbook high-benefit case.

---

## 4. How the LSP reaches the agent — two integration paths

Both paths ultimately spawn a **real language-server binary** (which you install
separately — see §5). They differ in how the agent talks to it.

### Path A — a native LSP tool (built into the agent)

Some agents ship a first-class **LSP tool** the model can call directly (Claude Code does,
as of mid-2026). You enable it by installing a small **plugin** whose config file (an
`.lsp.json`) tells the agent what server to run for which file types:

```jsonc
// .lsp.json — maps language servers to file extensions. It is a MAP: add one entry per
// language for a polyglot repo (see the multi-language note below), each with its own
// binary and extension→language mapping.
{
  "typescript": {
    "command": "pnpm",
    "args": ["exec", "tsc", "--lsp", "--stdio"],
    "extensionToLanguage": { ".ts": "typescript", ".tsx": "typescriptreact" },
    "transport": "stdio"
  }
}
```

The agent then calls `goToDefinition`, `findReferences`, etc., and receives diagnostics
after edits. **Advantages:** tightest integration, diagnostics feedback loop. **Cost:**
availability and config format are agent-specific; verify against current docs.

### Path B — an MCP-wrapped LSP server

An **MCP server** — MCP is the **Model Context Protocol**, an open standard for connecting
agents to external tool/data servers — wraps a language server and exposes its operations
as MCP tools. This works with any MCP-capable client and is portable across agents. As of
mid-2026 the notable
options were **Serena** (actively maintained, wide language coverage, symbol-level tools)
and **mcp-language-server** (minimal, community-maintained). **Advantages:** cross-client
portability, no dependence on a native tool. **Cost:** an extra server process; some do a
one-time workspace index (seconds to ~a minute on large repos); watch memory on very large
trees.

**Which to use:** prefer the **native tool** if your agent has one and it's reliable in
your environment; fall back to an **MCP server** for portability or if the native path
isn't available.

### Polyglot repos — one server per language

Both configs are **maps**: a repo with several languages runs several servers (a TypeScript
server, a `rust-analyzer`, a `gopls`, a `pyright`…), each with its own binary and
extension→language mapping. Everything in §5, §8, and §12 then repeats **once per language**
— match each server to the engine CI uses for that language, install each binary, and add
an acceptance-test case per language. Start with the language where navigation friction is
highest and add others incrementally.

---

## 5. Choosing the language server — the load-bearing decisions

### 5.1 Match the LSP engine to your CI type-check engine

**The single most important principle.** If your CI type-checks with compiler **X**, drive
the LSP with **X**. Otherwise the agent's navigation and diagnostics reflect a *different*
engine than the one that gates merges — it can report an error CI won't, or miss one CI
will. Consistency with CI is worth more than any single feature.

### 5.2 Verify the actual binary — names lie

Do not assume the command that "should" run the compiler does. **Check what your toolchain
actually resolves.** In the worked example, at an early point during adoption `pnpm exec
tsc` resolved to the *classic* compiler while the native compiler shipped under a *different
name* (`tsgo`, from the then-current preview package), and the native compiler's own
`--help` banner even mis-identified itself. After the coexistence aliasing (§5.3) was set
up, `pnpm exec tsc` resolves to the *native* compiler — the same engine CI type-checks with
and the one §4's `.lsp.json` drives (verify: `pnpm exec tsc --version` → 7.x), with the
classic compiler moved to `tsc6`. The lesson holds either way: a five-minute check of the
real binary saves hours.

```bash
pnpm exec <tool> --version     # what does this ACTUALLY run?
# portable "where does it resolve?" — avoids GNU-only `readlink -f` (see the §7.3 rule):
python3 -c "import os, shutil; print(os.path.realpath(shutil.which('<tool>')))"
```

### 5.3 Coexistence — your build/docs tooling may lag your type-checker

A new, fast native compiler may **not yet expose the programmatic API** that your *build*,
`.d.ts` emit, doc generator, or API-extractor depend on. Forcing everything onto the new
compiler then **breaks the build**. The fix is **coexistence, not replacement**: run the
new compiler for **type-check + LSP**, and keep the classic compiler for the **build/docs**
that need its API — installed side by side (in the TS ecosystem, via npm aliases so the two
compilers get distinct binary names and one satisfies the `import "typescript"` peer that
build tools resolve).

> Generalize the lesson: **the compiler that's best for fast checking + navigation is not
> automatically ready to power your whole toolchain.** Check each consumer (build, `.d.ts`,
> docs, api-extractor, linters) for compatibility before you switch, and be prepared to run
> two engines in parallel during the transition.

**Watch for the dependency that won't stay removed.** When you swap one engine for another
(e.g. a preview build for a stable one), the package you *removed* can be silently
**re-installed as another tool's transitive optional peer** — so a fresh install quietly
brings it back. Concretely, in the worked example a bundler's declaration plugin
(`rolldown-plugin-dts`) declared the preview compiler as an *optional peer*, and the package
manager's auto-install-peers behavior re-pulled it. The fix is a **package-manager hook**
that strips the unwanted optional peer at resolution time (a `.pnpmfile.cjs` in pnpm; the
equivalent varies by ecosystem). Generally: after removing a compiler/tool, confirm it's
actually gone from a clean/frozen install, and pin or hook it out if it returns.

### 5.4 The server is not bundled with the plugin

Every integration (native plugin or MCP) only **wires up the connection** — it does **not**
ship the language-server binary. Install the binary yourself (`npm i -g …`, `pip install …`,
`go install …`, a package manager, etc.). An `Executable not found in PATH` error means the
binary step was skipped.

---

## 6. Adopting for local development

1. **Install the language-server binary** for your language (see §5.4).
2. **Configure the integration** — the plugin's `.lsp.json` (Path A) or the MCP server
   config (Path B). Point it at the binary chosen in §5.1.
3. **Trust the workspace.** Most agents start LSP servers **only after the workspace is
   trusted** — accept the trust prompt once (the security reason is below).
4. **Verify** (see §8): run an acceptance test, then ask the agent for a go-to-definition
   on a cross-module symbol.

Local adoption is otherwise low-friction: your machine persists, so a one-time install and
config is enough.

> **Security & trust — why the prompt exists.** A language server is not a passive reader:
> it loads and acts on **repository-controlled configuration** (the project's `tsconfig`,
> compiler/editor plugins that config references, and in some ecosystems arbitrary build
> hooks). Starting one therefore executes code influenced by the repo. That is why agents
> gate LSP startup behind **workspace trust** — and why you should be deliberate about
> auto-starting a server on **untrusted code** (a freshly cloned PR from an unknown fork, an
> unreviewed branch). Treat "enable the LSP" as "run this repo's toolchain," and scope
> auto-enable (e.g. the §7.1 hook) to environments and repos you already trust.

---

## 7. Adopting for a cloud agent environment (Claude Code on the web / Cloud VM)

Cloud agent sessions typically run in an **ephemeral container**: the repo is cloned fresh,
the container is reclaimed after inactivity, outbound network goes through a proxy, and disk
is a per-session allowance. That changes *how* you enable and *persist* the LSP.

### 7.1 Two enablement mechanisms

| Mechanism | When it runs | Persistence | Use it as |
| --- | --- | --- | --- |
| **Environment setup script** | Once, **pre-launch**, as root | Cached into the environment image | **Preferred.** LSP live from session 1; no plugin-load race |
| **SessionStart hook** (in-repo) | **Every** session start | Not cached; re-runs | Fallback when you can't edit the setup script |

A setup script installs dependencies + enables the plugin **before the agent starts**, so
the language server is ready on turn one. A SessionStart hook (committed in the repo) is the
in-repo alternative, but because it runs *as* the session starts, the plugin may only attach
on the **next** session (or after a plugin reload) — it *converges* rather than being
instant.

**Guardrail for the hook:** gate auto-install to the **remote** environment only (e.g. a
`CLAUDE_CODE_REMOTE`-style check), so a repo hook never silently mutates a **local**
developer's global agent config.

### 7.2 Cloud caveats to verify in *your* environment

- **Install type matters.** Native/standalone agent binaries have historically differed
  from npm/bun installs in whether they can spawn LSP plugins — and this changes across
  versions. **Verify** the LSP tool actually appears in a session before relying on it.
- **Workspace trust** still gates LSP startup in the cloud session.
- **Config version gates.** Some `.lsp.json` fields are only honored above a minimum agent
  version and — worse — can cause the server to be **silently skipped** on older versions.
  The class to watch is **server lifecycle controls** — e.g. `restartOnCrash` /
  `shutdownTimeout` in the worked example, which required a specific minimum CLI version and
  silently skipped the server below it. Note these are exactly the robustness fields the
  minimal §4 example omits: start without them, add them once you've pinned your minimum
  version, and have the enable script **warn loudly** (never silently proceed) when the
  running version is older.
- **No install needed if the binary is already a dependency.** If your repo already depends
  on the compiler (e.g. as a dev-dependency), a normal `install` provides the binary and no
  extra network fetch is required — a real advantage under a restrictive proxy.

### 7.3 A reusable "enable" script pattern

Make enablement **idempotent, non-fatal, and portable**:

- **Idempotent**: check if already installed before installing.
- **Non-fatal**: never exit non-zero from a startup hook — a hook that fails must not break
  the session; surface problems as warnings.
- **Portable**: don't rely on GNU-only shell features (e.g. `sort -V`) in scripts a local
  developer might run on macOS/BSD — prefer a `python3`-based check with a fallback.

See [`tools/ts7-lsp/enable.sh`](../tools/ts7-lsp/enable.sh) and
[`setup-script.example.sh`](../tools/ts7-lsp/setup-script.example.sh) for a concrete version.

---

## 8. Verifying it works — a methodology

**Don't trust "it should work" — prove it.** Build a small **acceptance test** that drives
the language server *directly* (independent of the agent) and asserts resolution. This makes
adoption reproducible and catches regressions.

A minimal test: spawn the server over stdio, send `initialize` → `initialized` →
`textDocument/didOpen` → `textDocument/definition` at a known symbol, and assert the result
lands where expected. [`tools/ts7-lsp/verify-navigation.py`](../tools/ts7-lsp/verify-navigation.py)
is a self-contained example.

**The one non-obvious gotcha that will cost you an afternoon:** a conformant LSP client
**must answer server→client requests** — `client/registerCapability`,
`workspace/configuration`, etc. If your test client ignores them, the server **stalls
project loading** and every `definition` request returns nothing. A real editor/agent
handles this; a hand-rolled probe often doesn't. Reply to those requests (a `null`/empty
result is fine) and the server proceeds.

**What "healthy" looks like:**

- **Within-module** go-to-definition lands in **source**.
- **Cross-module** go-to-definition — **in a monorepo whose packages import each other's
  built output** (`exports` → `dist`), it may land in the **built declaration**, which is
  *expected* there (see §9). In a single package, or a workspace that resolves imports to
  source (a Cargo/Go workspace, or a TS monorepo mapped to source), it should reach
  **source**. Either way, **hover** and **workspaceSymbol** should work.
- **Diagnostics** appear after an edit that introduces a type error.

**Run it in CI.** Because the acceptance test drives the server **directly, with no live
agent**, it is CI-able even though the agent's live LSP-tool availability generally is not.
Wire it into CI on the **same runner image and install** you use in dev, so a language
server, binary-name, or config regression **fails the build** instead of waiting for someone
to run the probe by hand. Then finish with an **interactive check** (which CI can't do): in
a real session, ask the agent to go-to-definition on a cross-module symbol and confirm the
tool is actually present and answering.

---

## 9. A known limitation — cross-package navigation in monorepos

In a monorepo where packages import each other through their published **`exports`** (which
point at built output, e.g. `dist/`), **cross-package go-to-definition resolves into the
built declaration file** (or is treated as an "external library"), **not** the source.
Within-package navigation is perfect; cross-package **hover** and **workspaceSymbol** work;
only cross-package *jump-to-source* is affected.

Two things make this stubborn:

1. **It needs the build.** Cross-package results require the dependency's `dist` to be built
   at all — a "stale/missing `dist`" trap.
2. **The obvious fixes aren't free.** Mapping imports to source (a `paths`-to-`src` mapping)
   *does* fix navigation — but the LSP and the type-checker usually **share the same
   config**, so the same mapping forces the type-checker to compile cross-package *source*,
   which can collide with a monorepo's project/emit model (composite projects, `rootDir`,
   declaration emit). Declaration maps can help in principle, but **bundled** `.d.ts` output
   (from bundlers) often lacks the per-file maps needed.

**The point for adopters:** this is a *known, bounded* limitation, not a blocker — decide
deliberately whether the fix is worth its cost, and **record the decision** (an Architecture
Decision Record, or ADR — a short dated markdown file capturing the context, the decision,
and the options considered — is a good vehicle) so future maintainers inherit the reasoning. The worked example did exactly
this in [ADR-016](adr/016-defer-paths-src-cross-package-navigation.md), which enumerates four
concrete future options (split configs, dismantle the emit model, declaration maps, project
`references`) with their trade-offs.

---

## 10. Model-tier considerations (Sonnet / Opus / larger)

- **Precise tools help across tiers.** There is **no strong published evidence** (mid-2026)
  that one model tier benefits dramatically more than another from LSP-style precision over
  grep noise; adjacent research is mixed. Don't gate the decision on model choice.
- **The economics scale with session shape, not tier.** A per-call token/turn saving
  compounds over **long, tool-heavy sessions** and matters most with **expensive models** —
  so the ROI tracks how long and how navigation-heavy your sessions are, and how costly the
  model is, more than which specific tier you run.
- **Practical guidance:** decide by **task shape** (cross-module symbol work benefits
  regardless of tier), and expect the payoff to grow with session length and model cost.

---

## 11. Pitfalls checklist

Hard-won, generalized. Each cost real time in the worked example:

- [ ] **Verify the real binary** your toolchain invokes — names collide and mislead (§5.2).
- [ ] **Match the LSP engine to the CI type-check engine** (§5.1).
- [ ] **Install the language-server binary** — it isn't bundled with the plugin/wrapper (§5.4).
- [ ] **Workspace trust** must be accepted before the LSP starts (§6, §7.2).
- [ ] **Config version gates** can *silently skip* the server on older agent versions — know
      your minimum and warn (§7.2).
- [ ] **Native vs npm/bun install** can differ in LSP support in the cloud — verify (§7.2).
- [ ] **Build/docs tooling may need the classic compiler** — plan for coexistence, not
      replacement (§5.3).
- [ ] **A dependency you "removed" can silently return** via another tool's transitive
      optional-peer resolution — confirm it's gone from a clean install; pin or hook it out if
      not (in JS/pnpm this was a `.pnpmfile.cjs`; other ecosystems have equivalents) (§5.3).
- [ ] **Cross-package navigation** resolves to built declarations and needs `dist` built (§9).
- [ ] **Bundled `.d.ts`** often lack declaration maps → no cheap upgrade to source nav (§9).
- [ ] **Your LSP client must answer server→client requests** or the server stalls (§8).
- [ ] **Keep enable scripts portable** — no GNU-only shell flags (§7.3).

---

## 12. Adoption checklist (start-to-finish)

1. **Evaluate fit** (§3): run the grep-noise test; confirm size/typing/fan-out justify it.
2. **Pick the integration** (§4): native LSP tool, or MCP-wrapped server.
3. **Pick the server** (§5): the same compiler CI type-checks with; verify the binary; plan
   coexistence if the build needs a different compiler.
4. **Wire it up**: `.lsp.json` (or MCP config) + install the server binary.
5. **Enable for each environment**: local (install + trust); cloud (setup script preferred,
   SessionStart hook as fallback; idempotent, non-fatal, portable).
6. **Verify** (§8): reproducible acceptance test (remember: answer server→client requests) +
   an interactive check.
7. **Wire the acceptance test into CI** (§8): the direct-drive test (no live agent) runs on
   your CI image and catches server/binary/config regressions.
8. **Document limitations & decisions** (§9): record any deferred fix (e.g. cross-package
   source navigation) as an ADR so the reasoning survives.
9. **Know how to back it out**: keep a documented reverse of enablement — Path A: uninstall
   the plugin and remove any local marketplace the enable step added; Path B: delete the MCP
   server config; cloud: drop the setup-script/hook step. Useful when a server hangs, eats
   memory on a very large tree (§4), or a bad upgrade lands.
10. **Watch for the pitfalls** (§11).

---

## 13. Worked example (this repo)

This guide was distilled from a real adoption in a ~40-package TypeScript monorepo:

- [`tools/ts7-lsp/`](../tools/ts7-lsp/) — the plugin, the idempotent `enable.sh`, the cloud
  `setup-script.example.sh`, and the reproducible `verify-navigation.py` acceptance test.
- [`tools/ts7-lsp/README.md`](../tools/ts7-lsp/README.md) — repo-specific setup and the
  cross-package-navigation note.
- [ADR-016](adr/016-defer-paths-src-cross-package-navigation.md) — the recorded decision to
  defer cross-package source navigation, with four future options.
- The root `CLAUDE.md` *Toolchain note* and *Code intelligence* section — how the compiler
  coexistence and the LSP fit into the day-to-day toolchain.

Read those for the concrete commands; use this guide for the reasoning that ports to any
repo.
