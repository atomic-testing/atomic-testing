import { AccordionDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { accordionUIExample } from './Accordion.examples';

export const accordionExampleScenePart = {
  accordionA: { locator: byDataTestId('accordion-a'), driver: AccordionDriver },
  accordionB: { locator: byDataTestId('accordion-b'), driver: AccordionDriver },
} satisfies ScenePart;

export const accordionExample: IExampleUnit<typeof accordionExampleScenePart, JSX.Element> = {
  ...accordionUIExample,
  scene: accordionExampleScenePart,
};

export const accordionExampleTestSuite: TestSuiteInfo<typeof accordionExample.scene> = {
  title: 'Fluent Accordion',
  url: '/accordion',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${accordionExample.title}`, () => {
      const engine = useTestEngine(accordionExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads item summaries and count per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.accordionA.getItemSummaries(), [
          'Section One',
          'Section Two',
          'Section Three',
        ]);
        assertEqual(await engine().parts.accordionA.getItemCount(), 3);

        assertEqual(await engine().parts.accordionB.getItemSummaries(), ['Alpha', 'Beta']);
        assertEqual(await engine().parts.accordionB.getItemCount(), 2);
      });

      test('reads the default-open item and default-collapsed items', async () => {
        assertEqual(await engine().parts.accordionA.getExpandedIndexes(), [0]);
        assertEqual(await engine().parts.accordionB.getExpandedIndexes(), []);
      });

      test('expandByIndex/collapseByIndex drive a single item, leaving the other accordion untouched', async () => {
        assertTrue(await engine().parts.accordionB.expandByIndex(1));
        assertEqual(await engine().parts.accordionB.getExpandedIndexes(), [1]);
        assertEqual(await engine().parts.accordionA.getExpandedIndexes(), [0]);

        assertTrue(await engine().parts.accordionB.collapseByIndex(1));
        assertEqual(await engine().parts.accordionB.getExpandedIndexes(), []);

        assertFalse(await engine().parts.accordionB.expandByIndex(99));
      });

      test('multiple mode allows more than one item open at once', async () => {
        assertTrue(await engine().parts.accordionA.expandByIndex(1));
        assertEqual(await engine().parts.accordionA.getExpandedIndexes(), [0, 1]);
      });

      test('a disabled item reports isDisabled and cannot be expanded by clicking', async () => {
        const disabledItem = await engine().parts.accordionA.getItemByIndex(2);
        assertTrue(await disabledItem!.isDisabled());
        assertFalse(await disabledItem!.isExpanded());

        await disabledItem!.click();
        assertFalse(await disabledItem!.isExpanded());
      });

      test('getPanelText reads the expanded panel; returns null while collapsed', async () => {
        const openItem = await engine().parts.accordionA.getItemByIndex(0);
        assertEqual(await openItem!.getPanelText(), 'Section one content');

        const closedItem = await engine().parts.accordionA.getItemByIndex(1);
        assertEqual(await closedItem!.getPanelText(), null);
      });

      test('AccordionItemDriver.expand()/collapse() toggle a single item directly', async () => {
        const item = await engine().parts.accordionB.getItemByIndex(0);
        assertFalse(await item!.isExpanded());

        await item!.expand();
        assertTrue(await item!.isExpanded());
        assertEqual(await item!.getPanelText(), 'Alpha content');

        await item!.collapse();
        assertFalse(await item!.isExpanded());
      });
    });
  },
};
