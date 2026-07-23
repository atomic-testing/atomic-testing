import { HTMLElementDriver, HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import {
  byAriaLabel,
  byDataTestId,
  byRole,
  findByRole,
  IExampleUnit,
  locatorUtil,
  ScenePart,
} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { findByRoleUIExample } from './FindByRole.examples';

export const findByRoleExampleScenePart = {
  saveButton: {
    locator: findByRole('button', 'Save'),
    driver: HTMLElementDriver,
  },
  saveClickCount: {
    locator: byDataTestId('save-click-count'),
    driver: HTMLElementDriver,
  },
  // A CSS-only role+aria-label locator, for contrast: `saveButton` above has
  // NO `aria-label` attribute (its name is computed from text content), so
  // this must resolve to nothing.
  saveButtonViaAriaLabel: {
    locator: locatorUtil.and(byRole('button'), byAriaLabel('Save')),
    driver: HTMLElementDriver,
  },
  cancelButton: {
    locator: findByRole('button', 'Cancel'),
    driver: HTMLElementDriver,
  },
  cancelClickCount: {
    locator: byDataTestId('cancel-click-count'),
    driver: HTMLElementDriver,
  },
  emailInput: {
    locator: findByRole('textbox', 'Email'),
    driver: HTMLTextInputDriver,
  },
  outerConfirmButton: {
    locator: locatorUtil.append(byDataTestId('outer-panel'), findByRole('button', 'Confirm')),
    driver: HTMLElementDriver,
  },
  outerConfirmClickCount: {
    locator: byDataTestId('outer-confirm-click-count'),
    driver: HTMLElementDriver,
  },
  innerConfirmButton: {
    locator: locatorUtil.append(byDataTestId('inner-panel'), findByRole('button', 'Confirm')),
    driver: HTMLElementDriver,
  },
  innerConfirmClickCount: {
    locator: byDataTestId('inner-confirm-click-count'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const findByRoleExample: IExampleUnit<typeof findByRoleExampleScenePart, JSX.Element> = {
  ...findByRoleUIExample,
  scene: findByRoleExampleScenePart,
};

export const findByRoleExampleTestSuite: TestSuiteInfo<typeof findByRoleExample.scene> = {
  title: 'findByRole: computed accessible name',
  url: '/find-by-role',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${findByRoleExample.title}`, () => {
      const engine = useTestEngine(findByRoleExample.scene, getTestEngine, { beforeEach, afterEach });

      // Cross-engine, both jsdom (@testing-library/dom) and Playwright resolve
      // the computed name identically here (#923).
      test(`findByRole('button', 'Save') resolves a text-labeled button`, async () => {
        assertTrue(await engine().parts.saveButton.exists());
        assertEqual(await engine().parts.saveButton.getText(), 'Save');
      });

      // The contrast this issue exists for: a verbatim-aria-label CSS locator
      // finds NOTHING on a text-labeled button, because there is no
      // `aria-label` attribute to match — only `findByRole`'s computed-name
      // resolution reaches it.
      test(`byAriaLabel('Save') does NOT find the text-labeled Save button`, async () => {
        assertFalse(await engine().parts.saveButtonViaAriaLabel.exists());
      });

      // Drives the text-labeled button end-to-end via a real click — the
      // acceptance bar for #923, not just a read/exists check.
      test(`findByRole('button', 'Save') drives an actual click`, async () => {
        assertEqual(await engine().parts.saveClickCount.getText(), '0');
        await engine().parts.saveButton.click();
        const count = await engine().parts.saveClickCount.waitUntil({
          probeFn: () => engine().parts.saveClickCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // Name computed from `aria-labelledby`, not the button's own text
      // content ('✕') — a case byAriaLabel could never reach either way.
      test(`findByRole('button', 'Cancel') resolves aria-labelledby and drives a click`, async () => {
        assertTrue(await engine().parts.cancelButton.exists());
        assertEqual(await engine().parts.cancelClickCount.getText(), '0');
        await engine().parts.cancelButton.click();
        const count = await engine().parts.cancelClickCount.waitUntil({
          probeFn: () => engine().parts.cancelClickCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // Name computed from an associated <label>.
      test(`findByRole('textbox', 'Email') resolves a label-associated input`, async () => {
        assertTrue(await engine().parts.emailInput.exists());
        await engine().parts.emailInput.setValue('user@example.com');
        assertEqual(await engine().parts.emailInput.getValue(), 'user@example.com');
      });

      // Two "Confirm" buttons share the SAME computed name in different
      // containers; only scoping findByRole under each container's own
      // locator (locatorUtil.append) disambiguates and drives the right one.
      test(`findByRole scoped under a container disambiguates same-named siblings`, async () => {
        assertEqual(await engine().parts.outerConfirmClickCount.getText(), '0');
        assertEqual(await engine().parts.innerConfirmClickCount.getText(), '0');

        await engine().parts.outerConfirmButton.click();
        const outerCount = await engine().parts.outerConfirmClickCount.waitUntil({
          probeFn: () => engine().parts.outerConfirmClickCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(outerCount, '1');
        // The inner button's counter must be untouched by the outer click.
        assertEqual(await engine().parts.innerConfirmClickCount.getText(), '0');

        await engine().parts.innerConfirmButton.click();
        const innerCount = await engine().parts.innerConfirmClickCount.waitUntil({
          probeFn: () => engine().parts.innerConfirmClickCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(innerCount, '1');
        // The outer button's counter must stay at 1, not double-fire.
        assertEqual(await engine().parts.outerConfirmClickCount.getText(), '1');
      });
    });
  },
};
