import { SkeletonDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skeletonUIExample } from './Skeleton.examples';

export const skeletonExampleScenePart = {
  plain: { locator: byDataTestId('skeleton-plain'), driver: SkeletonDriver },
} satisfies ScenePart;

export const skeletonExample: IExampleUnit<typeof skeletonExampleScenePart, JSX.Element> = {
  ...skeletonUIExample,
  scene: skeletonExampleScenePart,
};

export const skeletonExampleTestSuite: TestSuiteInfo<typeof skeletonExample.scene> = {
  title: 'Fluent Skeleton',
  url: '/skeleton',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${skeletonExample.title}`, () => {
      const engine = useTestEngine(skeletonExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('counts its placeholder items', async () => {
        assertEqual(await engine().parts.plain.getItemCount(), 3);
      });
    });
  },
};
