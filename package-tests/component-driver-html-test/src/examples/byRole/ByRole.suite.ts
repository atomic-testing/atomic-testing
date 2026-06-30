import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byAriaLabel, byRole, locatorUtil, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { byRoleUIExample } from './ByRole.examples';

export const byRoleExampleScenePart = {
  // Same role, distinguished only by verbatim aria-label — the disambiguation
  // rule under test: byRole composed with byAriaLabel on the SAME element →
  // [role="..."][aria-label="..."]. `'Same'` makes byAriaLabel compound onto the
  // preceding byRole rather than descend.
  openButton: {
    locator: locatorUtil.append(byRole('button'), byAriaLabel('Open', 'Same')),
    driver: HTMLElementDriver,
  },
  closeButton: {
    locator: locatorUtil.append(byRole('button'), byAriaLabel('Close', 'Same')),
    driver: HTMLElementDriver,
  },
  // Multi-word verbatim aria-label (the common Astryx case). Guards that spaces
  // in the name escape and match, and that the match is the EXACT full label —
  // 'Close dialog' must not be reached by the 'Close' locator above.
  closeDialogButton: {
    locator: locatorUtil.append(byRole('button'), byAriaLabel('Close dialog', 'Same')),
    driver: HTMLElementDriver,
  },
  // Plain positional `relative` form — guards that byRole's original string
  // signature still resolves the root.
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
  title: 'byRole + byAriaLabel: name disambiguation',
  url: '/by-role',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    describe(`${byRoleExample.title}`, () => {
      const engine = useTestEngine(byRoleExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`byRole + byAriaLabel('Open') resolves to the Open button`, async () => {
        assertTrue(await engine().parts.openButton.exists());
        assertEqual(await engine().parts.openButton.getText(), 'first');
      });

      test(`byRole + byAriaLabel('Close') resolves to the Close button`, async () => {
        assertTrue(await engine().parts.closeButton.exists());
        assertEqual(await engine().parts.closeButton.getText(), 'second');
      });

      // Two same-role elements resolve to DIFFERENT elements purely via the name.
      test(`aria-label disambiguates two same-role elements`, async () => {
        assertEqual(await engine().parts.openButton.getText(), 'first');
        assertEqual(await engine().parts.closeButton.getText(), 'second');
      });

      // Multi-word name resolves (spaces escape correctly inside [aria-label="..."]).
      test(`byAriaLabel('Close dialog') resolves the multi-word label`, async () => {
        assertTrue(await engine().parts.closeDialogButton.exists());
        assertEqual(await engine().parts.closeDialogButton.getText(), 'third');
      });

      // Exact-match guard: 'Close' and 'Close dialog' are distinct elements — the
      // aria-label filter matches the FULL attribute, never a prefix/substring.
      test(`byAriaLabel matches the exact full aria-label, not a substring`, async () => {
        assertEqual(await engine().parts.closeButton.getText(), 'second');
        assertEqual(await engine().parts.closeDialogButton.getText(), 'third');
      });

      // Regression: byRole's positional `relative` signature still resolves.
      test(`byRole(role, 'Root') positional form still resolves`, async () => {
        assertTrue(await engine().parts.group.exists());
      });
    });
  },
};
