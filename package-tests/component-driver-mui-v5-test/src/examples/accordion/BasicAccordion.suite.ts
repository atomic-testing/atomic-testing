import { JSX } from 'react';
import { AccordionDriver } from '@atomic-testing/component-driver-mui-v5';
import { byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { basicAccordionUIExample } from './BasicAccordion.examples';

export const basicAccordionExampleScenePart = {
  normalAccordion: {
    locator: byDataTestId('accordion-normal'),
    driver: AccordionDriver,
  },
  disabledAccordion: {
    locator: byDataTestId('accordion-disabled'),
    driver: AccordionDriver,
  },
} satisfies ScenePart;

export const basicAccordionExample: IExampleUnit<typeof basicAccordionExampleScenePart, JSX.Element> = {
  ...basicAccordionUIExample,
  scene: basicAccordionExampleScenePart,
};

export const basicAccordionTestSuite: TestSuiteInfo<typeof basicAccordionExample.scene> = {
  title: 'Basic Accordion',
  url: '/accordion',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertTrue }) => {
    describe(`${basicAccordionExample.title}`, () => {
      const engine = useTestEngine(basicAccordionExample.scene, getTestEngine, { beforeEach, afterEach });

      test(`Normal accordion should be expanded and show content when clicked`, async () => {
        await engine().parts.normalAccordion.expand();
        const expanded = await engine().parts.normalAccordion.isExpanded();
        assertTrue(expanded);
      });

      test(`Disabled accordion is not interactive`, async () => {
        const disabled = await engine().parts.disabledAccordion.isDisabled();
        assertTrue(disabled);
      });
    });
  },
};
