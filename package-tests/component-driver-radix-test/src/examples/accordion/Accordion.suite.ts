import { AccordionDriver } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { accordionUIExample } from './Accordion.examples';

export const accordionExampleScenePart = {
  itemA: {
    locator: byDataTestId('accordion-item-a'),
    driver: AccordionDriver,
  },
  itemB: {
    locator: byDataTestId('accordion-item-b'),
    driver: AccordionDriver,
  },
  itemC: {
    locator: byDataTestId('accordion-item-c'),
    driver: AccordionDriver,
  },
} satisfies ScenePart;

export const accordionExample: IExampleUnit<typeof accordionExampleScenePart, JSX.Element> = {
  ...accordionUIExample,
  scene: accordionExampleScenePart,
};

export const accordionExampleTestSuite: TestSuiteInfo<typeof accordionExample.scene> = {
  title: 'Radix Accordion',
  url: '/accordion',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${accordionExample.title}`, () => {
      const engine = useTestEngine(accordionExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the default expanded state per item', async () => {
        assertTrue(await engine().parts.itemA.isExpanded());
        assertFalse(await engine().parts.itemB.isExpanded());
      });

      test('reads the summary text per item', async () => {
        assertEqual(await engine().parts.itemA.getSummary(), 'Section A');
        assertEqual(await engine().parts.itemB.getSummary(), 'Section B');
      });

      test('reads content text only once expanded (single-select exclusivity)', async () => {
        assertEqual(await engine().parts.itemA.getContentText(), 'Content A');

        await engine().parts.itemB.expand();
        assertTrue(await engine().parts.itemB.isExpanded());
        assertEqual(await engine().parts.itemB.getContentText(), 'Content B');
        // type="single" without forcing exclusivity off collapses the previously open item
        assertFalse(await engine().parts.itemA.isExpanded());
      });

      test('collapse() closes an expanded item (collapsible=true)', async () => {
        await engine().parts.itemA.collapse();
        assertFalse(await engine().parts.itemA.isExpanded());
      });

      test('reads the disabled item', async () => {
        assertFalse(await engine().parts.itemA.isDisabled());
        assertTrue(await engine().parts.itemC.isDisabled());
      });
    });
  },
};
