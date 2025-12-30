import { JSX } from 'react';

import { SelectDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicSelectUIExample } from './BasicSelect.examples';

export const basicSelectExampleScenePart = {
  select: {
    locator: byDataTestId('simple-select'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

/**
 * Basic select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#basic-select
 */
export const basicSelectExample: IExampleUnit<typeof basicSelectExampleScenePart, JSX.Element> = {
  ...basicSelectUIExample,
  scene: basicSelectExampleScenePart,
};

export const basicSelectTestSuite: TestSuiteInfo<typeof basicSelectExampleScenePart> = {
  title: 'Basic Select',
  url: '/select',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(basicSelectExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have default select element', async () => {
      assertTrue(await engine().parts.select.exists());
    });

    test('it should be able to select an option', async () => {
      await engine().parts.select.setValue('30');
      const value = await engine().parts.select.getValue();
      assertEqual(value, '30');
    });

    test('it should be able to select by label', async () => {
      await engine().parts.select.selectByLabel('Thirty');
      const value = await engine().parts.select.getValue();
      assertEqual(value, '30');
    });
  },
};
