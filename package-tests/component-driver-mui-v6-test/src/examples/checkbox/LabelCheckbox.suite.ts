import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v6';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

import { labelCheckboxUIExample } from './LabelCheckbox.examples';

export const labelCheckboxExampleScenePart = {
  apple: {
    locator: byDataTestId('apple'),
    driver: CheckboxDriver,
  },
  banana: {
    locator: byDataTestId('banana'),
    driver: CheckboxDriver,
  },
} satisfies ScenePart;

export const labelCheckboxExample: IExampleUnit<typeof labelCheckboxExampleScenePart, JSX.Element> = {
  ...labelCheckboxUIExample,
  scene: labelCheckboxExampleScenePart,
};

export const labelCheckboxTestSuite: TestSuiteInfo<typeof labelCheckboxExample.scene> = {
  title: 'Label Checkbox',
  url: '/checkbox',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse }) => {
    let testEngine: TestEngine<typeof labelCheckboxExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(labelCheckboxExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('Apple checkbox should be checked by default', async () => {
      const isSelected = await testEngine.parts.apple.isSelected();
      assertTrue(isSelected);
    });

    test('Banana checkbox should not be checked by default', async () => {
      const isSelected = await testEngine.parts.banana.isSelected();
      assertFalse(isSelected);
    });

    test('Banana checkbox can be checked', async () => {
      await testEngine.parts.banana.setSelected(true);
      const isSelected = await testEngine.parts.banana.isSelected();
      assertTrue(isSelected);
    });
  },
};
