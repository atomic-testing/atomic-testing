import { ToastDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byCssSelector, byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { toastUIExample } from './Toast.examples';

export const toastExampleScenePart = {
  // Toast forwards no data-testid and its role is conditional; the stable anchor
  // is the `astryx-toast` semantic class + the `data-type` severity marker.
  infoToast: {
    locator: byCssSelector('.astryx-toast[data-type="info"]'),
    driver: ToastDriver,
  },
  errorToast: {
    locator: byCssSelector('.astryx-toast[data-type="error"]'),
    driver: ToastDriver,
  },
  infoPresent: {
    locator: byDataTestId('info-present'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const toastExample: IExampleUnit<typeof toastExampleScenePart, JSX.Element> = {
  ...toastUIExample,
  scene: toastExampleScenePart,
};

export const toastExampleTestSuite: TestSuiteInfo<typeof toastExample.scene> = {
  title: 'Astryx Toast',
  url: '/toast',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertFalse, assertTrue }) => {
    describe(`${toastExample.title}`, () => {
      const engine = useTestEngine(toastExample.scene, getTestEngine, { beforeEach, afterEach });

      // getType reads the role-independent data-type marker.
      test(`getType reads the toast type`, async () => {
        assertEqual(await engine().parts.infoToast.getType(), 'info');
        assertEqual(await engine().parts.errorToast.getType(), 'error');
      });

      // getRole reflects the severity-driven role flip.
      test(`getRole flips status/alert by severity`, async () => {
        assertEqual(await engine().parts.infoToast.getRole(), 'status');
        assertEqual(await engine().parts.errorToast.getRole(), 'alert');
      });

      // isError is true only for the error toast.
      test(`isError reflects the error toast`, async () => {
        assertTrue(await engine().parts.errorToast.isError());
        assertFalse(await engine().parts.infoToast.isError());
      });

      // getMessage returns the body text.
      test(`getMessage returns the body`, async () => {
        assertEqual(await engine().parts.infoToast.getMessage(), 'Changes saved');
        assertEqual(await engine().parts.errorToast.getMessage(), 'Save failed');
      });

      // dismiss fires onDismiss; the consumer removes the toast in response.
      test(`dismiss removes the toast`, async () => {
        await engine().parts.infoToast.dismiss();
        const present = await engine().parts.infoPresent.waitUntil({
          probeFn: () => engine().parts.infoPresent.getText(),
          terminateCondition: 'no',
          timeoutMs: 2000,
        });
        assertEqual(present, 'no');
      });
    });
  },
};
