import { InputGroupDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { inputGroupUIExample } from './InputGroup.examples';

export const inputGroupExampleScenePart = {
  priceGroup: {
    locator: byDataTestId('price-group'),
    driver: InputGroupDriver,
  },
} satisfies ScenePart;

export const inputGroupExample: IExampleUnit<typeof inputGroupExampleScenePart, JSX.Element> = {
  ...inputGroupUIExample,
  scene: inputGroupExampleScenePart,
};

export const inputGroupExampleTestSuite: TestSuiteInfo<typeof inputGroupExample.scene> = {
  title: 'Astryx InputGroup',
  url: '/input-group',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${inputGroupExample.title}`, () => {
      const engine = useTestEngine(inputGroupExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the group's accessible name.
      test(`getLabel returns the group accessible name`, async () => {
        assertEqual(await engine().parts.priceGroup.getLabel(), 'Price');
      });

      // getAddonTexts reads the prefix AND suffix addon text, in DOM order.
      test(`getAddonTexts returns the addon texts`, async () => {
        assertEqual(await engine().parts.priceGroup.getAddonTexts(), ['$', 'USD']);
      });
    });
  },
};
