#!/usr/bin/env node
// Fixture snapshot / restore for the golden-fixture eval workflow.
//
//   node scripts/skills/snapshot-fixture.mjs list
//   node scripts/skills/snapshot-fixture.mjs strip   <fixture>
//   node scripts/skills/snapshot-fixture.mjs restore <fixture>
//   node scripts/skills/snapshot-fixture.mjs status  [<fixture>]
//
// `strip` copies the golden driver + its consumer aside (into a gitignored
// backup), deletes the driver, and un-wires it from the consumer — leaving the
// example with a real, repeatable coverage gap. A human or an agent session
// then drives `scaffold-test-driver` to regenerate the driver and re-compose it
// into the page object. `restore` puts the golden files back byte-for-byte.
//
// The scoring, once regenerated, is deterministic and lives in two existing
// gates (documented in README.md): `node scripts/skills/check-driver-structure.mjs
// <regenerated file>` for the structural idioms, and the example's own
// `pnpm test:dom` / `pnpm test:e2e` for behavior. This tool never invokes an
// agent — that step is manual/eval-time by design.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FIXTURES, stripConsumer } from './fixtureStrip.mjs';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../..');
const backupRoot = join(scriptDir, '.fixtures');

/** Stdout line writer — the house scripts avoid `console.log` (oxlint no-console). */
const write = line => process.stdout.write(`${line}\n`);

function backupDir(name) {
  return join(backupRoot, name);
}

function isStripped(name) {
  return existsSync(join(backupDir(name), 'driver.golden')) || existsSync(join(backupDir(name), 'consumer.golden'));
}

function requireFixture(name) {
  const fixture = FIXTURES[name];
  if (!fixture) {
    console.error(`[snapshot] Unknown fixture "${name}". Known: ${Object.keys(FIXTURES).join(', ')}.`);
    process.exit(2);
  }
  return fixture;
}

function strip(name) {
  const fixture = requireFixture(name);
  if (isStripped(name)) {
    console.error(`[snapshot] "${name}" is already stripped. Run \`restore ${name}\` first.`);
    process.exit(1);
  }
  const driverAbs = resolve(repoRoot, fixture.driverPath);
  const consumerAbs = resolve(repoRoot, fixture.consumerPath);
  if (!existsSync(driverAbs) || !existsSync(consumerAbs)) {
    console.error(`[snapshot] Golden files missing — expected ${fixture.driverPath} and ${fixture.consumerPath}.`);
    process.exit(1);
  }

  const dir = backupDir(name);
  mkdirSync(dir, { recursive: true });
  cpSync(driverAbs, join(dir, 'driver.golden'));
  cpSync(consumerAbs, join(dir, 'consumer.golden'));

  const consumerStripped = stripConsumer(readFileSync(consumerAbs, 'utf8'), fixture);
  writeFileSync(consumerAbs, consumerStripped, 'utf8');
  rmSync(driverAbs, { force: true });

  write(`[snapshot] Stripped "${name}":`);
  write(`  removed   ${fixture.driverPath}`);
  write(`  un-wired  ${fixture.consumerPath}`);
  write(`  backup    scripts/skills/.fixtures/${name}/ (gitignored)`);
  write('\nRegenerate with scaffold-test-driver, then score:');
  write(`  node scripts/skills/check-driver-structure.mjs ${fixture.driverPath}`);
  write(`  ( cd ${fixture.example} && pnpm test:dom )`);
  write(`\nRestore the golden files with:  node scripts/skills/snapshot-fixture.mjs restore ${name}`);
}

function restore(name) {
  const fixture = requireFixture(name);
  if (!isStripped(name)) {
    console.error(`[snapshot] "${name}" is not stripped — nothing to restore.`);
    process.exit(1);
  }
  const dir = backupDir(name);
  cpSync(join(dir, 'driver.golden'), resolve(repoRoot, fixture.driverPath));
  cpSync(join(dir, 'consumer.golden'), resolve(repoRoot, fixture.consumerPath));
  rmSync(dir, { recursive: true, force: true });
  write(`[snapshot] Restored "${name}" — ${basename(fixture.driverPath)} and its wiring are back to golden.`);
}

function status(name) {
  const names = name ? [name] : Object.keys(FIXTURES);
  for (const n of names) {
    requireFixture(n);
    write(`  ${isStripped(n) ? 'STRIPPED ' : 'golden   '} ${n}`);
  }
}

function list() {
  for (const [name, fixture] of Object.entries(FIXTURES)) {
    write(`  ${name}\n      ${fixture.description}`);
  }
}

const [command, name] = process.argv.slice(2);
switch (command) {
  case 'strip':
    if (!name) usage();
    strip(name);
    break;
  case 'restore':
    if (!name) usage();
    restore(name);
    break;
  case 'status':
    status(name);
    break;
  case 'list':
    list();
    break;
  default:
    usage();
}

function usage() {
  write('Usage: snapshot-fixture.mjs <list|strip|restore|status> [fixture]');
  write(`Fixtures: ${Object.keys(FIXTURES).join(', ')}`);
  process.exit(command ? 2 : 0);
}
