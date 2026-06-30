import { TextAreaDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textAreaUIExample } from './TextArea.examples';

export const textAreaExampleScenePart = {
  descArea: {
    locator: byDataTestId('desc-area'),
    driver: TextAreaDriver,
  },
} satisfies ScenePart;

export const textAreaExample: IExampleUnit<typeof textAreaExampleScenePart, JSX.Element> = {
  ...textAreaUIExample,
  scene: textAreaExampleScenePart,
};

export const textAreaExampleTestSuite: TestSuiteInfo<typeof textAreaExample.scene> = {
  title: 'Astryx TextArea',
  url: '/text-area',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${textAreaExample.title}`, () => {
      const engine = useTestEngine(textAreaExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel resolves the linked <label for>.
      test(`getLabel returns the field label`, async () => {
        assertEqual(await engine().parts.descArea.getLabel(), 'Description');
      });

      // getValue reads the textarea; getCharCount derives from the value length.
      test(`getValue and getCharCount reflect the content`, async () => {
        assertEqual(await engine().parts.descArea.getValue(), 'Hello');
        assertEqual(await engine().parts.descArea.getCharCount(), 5);
      });

      // setValue round-trips through the controlled onChange.
      test(`setValue round-trips`, async () => {
        await engine().parts.descArea.setValue('A longer note');
        assertEqual(await engine().parts.descArea.getValue(), 'A longer note');
        assertEqual(await engine().parts.descArea.getCharCount(), 'A longer note'.length);
      });

      // getRows reads the rows attribute.
      test(`getRows returns the visible row count`, async () => {
        assertEqual(await engine().parts.descArea.getRows(), 4);
      });
    });
  },
};
