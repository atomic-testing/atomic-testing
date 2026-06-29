import { CodeDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { codeUIExample } from './Code.examples';

export const codeExampleScenePart = {
  first: {
    locator: byDataTestId('code-1'),
    driver: CodeDriver,
  },
  second: {
    locator: byDataTestId('code-2'),
    driver: CodeDriver,
  },
} satisfies ScenePart;

export const codeExample: IExampleUnit<typeof codeExampleScenePart, JSX.Element> = {
  ...codeUIExample,
  scene: codeExampleScenePart,
};

export const codeExampleTestSuite: TestSuiteInfo<typeof codeExample.scene> = {
  title: 'Astryx Code',
  url: '/code',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${codeExample.title}`, () => {
      const engine = useTestEngine(codeExample.scene, getTestEngine, { beforeEach, afterEach });

      // getText reads the inline code content.
      test(`reads code text`, async () => {
        assertEqual(await engine().parts.first.getText(), 'const x = 1');
      });

      // Two instances are disambiguated by their distinct testids.
      test(`disambiguates two instances`, async () => {
        assertEqual(await engine().parts.second.getText(), 'npm install');
      });
    });
  },
};
