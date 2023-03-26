import { HTMLSelectDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart, TestEngine } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';
import React from 'react';

export const SingleSelectExample = () => {
  return (
    <React.Fragment>
      <form>
        <select name="single-select">
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

export const singleSelectExampleScenePart = {
  select: {
    locator: byName('single-select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export const singleSelectExample: IExampleUnit<typeof singleSelectExampleScenePart, JSX.Element> = {
  title: 'Single Select',
  scene: singleSelectExampleScenePart,
  ui: <SingleSelectExample />,
};

export const singleSelectTestSuite: TestSuiteInfo<typeof singleSelectExample.scene> = {
  title: 'Single Select',
  url: '/select',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${singleSelectExample.title}`, () => {
      let testEngine: TestEngine<typeof singleSelectExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(singleSelectExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test('Single Select', async () => {
        const targetValue = '3';
        await testEngine.parts.select.setValue(targetValue);
        const val = await testEngine.parts.select.getValue();
        assertEqual(val, targetValue);
      });
    });
  },
};
