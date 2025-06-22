import { JSX } from 'react';

import { SelectDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
  tests: (getTestEngine, { test, beforeEach, afterEach, assertEqual }) => {
    let testEngine: TestEngine<typeof basicSelectExample.scene>;

    // Use the following beforeEach to work around the issue of Playwright's page being undefined
    // @ts-ignore
    beforeEach(function ({ page }) {
      // @ts-ignore
      testEngine = getTestEngine(basicSelectExample.scene, { page });
      if (typeof arguments[0] === 'function') {
        arguments[0]();
      }
    });

    afterEach(async () => {
      await testEngine.cleanUp();
    });

    test('it should have default select element', async () => {
      assertEqual(await testEngine.parts.select.exists(), true);
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
