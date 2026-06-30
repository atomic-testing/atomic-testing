import { IconButtonDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { iconButtonUIExample } from './IconButton.examples';

export const iconButtonExampleScenePart = {
  settingsButton: {
    locator: byDataTestId('settings-button'),
    driver: IconButtonDriver,
  },
  deleteButton: {
    locator: byDataTestId('delete-button'),
    driver: IconButtonDriver,
  },
  clickCount: {
    locator: byDataTestId('icon-click-count'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const iconButtonExample: IExampleUnit<typeof iconButtonExampleScenePart, JSX.Element> = {
  ...iconButtonUIExample,
  scene: iconButtonExampleScenePart,
};

export const iconButtonExampleTestSuite: TestSuiteInfo<typeof iconButtonExample.scene> = {
  title: 'Astryx IconButton',
  url: '/icon-button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${iconButtonExample.title}`, () => {
      const engine = useTestEngine(iconButtonExample.scene, getTestEngine, { beforeEach, afterEach });

      // IconButton always sets aria-label (icon-only), so getLabel is reliable.
      test(`getLabel returns the icon button's accessible name`, async () => {
        assertEqual(await engine().parts.settingsButton.getLabel(), 'Settings');
      });

      // click reaches the handler — the recorded counter advances.
      test(`click triggers the action`, async () => {
        assertEqual(await engine().parts.clickCount.getText(), '0');
        await engine().parts.settingsButton.click();
        const count = await engine().parts.clickCount.waitUntil({
          probeFn: () => engine().parts.clickCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // isDisabled reflects a disabled instance and is false for an enabled one.
      test(`isDisabled reflects the disabled state`, async () => {
        assertTrue(await engine().parts.deleteButton.isDisabled());
        assertFalse(await engine().parts.settingsButton.isDisabled());
      });

      // Two icon buttons each resolve to their own element via testid.
      test(`two icon buttons disambiguate by testid`, async () => {
        assertEqual(await engine().parts.settingsButton.getLabel(), 'Settings');
        assertEqual(await engine().parts.deleteButton.getLabel(), 'Delete');
      });
    });
  },
};
