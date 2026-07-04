import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { ToastDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toastUIExample } from './Toast.examples';

// Toast.Title/Description render as anchor-less plain <div>s (see
// ToastDriver's class doc) — consumer content parts by design.
const toastContentPart = {
  title: {
    locator: byDataTestId('toast-title'),
    driver: HTMLElementDriver,
  },
  description: {
    locator: byDataTestId('toast-description'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const toastExampleScenePart = {
  trigger: {
    locator: byDataTestId('toast-trigger'),
    driver: HTMLButtonDriver,
  },
  toast: {
    locator: byDataTestId('toast-root'),
    driver: ToastDriver<typeof toastContentPart>,
    option: {
      content: toastContentPart,
    },
  },
} satisfies ScenePart;

export const toastExample: IExampleUnit<typeof toastExampleScenePart, JSX.Element> = {
  ...toastUIExample,
  scene: toastExampleScenePart,
};

export const toastExampleTestSuite: TestSuiteInfo<typeof toastExample.scene> = {
  title: 'Radix Toast',
  url: '/toast',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${toastExample.title}`, () => {
      const engine = useTestEngine(toastExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is not open initially', async () => {
        assertFalse(await engine().parts.toast.isOpen());
      });

      test('appears when triggered', async () => {
        await engine().parts.trigger.click();
        await engine().parts.toast.waitForOpen();
        assertTrue(await engine().parts.toast.isOpen());
        assertEqual(await engine().parts.toast.getState(), 'open');
      });

      test('reads title and description content parts', async () => {
        await engine().parts.trigger.click();
        await engine().parts.toast.waitForOpen();
        assertEqual(await engine().parts.toast.content.title.getText(), 'Changes saved');
        assertEqual(await engine().parts.toast.content.description.getText(), 'Your changes have been saved.');
      });

      test('close() dismisses the toast', async () => {
        await engine().parts.trigger.click();
        await engine().parts.toast.waitForOpen();
        await engine().parts.toast.close();
        await engine().parts.toast.waitForClose();
        assertFalse(await engine().parts.toast.isOpen());
      });

      test('clickAction() dismisses the toast', async () => {
        await engine().parts.trigger.click();
        await engine().parts.toast.waitForOpen();
        await engine().parts.toast.clickAction();
        await engine().parts.toast.waitForClose();
        assertFalse(await engine().parts.toast.isOpen());
      });
    });
  },
};
