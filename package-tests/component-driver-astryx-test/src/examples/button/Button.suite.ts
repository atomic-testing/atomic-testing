import { ButtonDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byAriaLabel, byDataTestId, byRole, locatorUtil, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { buttonUIExample } from './Button.examples';

export const buttonExampleScenePart = {
  // Plain Astryx buttons anchored by the forwarded data-testid (stable handle).
  saveButton: {
    locator: byDataTestId('save-button'),
    driver: ButtonDriver,
  },
  clickCount: {
    locator: byDataTestId('click-count'),
    driver: HTMLElementDriver,
  },
  disabledButton: {
    locator: byDataTestId('disabled-button'),
    driver: ButtonDriver,
  },
  // Two same-role buttons told apart purely by their verbatim aria-label — the
  // role/name-first path Astryx needs, expressed as byRole composed with
  // byAriaLabel on the same element (`'Same'`).
  openButton: {
    locator: locatorUtil.append(byRole('button'), byAriaLabel('Open', 'Same')),
    driver: ButtonDriver,
  },
  closeButton: {
    locator: locatorUtil.append(byRole('button'), byAriaLabel('Close', 'Same')),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const buttonExample: IExampleUnit<typeof buttonExampleScenePart, JSX.Element> = {
  ...buttonUIExample,
  scene: buttonExampleScenePart,
};

export const buttonExampleTestSuite: TestSuiteInfo<typeof buttonExample.scene> = {
  title: 'Astryx Button',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${buttonExample.title}`, () => {
      const engine = useTestEngine(buttonExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel returns the accessible name (visible text when no aria-label).
      test(`getLabel returns the button's accessible name`, async () => {
        assertEqual(await engine().parts.saveButton.getLabel(), 'Save');
      });

      // click reaches the Astryx onClick handler — the recorded counter advances.
      test(`click triggers the button's action`, async () => {
        assertEqual(await engine().parts.clickCount.getText(), '0');
        await engine().parts.saveButton.click();
        const count = await engine().parts.clickCount.waitUntil({
          probeFn: () => engine().parts.clickCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // isDisabled reflects a disabled instance (Astryx native `disabled`) and is
      // false for an enabled one.
      test(`isDisabled reflects the disabled state`, async () => {
        assertTrue(await engine().parts.disabledButton.isDisabled());
        assertFalse(await engine().parts.saveButton.isDisabled());
      });

      // Two same-role buttons each resolve to their OWN element via the verbatim
      // aria-label, proving byRole + byAriaLabel disambiguation.
      test(`byRole + byAriaLabel disambiguates two same-role buttons`, async () => {
        assertTrue(await engine().parts.openButton.exists());
        assertTrue(await engine().parts.closeButton.exists());
        assertEqual(await engine().parts.openButton.getLabel(), 'Open');
        assertEqual(await engine().parts.closeButton.getLabel(), 'Close');
      });
    });
  },
};
