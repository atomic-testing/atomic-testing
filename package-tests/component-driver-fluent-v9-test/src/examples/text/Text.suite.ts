import { TextDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textUIExample } from './Text.examples';

export const textExampleScenePart = {
  one: { locator: byDataTestId('text-one'), driver: TextDriver },
  two: { locator: byDataTestId('text-two'), driver: TextDriver },
} satisfies ScenePart;

export const textExample: IExampleUnit<typeof textExampleScenePart, JSX.Element> = {
  ...textUIExample,
  scene: textExampleScenePart,
};

export const textExampleTestSuite: TestSuiteInfo<typeof textExample.scene> = {
  title: 'Fluent Text',
  url: '/text',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${textExample.title}`, () => {
      const engine = useTestEngine(textExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own text per instance', async () => {
        assertEqual(await engine().parts.one.getText(), 'One');
        assertEqual(await engine().parts.two.getText(), 'Two');
      });
    });
  },
};
