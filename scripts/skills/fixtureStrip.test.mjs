// Unit tests for the fixture consumer-strip transform, run against the real
// golden WorkspaceDriver so the (fiddly) edit logic is proven, not assumed.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { bracesBalanced, FIXTURES, stripConsumer } from './fixtureStrip.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

test('admin-settings fixture un-wires AdminSettingsDriver from the real WorkspaceDriver', () => {
  const fixture = FIXTURES['admin-settings'];
  const source = readFileSync(resolve(repoRoot, fixture.consumerPath), 'utf8');
  const stripped = stripConsumer(source, fixture);

  // Every reference to the stripped driver is gone.
  assert.equal(/AdminSettingsDriver/.test(stripped), false, 'no AdminSettingsDriver references remain');
  assert.equal(/\bget admin\b/.test(stripped), false, 'the admin accessor is removed');
  assert.equal(/^\s*admin:/m.test(stripped), false, 'the admin ScenePart entry is removed');

  // The rest of the page object survives intact.
  for (const survivor of ['shell', 'chat', 'commandBar']) {
    assert.ok(new RegExp(`\\b${survivor}\\b`).test(stripped), `${survivor} part survives`);
  }
  assert.ok(/gotoAdmin/.test(stripped), 'gotoAdmin (which delegates to shell, not admin) survives');

  // And the file is still structurally valid.
  assert.ok(bracesBalanced(stripped), 'braces stay balanced after the edit');
  assert.ok(stripped.trimEnd().endsWith('}'), 'file still ends with the class close brace');
});

test('stripping is a strict reduction (never grows the file)', () => {
  const fixture = FIXTURES['admin-settings'];
  const source = readFileSync(resolve(repoRoot, fixture.consumerPath), 'utf8');
  const stripped = stripConsumer(source, fixture);
  assert.ok(stripped.length < source.length);
});
