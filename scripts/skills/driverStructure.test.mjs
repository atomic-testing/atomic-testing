// Unit tests for the structural analyzer. Run with `node --test`.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { analyzeDriverSource, hasErrors, PARTS_CEILING, _internal } from './driverStructure.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = rel => readFileSync(resolve(repoRoot, rel), 'utf8');

const GOOD_DRIVER = `
import { ComponentDriver, IComponentDriverOption, Interactor, PartLocator, ScenePart, byDataTestId } from '@atomic-testing/core';
import { ButtonDriver, TextFieldDriver } from '@atomic-testing/component-driver-html';

const parts = {
  street: { locator: byDataTestId('street'), driver: TextFieldDriver },
  submit: { locator: byDataTestId('submit'), driver: ButtonDriver },
} satisfies ScenePart;

export class ShippingFormDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }
  get driverName(): string { return 'ShippingFormDriver'; }
}

type _Lock = AssertScenePlaceableDriver<typeof ShippingFormDriver>;
`;

test('a well-formed composite driver produces no errors', () => {
  const { kind, findings } = analyzeDriverSource(GOOD_DRIVER, { fileName: 'ShippingFormDriver.ts' });
  assert.equal(kind, 'driver');
  assert.equal(hasErrors(findings), false);
  // It has the lock, so no missing-lock warning.
  assert.equal(
    findings.some(f => f.code === 'missing-lock'),
    false
  );
  assert.equal(
    findings.some(f => f.code === 'missing-contravariant-ctor'),
    false
  );
});

test('the parameterized-option anti-pattern is a hard error', () => {
  const bad = GOOD_DRIVER.replace(
    'option?: Partial<IComponentDriverOption>',
    'option?: Partial<IComponentDriverOption<typeof parts>>'
  );
  const { findings } = analyzeDriverSource(bad, { fileName: 'ShippingFormDriver.ts' });
  assert.equal(hasErrors(findings), true);
  assert.ok(findings.some(f => f.code === 'parameterized-option' && f.severity === 'error'));
});

test('a parts object without `satisfies ScenePart` is a hard error', () => {
  const bad = GOOD_DRIVER.replace('} satisfies ScenePart;', '};');
  const { findings } = analyzeDriverSource(bad, { fileName: 'ShippingFormDriver.ts' });
  assert.ok(findings.some(f => f.code === 'missing-satisfies' && f.severity === 'error'));
});

test('a missing contravariant constructor warns (not errors)', () => {
  const noCtor = GOOD_DRIVER.replace(/constructor\([\s\S]*?\}\n/, '');
  const { findings } = analyzeDriverSource(noCtor, { fileName: 'ShippingFormDriver.ts' });
  assert.ok(findings.some(f => f.code === 'missing-contravariant-ctor' && f.severity === 'warn'));
  assert.equal(hasErrors(findings), false);
});

test('a page scene with one root entry passes', () => {
  const scene = `
    import { byDataTestId, ScenePart } from '@atomic-testing/core';
    import { WorkspaceDriver } from './WorkspaceDriver';
    export const workspaceParts = {
      workspace: { locator: byDataTestId('root'), driver: WorkspaceDriver },
    } satisfies ScenePart;
  `;
  const { kind, findings } = analyzeDriverSource(scene, { fileName: 'workspaceParts.ts' });
  assert.equal(kind, 'scene');
  assert.equal(hasErrors(findings), false);
  assert.ok(findings.some(f => f.code === 'page-single-root'));
});

test('a flat page scene with several roots is a hard error (god-scene)', () => {
  const flat = `
    import { byDataTestId, ScenePart } from '@atomic-testing/core';
    export const signupParts = {
      credential: { locator: byDataTestId('c'), driver: CredentialFormDriver },
      shipping: { locator: byDataTestId('s'), driver: ShippingFormDriver },
      billing: { locator: byDataTestId('b'), driver: BillingFormDriver },
    } satisfies ScenePart;
  `;
  const { findings } = analyzeDriverSource(flat, { fileName: 'signupParts.ts' });
  assert.ok(findings.some(f => f.code === 'page-multiple-roots' && f.severity === 'error'));
});

test('a comment mentioning `satisfies ScenePart` does not fool the analyzer', () => {
  const commented = `
    // This driver's parts object uses satisfies ScenePart under the hood.
    /* The parts map is: driver: Foo. */
    import { ComponentDriver } from '@atomic-testing/core';
    export class LeafDriver extends ComponentDriver {
      get driverName(): string { return 'LeafDriver'; }
    }
  `;
  const { kind } = analyzeDriverSource(commented, { fileName: 'LeafDriver.ts' });
  // No module-level parts object at all — the comment text must not create one.
  assert.equal(kind, 'driver');
  const { findings } = analyzeDriverSource(commented, { fileName: 'LeafDriver.ts' });
  assert.equal(
    findings.some(f => f.code === 'missing-satisfies'),
    false
  );
});

test('topLevelKeyCount matches the real golden fixtures', () => {
  const admin = read('examples/example-astryx-workspace/src/testing/AdminSettingsDriver.ts');
  const workspace = read('examples/example-astryx-workspace/src/testing/WorkspaceDriver.ts');
  const adminObj = _internal.findSceneObjects(_internal.stripComments(admin))[0];
  const workspaceObj = _internal.findSceneObjects(_internal.stripComments(workspace))[0];
  assert.equal(_internal.topLevelKeyCount(adminObj.object), 13);
  assert.equal(_internal.topLevelKeyCount(workspaceObj.object), 4);
});

test('all shipped golden-fixture drivers have zero structural errors', () => {
  const files = [
    'examples/example-astryx-workspace/src/testing/AdminSettingsDriver.ts',
    'examples/example-astryx-workspace/src/testing/WorkspaceDriver.ts',
    'examples/example-astryx-workspace/src/testing/WorkspaceShellDriver.ts',
    'examples/example-shadcn-workspace/src/testing/WorkspaceDriver.ts',
    'examples/example-astryx-workspace/src/testing/workspaceParts.ts',
    'examples/example-mui-ticket-console/src/testing/consoleParts.ts',
  ];
  for (const rel of files) {
    const { findings } = analyzeDriverSource(read(rel), { fileName: rel });
    assert.equal(hasErrors(findings), false, `${rel} should have no structural errors`);
  }
});

test('AdminSettingsDriver trips the ceiling as a warning, never an error', () => {
  const admin = read('examples/example-astryx-workspace/src/testing/AdminSettingsDriver.ts');
  const { findings } = analyzeDriverSource(admin, { fileName: 'AdminSettingsDriver.ts' });
  const ceiling = findings.find(f => f.code === 'parts-ceiling');
  assert.ok(ceiling, 'expected a parts-ceiling finding');
  assert.equal(ceiling.severity, 'warn');
  assert.ok(PARTS_CEILING < 13);
});
