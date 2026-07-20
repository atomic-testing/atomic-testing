import { InfoButtonDriver, InfoLabelDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { infoLabelUIExample } from './InfoLabel.examples';

export const infoLabelExampleScenePart = {
  label: { locator: byDataTestId('info-label'), driver: InfoLabelDriver },
  button: { locator: byDataTestId('info-button'), driver: InfoButtonDriver },
} satisfies ScenePart;

export const infoLabelExample: IExampleUnit<typeof infoLabelExampleScenePart, JSX.Element> = {
  ...infoLabelUIExample,
  scene: infoLabelExampleScenePart,
};

export const infoLabelExampleTestSuite: TestSuiteInfo<typeof infoLabelExample.scene> = {
  title: 'Fluent InfoLabel',
  url: '/infolabel',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${infoLabelExample.title}`, () => {
      const engine = useTestEngine(infoLabelExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own label text, excluding the info button', async () => {
        assertEqual(await engine().parts.label.getText(), 'Field label');
      });

      test('opens its nested info button to reveal the info text, closed by default', async () => {
        const infoButton = engine().parts.label.getInfoButton();
        assertFalse(await infoButton.isOpen());
        assertEqual(await infoButton.getInfoText(), undefined);
        await infoButton.open();
        assertTrue(await infoButton.isOpen());
        assertEqual(await infoButton.getInfoText(), 'Extra detail text');
        await infoButton.close();
        assertFalse(await infoButton.isOpen());
      });

      test('a standalone InfoButton opens and closes independently', async () => {
        assertFalse(await engine().parts.button.isOpen());
        await engine().parts.button.open();
        assertTrue(await engine().parts.button.isOpen());
        assertEqual(await engine().parts.button.getInfoText(), 'Button detail text');
      });
    });
  },
};
