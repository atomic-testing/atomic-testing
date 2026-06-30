import { TextDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { textUIExample } from './Text.examples';

export const textExampleScenePart = {
  body: {
    locator: byDataTestId('text-body'),
    driver: TextDriver,
  },
  supporting: {
    locator: byDataTestId('text-supporting'),
    driver: TextDriver,
  },
} satisfies ScenePart;

export const textExample: IExampleUnit<typeof textExampleScenePart, JSX.Element> = {
  ...textUIExample,
  scene: textExampleScenePart,
};

export const textExampleTestSuite: TestSuiteInfo<typeof textExample.scene> = {
  title: 'Astryx Text',
  url: '/text',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${textExample.title}`, () => {
      const engine = useTestEngine(textExample.scene, getTestEngine, { beforeEach, afterEach });

      // getText reads content; getType the data-type; getColor the RESOLVED data-color.
      test(`reads text, type, and resolved color`, async () => {
        assertEqual(await engine().parts.body.getText(), 'Body text');
        assertEqual(await engine().parts.body.getType(), 'body');
        assertEqual(await engine().parts.body.getColor(), 'primary');
      });

      // 'supporting' resolves to data-color="secondary" without an explicit color prop.
      test(`resolves supporting color to secondary`, async () => {
        assertEqual(await engine().parts.supporting.getType(), 'supporting');
        assertEqual(await engine().parts.supporting.getColor(), 'secondary');
      });
    });
  },
};
