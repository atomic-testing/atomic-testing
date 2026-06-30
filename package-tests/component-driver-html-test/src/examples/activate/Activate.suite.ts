import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { activateUIExample } from './Activate.examples';

export const activateExampleScenePart = {
  first: {
    locator: byDataTestId('activate-first'),
    driver: HTMLElementDriver,
  },
  second: {
    locator: byDataTestId('activate-second'),
    driver: HTMLElementDriver,
  },
  detail: {
    locator: byDataTestId('activate-detail'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const activateExample: IExampleUnit<typeof activateExampleScenePart, JSX.Element> = {
  ...activateUIExample,
  scene: activateExampleScenePart,
};

export const activateExampleTestSuite: TestSuiteInfo<typeof activateExample.scene> = {
  title: 'Activate: coordinate-free activation',
  url: '/activate',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${activateExample.title}`, () => {
      const engine = useTestEngine(activateExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Initially detail is empty`, async () => {
        assertEqual(await engine().parts.detail.getText(), '');
      });

      test(`Activating the first hidden radio selects it`, async () => {
        await engine().parts.first.activate();
        assertEqual(await engine().parts.detail.getText(), 'first');
      });

      test(`Activating targets the specific radio, not a sibling`, async () => {
        await engine().parts.second.activate();
        assertEqual(await engine().parts.detail.getText(), 'second');
      });
    });
  },
};
