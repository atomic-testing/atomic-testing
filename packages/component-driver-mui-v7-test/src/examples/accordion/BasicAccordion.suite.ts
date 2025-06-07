import { AccordionDriver } from '@atomic-testing/component-driver-mui-v7';
import { TestEngine, byDataTestId, ScenePart, IExampleUnit } from '@atomic-testing/core';
import { TestSuiteInfo } from '@atomic-testing/test-runner';

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
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${basicAccordionExample.title}`, () => {
      let testEngine: TestEngine<typeof basicAccordionExample.scene>;

      // Use the following beforeEach to work around the issue of Playwright's page being undefined
      // @ts-ignore
      beforeEach(function ({ page }) {
        // @ts-ignore
        testEngine = getTestEngine(basicAccordionExample.scene, { page });
        if (typeof arguments[0] === 'function') {
          arguments[0]();
        }
      });

      afterEach(async () => {
        await testEngine.cleanUp();
      });

      test.skip(`Normal accordion should be expanded and show content when clicked`, async () => {
        await testEngine.parts.normalAccordion.click();
        const expanded = await testEngine.parts.normalAccordion.isExpanded();
        assertEqual(expanded, true);
      });

      test(`Disabled accordion is not interactive`, async () => {
        const disabled = await testEngine.parts.disabledAccordion.isDisabled();
        assertEqual(disabled, true);
      });
    });
  },
};
