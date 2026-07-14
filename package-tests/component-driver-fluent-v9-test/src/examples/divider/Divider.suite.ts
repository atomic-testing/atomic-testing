import { DividerDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dividerUIExample } from './Divider.examples';

export const dividerExampleScenePart = {
  horizontal: { locator: byDataTestId('divider-horizontal'), driver: DividerDriver },
  vertical: { locator: byDataTestId('divider-vertical'), driver: DividerDriver },
} satisfies ScenePart;

export const dividerExample: IExampleUnit<typeof dividerExampleScenePart, JSX.Element> = {
  ...dividerUIExample,
  scene: dividerExampleScenePart,
};

export const dividerExampleTestSuite: TestSuiteInfo<typeof dividerExample.scene> = {
  title: 'Fluent Divider',
  url: '/divider',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${dividerExample.title}`, () => {
      const engine = useTestEngine(dividerExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own text and orientation per instance', async () => {
        assertEqual(await engine().parts.horizontal.getText(), 'OR');
        assertEqual(await engine().parts.horizontal.getOrientation(), 'horizontal');
        assertEqual(await engine().parts.vertical.getOrientation(), 'vertical');
      });
    });
  },
};
