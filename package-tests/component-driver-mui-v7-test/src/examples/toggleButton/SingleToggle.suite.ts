import { ToggleButtonDriver } from '@atomic-testing/component-driver-mui-v7';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { singleToggleUIExample } from './SingleToggle.example';

export const singleToggleExampleScenePart = {
  singleToggle: {
    locator: byDataTestId('single-toggle'),
    driver: ToggleButtonDriver,
  },
} satisfies ScenePart;

export const singleToggleExample: IExampleUnit<typeof singleToggleExampleScenePart, JSX.Element> = {
  ...singleToggleUIExample,
  scene: singleToggleExampleScenePart,
};

export const singleToggleButtonTestSuite: TestSuiteInfo<typeof singleToggleExampleScenePart> = {
  title: 'Single Toggle Button',
  url: '/toggle-button',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof singleToggleExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(singleToggleExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Initially selected state should be false', async () => {
      const selected = await testEngine.parts.singleToggle.isSelected();
      assertEqual(selected, false);
    });

    test('Click on the button would set selected state to true', async () => {
      await testEngine.parts.singleToggle.click();
      const selected = await testEngine.parts.singleToggle.isSelected();
      assertEqual(selected, true);
    });

    test('Set the selected state would yield the correct selected state', async () => {
      await testEngine.parts.singleToggle.setSelected(true);
      const selected = await testEngine.parts.singleToggle.isSelected();
      assertEqual(selected, true);
    });
  },
};
