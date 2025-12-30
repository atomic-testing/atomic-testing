import { JSX } from 'react';

import { SelectDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { nativeSelectUIExample } from './NativeSelect.examples';

export const nativeSelectExampleScenePart = {
  select: {
    locator: byDataTestId('native-select'),
    driver: SelectDriver,
  },
} satisfies ScenePart;

/**
 * Native select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#native-select
 */
export const nativeSelectExample: IExampleUnit<typeof nativeSelectExampleScenePart, JSX.Element> = {
  ...nativeSelectUIExample,
  scene: nativeSelectExampleScenePart,
};

export const nativeSelectTestSuite: TestSuiteInfo<typeof nativeSelectExampleScenePart> = {
  title: 'Native Select',
  url: '/select',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual, assertTrue }) => {
    const engine = useTestEngine(nativeSelectExample.scene, getTestEngine, { beforeEach, afterEach });

    test('it should have default native select element', async () => {
      assertTrue(await engine().parts.select.exists());
    });

    test('it should have default value of 30', async () => {
      const value = await engine().parts.select.getValue();
      assertEqual(value, '30');
    });

    test('it should be able to select an option', async () => {
      await engine().parts.select.setValue('20');
      const value = await engine().parts.select.getValue();
      assertEqual(value, '20');
    });
  },
};
