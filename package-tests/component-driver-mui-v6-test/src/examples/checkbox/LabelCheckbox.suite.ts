import { CheckboxDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertFalse, assertEqual }) => {
    const engine = useTestEngine(labelCheckboxExample.scene, getTestEngine, { beforeEach, afterEach });

    test('Apple checkbox should be checked by default', async () => {
      const isSelected = await engine().parts.apple.isSelected();
      assertTrue(isSelected);
    });

    test('Apple checkbox exposes its label text', async () => {
      const label = await engine().parts.apple.getLabel();
      assertEqual(label, 'Apple');
    });

    test('Banana checkbox exposes its own label, not a sibling label', async () => {
      const label = await engine().parts.banana.getLabel();
      assertEqual(label, 'Banana');
    });

    test('Banana checkbox should not be checked by default', async () => {
      const isSelected = await engine().parts.banana.isSelected();
      assertFalse(isSelected);
    });

    test('Banana checkbox can be checked', async () => {
      await engine().parts.banana.setSelected(true);
      const isSelected = await engine().parts.banana.isSelected();
      assertTrue(isSelected);
    });
  },
};
