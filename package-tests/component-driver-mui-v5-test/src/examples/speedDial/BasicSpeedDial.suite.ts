import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { SpeedDialDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicSpeedDialUIExample } from './BasicSpeedDial.example';

export const basicSpeedDialExampleScenePart = {
  speedDial: {
    locator: byDataTestId('basic-speed-dial'),
    driver: SpeedDialDriver,
  },
  other: {
    locator: byDataTestId('other-speed-dial'),
    driver: SpeedDialDriver,
  },
  lastAction: {
    locator: byDataTestId('last-action'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const basicSpeedDialExample: IExampleUnit<typeof basicSpeedDialExampleScenePart, JSX.Element> = {
  ...basicSpeedDialUIExample,
  scene: basicSpeedDialExampleScenePart,
};

export const basicSpeedDialTestSuite: TestSuiteInfo<typeof basicSpeedDialExampleScenePart> = {
  title: 'Basic SpeedDial',
  url: '/speed-dial',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicSpeedDialExample.scene, getTestEngine, { beforeEach, afterEach });

    test('is closed initially', async () => {
      assertFalse(await engine().parts.speedDial.isOpen());
      assertFalse(await engine().parts.other.isOpen());
    });

    test('reports its action labels per instance', async () => {
      assertEqual(await engine().parts.speedDial.getActionLabels(), ['Copy', 'Save', 'Print', 'Share']);
      assertEqual(await engine().parts.other.getActionLabels(), ['Edit', 'Delete']);
    });

    test('opens and closes independently', async () => {
      await engine().parts.speedDial.open();
      assertTrue(await engine().parts.speedDial.isOpen());
      assertFalse(await engine().parts.other.isOpen());
      await engine().parts.speedDial.close();
      assertFalse(await engine().parts.speedDial.isOpen());
    });

    test('triggers an action by label', async () => {
      assertTrue(await engine().parts.speedDial.triggerActionByLabel('Save'));
      assertEqual(await engine().parts.lastAction.getText(), 'Save');
    });

    test('returns false for an unknown action label', async () => {
      assertFalse(await engine().parts.speedDial.triggerActionByLabel('Nonexistent'));
    });
  },
};
