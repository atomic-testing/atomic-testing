import { JSX } from 'react';

import { SelectDriver } from '@atomic-testing/component-driver-mui-v7';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
    let testEngine: TestEngine<typeof basicSelectExample.scene>;
    beforeEach(function ({ page }: TestFixture) {
      testEngine = getTestEngine(basicSelectExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        (arguments[0] as () => void)();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have default select element', async () => {
      assertTrue(await testEngine.parts.select.exists());
    });

    test('it should be able to select an option', async () => {
      await testEngine.parts.select.setValue('30');
      const value = await testEngine.parts.select.getValue();
      assertEqual(value, '30');
    });

    test('it should be able to select by label', async () => {
      await testEngine.parts.select.selectByLabel('Thirty');
      const value = await testEngine.parts.select.getValue();
      assertEqual(value, '30');
    });
  },
};
