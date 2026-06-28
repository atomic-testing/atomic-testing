import { RadioGroupDriver } from '@atomic-testing/component-driver-mui-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicRadioGroupUIExample } from './BasicRadioGroup.example';

export const basicRadioGroupExampleScenePart = {
  fruit: {
    locator: byDataTestId('fruit-group'),
    driver: RadioGroupDriver,
  },
  size: {
    locator: byDataTestId('size-group'),
    driver: RadioGroupDriver,
  },
} satisfies ScenePart;

export const basicRadioGroupExample: IExampleUnit<typeof basicRadioGroupExampleScenePart, JSX.Element> = {
  ...basicRadioGroupUIExample,
  scene: basicRadioGroupExampleScenePart,
};

export const basicRadioGroupTestSuite: TestSuiteInfo<typeof basicRadioGroupExampleScenePart> = {
  title: 'Basic RadioGroup',
  url: '/radio',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(basicRadioGroupExample.scene, getTestEngine, { beforeEach, afterEach });

    test('reports the selected value per instance', async () => {
      assertEqual(await engine().parts.fruit.getValue(), 'banana');
      assertEqual(await engine().parts.size.getValue(), 'medium');
    });

    test('reports the options per instance', async () => {
      assertEqual(await engine().parts.fruit.getOptions(), ['Apple', 'Banana', 'Cherry']);
      assertEqual(await engine().parts.size.getOptions(), ['Small', 'Medium']);
    });

    test('reports the option count per instance', async () => {
      assertEqual(await engine().parts.fruit.getItemCount(), 3);
      assertEqual(await engine().parts.size.getItemCount(), 2);
    });

    test('reports the selected label', async () => {
      assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Banana');
    });

    test('selects an option by value', async () => {
      assertTrue(await engine().parts.fruit.setValue('apple'));
      assertEqual(await engine().parts.fruit.getValue(), 'apple');
    });

    test('returns false when setting an unknown value', async () => {
      assertFalse(await engine().parts.fruit.setValue('durian'));
    });

    test('selects an option by label', async () => {
      assertTrue(await engine().parts.fruit.selectByLabel('Apple'));
      assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Apple');
    });

    test('returns false when selecting an unknown label', async () => {
      assertFalse(await engine().parts.fruit.selectByLabel('Durian'));
    });

    test('reports disabled options', async () => {
      assertTrue(await engine().parts.fruit.isOptionDisabled('Cherry'));
      assertFalse(await engine().parts.fruit.isOptionDisabled('Apple'));
    });
  },
};
