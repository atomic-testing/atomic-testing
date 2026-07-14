import { ImageDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { imageUIExample } from './Image.examples';

export const imageExampleScenePart = {
  one: { locator: byDataTestId('image-one'), driver: ImageDriver },
  two: { locator: byDataTestId('image-two'), driver: ImageDriver },
  decorative: { locator: byDataTestId('image-decorative'), driver: ImageDriver },
} satisfies ScenePart;

export const imageExample: IExampleUnit<typeof imageExampleScenePart, JSX.Element> = {
  ...imageUIExample,
  scene: imageExampleScenePart,
};

export const imageExampleTestSuite: TestSuiteInfo<typeof imageExample.scene> = {
  title: 'Fluent Image',
  url: '/image',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${imageExample.title}`, () => {
      const engine = useTestEngine(imageExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads its own src/alt per instance', async () => {
        assertEqual(await engine().parts.one.getSrc(), '/one.png');
        assertEqual(await engine().parts.one.getAlt(), 'One');
        assertEqual(await engine().parts.two.getSrc(), '/two.png');
        assertEqual(await engine().parts.two.getAlt(), 'Two');
      });

      test('has no alt text when decorative (absent case)', async () => {
        assertEqual(await engine().parts.decorative.getSrc(), '/decorative.png');
        assertEqual(await engine().parts.decorative.getAlt(), undefined);
      });
    });
  },
};
