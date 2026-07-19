#!/usr/bin/env python3
"""Reproducible acceptance test for the TypeScript 7 native (tsc) LSP.

Drives `pnpm exec tsc --lsp --stdio` directly (no Claude Code involved) and asserts
that go-to-definition resolves for a within-package relative import and a cross-package
`@atomic-testing/*` import. Prints, for each, whether the definition landed in `src`,
built `dist`, or `node_modules` — the signal behind the "Cross-package navigation"
section of README.md.

Usage:
    python3 tools/ts7-lsp/verify-navigation.py
    python3 tools/ts7-lsp/verify-navigation.py -- node_modules/.bin/tsc --lsp --stdio

Notes:
  * A conformant LSP client MUST answer server->client requests (registerCapability,
    workspace/configuration); tsc stalls project load otherwise. This client does.
  * Cross-package resolution requires the imported package's `dist` to be built
    (its package.json `exports` point at dist). Build core first:
        pnpm --filter @atomic-testing/core build
"""
import json, os, subprocess, sys, threading, time
from pathlib import Path

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def _frame(obj):
    body = json.dumps(obj).encode()
    return b"Content-Length: " + str(len(body)).encode() + b"\r\n\r\n" + body


class LspClient:
    def __init__(self, cmd):
        # stderr is intentionally discarded: nothing reads it, and an undrained PIPE
        # would deadlock the child once tsc writes past the ~64KB pipe buffer.
        self.proc = subprocess.Popen(cmd, cwd=REPO, stdin=subprocess.PIPE,
                                     stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        self._buf = b""
        self._messages = []
        self._lock = threading.Lock()
        threading.Thread(target=self._read_loop, daemon=True).start()

    def _read_loop(self):
        while True:
            byte = self.proc.stdout.read(1)
            if not byte:
                return
            self._buf += byte
            while b"\r\n\r\n" in self._buf:
                header, rest = self._buf.split(b"\r\n\r\n", 1)
                length = next((int(line.split(b":")[1]) for line in header.split(b"\r\n")
                               if line.lower().startswith(b"content-length:")), None)
                if length is None or len(rest) < length:
                    break
                message, self._buf = rest[:length], rest[length:]
                try:
                    parsed = json.loads(message)
                except json.JSONDecodeError:
                    continue
                with self._lock:
                    self._messages.append(parsed)
                # Answer server->client requests, or tsc never finishes loading.
                if parsed.get("method") and "id" in parsed:
                    if parsed["method"] == "workspace/configuration":
                        count = len(parsed.get("params", {}).get("items", []))
                        self.send({"jsonrpc": "2.0", "id": parsed["id"], "result": [None] * count})
                    else:
                        self.send({"jsonrpc": "2.0", "id": parsed["id"], "result": None})

    def send(self, obj):
        try:
            self.proc.stdin.write(_frame(obj))
            self.proc.stdin.flush()
        except (BrokenPipeError, ValueError):
            pass

    def request(self, id_, method, params, timeout=8):
        self.send({"jsonrpc": "2.0", "id": id_, "method": method, "params": params})
        deadline = time.time() + timeout
        while time.time() < deadline:
            with self._lock:
                for m in self._messages:
                    if m.get("id") == id_ and ("result" in m or "error" in m):
                        return m
            time.sleep(0.03)
        return None

    def notify(self, method, params):
        self.send({"jsonrpc": "2.0", "method": method, "params": params})

    def close(self):
        self.proc.terminate()


def _uri(rel):
    # Path.as_uri() percent-encodes and emits forward slashes, so the URI is valid
    # on paths with spaces and correct on Windows (unlike "file://" + os.path.join).
    return Path(os.path.join(REPO, rel)).resolve().as_uri()


def _position_of(text, needle):
    idx = text.find(needle)
    return (text.count("\n", 0, idx), idx - (text.rfind("\n", 0, idx) + 1)) if idx >= 0 else None


def _classify(target_uri):
    if "/src/" in target_uri:
        return "src"
    if "/dist/" in target_uri:
        return "dist"
    if "node_modules" in target_uri:
        return "node_modules"
    return "unknown"


def _definition(client, rel, symbol, id_, timeout=40):
    text = open(os.path.join(REPO, rel)).read()
    client.notify("textDocument/didOpen", {"textDocument": {
        "uri": _uri(rel), "languageId": "typescript", "version": 1, "text": text}})
    pos = _position_of(text, symbol)
    if pos is None:  # symbol not in the file (moved/renamed) — report a clean FAIL, not a crash
        return None
    deadline = time.time() + timeout
    while time.time() < deadline:
        resp = client.request(id_, "textDocument/definition", {
            "textDocument": {"uri": _uri(rel)},
            "position": {"line": pos[0], "character": pos[1] + 2}})
        id_ += 1
        if resp and resp.get("result"):
            result = resp["result"]
            result = [result] if isinstance(result, dict) else result
            return [(_classify(r.get("uri") or r.get("targetUri", "")),
                     (r.get("uri") or r.get("targetUri", "")).replace("file://" + REPO + "/", ""))
                    for r in result]
        time.sleep(2)
    return None


def main():
    args = sys.argv[1:]
    if args[:1] == ["--"]:  # allow the documented `... -- <binary> <args>` passthrough
        args = args[1:]
    cmd = args if args else ["node_modules/.bin/tsc", "--lsp", "--stdio"]
    client = LspClient(cmd)
    init = client.request(1, "initialize", {
        "processId": os.getpid(), "rootUri": _uri("."),
        "workspaceFolders": [{"uri": _uri("."), "name": "atomic-testing"}],
        "capabilities": {"workspace": {"configuration": True},
                         "textDocument": {"definition": {"linkSupport": True}}}}, timeout=20)
    if not init or "result" not in init:
        print("FAIL: tsc did not answer initialize"); client.close(); sys.exit(1)
    client.notify("initialized", {})

    checks = [
        ("within-package (relative import)",
         "packages/core/src/drivers/ComponentDriver.ts", "getPartFromDefinition", {"src"}),
        ("cross-package (@atomic-testing/core)",
         "packages/component-driver-html/src/components/HTMLCheckboxGroupDriver.ts",
         "ComponentDriver", {"src", "dist"}),
    ]
    ok = True
    for label, rel, symbol, acceptable in checks:
        found = _definition(client, rel, symbol, id_=100 + 100 * checks.index((label, rel, symbol, acceptable)))
        if not found:
            print(f"FAIL  {label}: no definition resolved"); ok = False; continue
        kind, where = found[0]
        status = "OK  " if kind in acceptable else "WARN"
        if kind not in acceptable:
            ok = False
        print(f"{status}  {label}: [{kind}] {where}")
    client.close()
    print("\nAll navigation checks passed." if ok else "\nSome checks failed — see WARN/FAIL above.")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
