import { AccordionDriver } from '@atomic-testing/component-driver-mui-v6';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestFixture, TestSuiteInfo } from '@atomic-testing/internal-test-runner';

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
      let testEngine: TestEngine<typeof basicAccordionExample.scene>;

      beforeEach(function ({ page }: TestFixture) {
        testEngine = getTestEngine(basicAccordionExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          (arguments[0] as () => void)();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test(`Normal accordion should be expanded and show content when clicked`, async () => {
        await testEngine.parts.normalAccordion.expand();
        const expanded = await testEngine.parts.normalAccordion.isExpanded();
        assertTrue(expanded);
      });

      test(`Disabled accordion is not interactive`, async () => {
        const disabled = await testEngine.parts.disabledAccordion.isDisabled();
        assertTrue(disabled);
      });
    });
  },
};
