import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byRole, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { byRoleUIExample } from './ByRole.examples';

export const byRoleExampleScenePart = {
  // Same role, distinguished only by verbatim aria-label — the disambiguation
  // rule under test: byRole(role, { name }) → [role="..."][aria-label="..."].
  openButton: {
    locator: byRole('button', { name: 'Open' }),
    driver: HTMLElementDriver,
  },
  closeButton: {
    locator: byRole('button', { name: 'Close' }),
    driver: HTMLElementDriver,
  },
  // Multi-word verbatim aria-label (the common Astryx case). Guards that spaces
  // in the name escape and match, and that the match is the EXACT full label —
  // 'Close dialog' must not be reached by the 'Close' locator above.
  closeDialogButton: {
    locator: byRole('button', { name: 'Close dialog' }),
    driver: HTMLElementDriver,
  },
  // Legacy positional `relative` form — regression guard that the overload did
  // not break the original string signature.
  group: {
    locator: byRole('group', 'Root'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const byRoleExample: IExampleUnit<typeof byRoleExampleScenePart, JSX.Element> = {
  ...byRoleUIExample,
  scene: byRoleExampleScenePart,
};

export const byRoleExampleTestSuite: TestSuiteInfo<typeof byRoleExample.scene> = {
  title: 'byRole: name-aware overload',
  url: '/by-role',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${byRoleExample.title}`, () => {
      const engine = useTestEngine(byRoleExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`byRole('button', { name: 'Open' }) resolves to the Open button`, async () => {
        assertTrue(await engine().parts.openButton.exists());
        assertEqual(await engine().parts.openButton.getText(), 'first');
      });

      test(`byRole('button', { name: 'Close' }) resolves to the Close button`, async () => {
        assertTrue(await engine().parts.closeButton.exists());
        assertEqual(await engine().parts.closeButton.getText(), 'second');
      });

      // Two same-role elements resolve to DIFFERENT elements purely via name.
      test(`name disambiguates two same-role elements`, async () => {
        assertEqual(await engine().parts.openButton.getText(), 'first');
        assertEqual(await engine().parts.closeButton.getText(), 'second');
      });

      // Multi-word name resolves (spaces escape correctly inside [aria-label="..."]).
      test(`byRole('button', { name: 'Close dialog' }) resolves the multi-word label`, async () => {
        assertTrue(await engine().parts.closeDialogButton.exists());
        assertEqual(await engine().parts.closeDialogButton.getText(), 'third');
      });

      // Exact-match guard: 'Close' and 'Close dialog' are distinct elements — the
      // name filter matches the FULL aria-label, never a prefix/substring.
      test(`name matches the exact full aria-label, not a substring`, async () => {
        assertEqual(await engine().parts.closeButton.getText(), 'second');
        assertEqual(await engine().parts.closeDialogButton.getText(), 'third');
      });

      // Regression: the legacy positional `relative` signature still resolves.
      test(`legacy byRole(role, 'Root') positional form still resolves`, async () => {
        assertTrue(await engine().parts.group.exists());
      });
    });
  },
};
