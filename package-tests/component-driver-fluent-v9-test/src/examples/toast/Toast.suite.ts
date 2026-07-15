import { ButtonDriver, ToasterDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toastUIExample } from './Toast.examples';

export const toastExampleScenePart = {
  dispatchFirst: { locator: byDataTestId('dispatch-first-toast'), driver: ButtonDriver },
  dispatchSecond: { locator: byDataTestId('dispatch-second-toast'), driver: ButtonDriver },
  toaster: { locator: byDataTestId('toaster'), driver: ToasterDriver },
} satisfies ScenePart;

export const toastExample: IExampleUnit<typeof toastExampleScenePart, JSX.Element> = {
  ...toastUIExample,
  scene: toastExampleScenePart,
};

export const toastExampleTestSuite: TestSuiteInfo<typeof toastExample.scene> = {
  title: 'Fluent Toast',
  url: '/toast',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe('Fluent Toast', () => {
      const engine = useTestEngine(toastExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('toaster has no toasts initially', async () => {
        assertEqual(await engine().parts.toaster.getToastCount(), 0);
      });

      test('dispatching a toast adds it to the toaster', async () => {
        await engine().parts.dispatchFirst.click();
        assertEqual(await engine().parts.toaster.getToastCount(), 1);
        const toast = await engine().parts.toaster.getToastByIndex(0);
        assertEqual(await toast?.getTitle(), 'First toast');
        assertEqual(await toast?.getBodyText(), 'First toast body');
      });

      test('dispatching two toasts queues both, in order', async () => {
        await engine().parts.dispatchFirst.click();
        await engine().parts.dispatchSecond.click();
        assertEqual(await engine().parts.toaster.getToastCount(), 2);

        const first = await engine().parts.toaster.getToastByIndex(0);
        const second = await engine().parts.toaster.getToastByIndex(1);
        assertEqual(await first?.getTitle(), 'First toast');
        assertEqual(await second?.getTitle(), 'Second toast');
      });

      test('getToastByTitle finds a specific queued toast', async () => {
        await engine().parts.dispatchFirst.click();
        await engine().parts.dispatchSecond.click();

        const toast = await engine().parts.toaster.getToastByTitle('Second toast');
        assertEqual(await toast?.getBodyText(), 'Second toast body');
      });

      test('getToastByIndex is null out of range', async () => {
        const toast = await engine().parts.toaster.getToastByIndex(0);
        assertEqual(toast, null);
      });
    });
  },
};
