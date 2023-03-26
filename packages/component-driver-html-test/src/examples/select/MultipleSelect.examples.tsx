import { HTMLSelectDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import React from 'react';

export const MultipleSelectExample = () => {
  return (
    <React.Fragment>
      <form>
        <select name="multiple-select" multiple size={5}>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="4">Four</option>
          <option value="5">Five</option>
        </select>
      </form>
    </React.Fragment>
  );
};

export const multipleSelectExampleScenePart = {
  select: {
    locator: byName('multiple-select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export const multipleSelectExample: IExampleUnit<typeof multipleSelectExampleScenePart, JSX.Element> = {
  title: 'Multiple Select',
  scene: multipleSelectExampleScenePart,
  ui: <MultipleSelectExample />,
};

export const multipleSelectTestSuite: TestSuiteInfo<typeof multipleSelectExample.scene> = {
  title: 'Single Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${multipleSelectExample.title}`, () => {
      let testEngine: TestEngine<typeof multipleSelectExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(multipleSelectExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Multiple Select', async () => {
        const targetValue = ['3', '5'];
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
