import { JSX } from 'react';
import { ButtonDriver } from '@atomic-testing/component-driver-mui-v6';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { complexButtonUIExample } from './ComplexButton.example';

export const complexButtonExampleScenePart = {
  contained: {
    locator: byDataTestId('contained'),
    driver: ButtonDriver,
  },
  outlined: {
    locator: byDataTestId('outlined'),
    driver: ButtonDriver,
  },
  text: {
    locator: byDataTestId('text'),
    driver: ButtonDriver,
  },
} satisfies ScenePart;

export const complexButtonExample: IExampleUnit<typeof complexButtonExampleScenePart, JSX.Element> = {
  ...complexButtonUIExample,
  scene: complexButtonExampleScenePart,
};

export const complexButtonTestSuite: TestSuiteInfo<typeof complexButtonExample.scene> = {
  title: 'Complex Button',
  url: '/button',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue }) => {
    describe(`${complexButtonExample.title}`, () => {
      const engine = useTestEngine(complexButtonExample.scene, getTestEngine, { beforeEach, afterEach });

      test('Contained button should exist and be clickable', async () => {
        const exists = await engine().parts.contained.exists();
        assertTrue(exists);
        await engine().parts.contained.click();
      });

      test('Outlined button should exist and be clickable', async () => {
        const exists = await engine().parts.outlined.exists();
        assertTrue(exists);
        await engine().parts.outlined.click();
      });

      test('Text button should exist and be clickable', async () => {
        const exists = await engine().parts.text.exists();
        assertTrue(exists);
        await engine().parts.text.click();
      });
    });
  },
};
