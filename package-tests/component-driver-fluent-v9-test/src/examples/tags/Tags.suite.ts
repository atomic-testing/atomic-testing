import { InteractionTagDriver, TagDriver, TagGroupDriver } from '@atomic-testing/component-driver-fluent-v9';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tagsUIExample } from './Tags.examples';

export const tagsExampleScenePart = {
  labeled: { locator: byDataTestId('tag-labeled'), driver: TagDriver },
  empty: { locator: byDataTestId('tag-empty'), driver: TagDriver },
  interaction: { locator: byDataTestId('interaction-tag'), driver: InteractionTagDriver },
  interactionDisabled: { locator: byDataTestId('interaction-tag-disabled'), driver: InteractionTagDriver },
  groupA: { locator: byDataTestId('group-a'), driver: TagGroupDriver },
  groupB: { locator: byDataTestId('group-b'), driver: TagGroupDriver },
  groupEmpty: { locator: byDataTestId('group-empty'), driver: TagGroupDriver },
} satisfies ScenePart;

export const tagsExample: IExampleUnit<typeof tagsExampleScenePart, JSX.Element> = {
  ...tagsUIExample,
  scene: tagsExampleScenePart,
};

export const tagsExampleTestSuite: TestSuiteInfo<typeof tagsExample.scene> = {
  title: 'Fluent Tags',
  url: '/tags',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tagsExample.title}`, () => {
      const engine = useTestEngine(tagsExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('reads a plain Tag label', async () => {
        assertEqual(await engine().parts.labeled.getLabel(), 'Labeled Tag');
      });

      test('has no label when the Tag has no content', async () => {
        assertEqual(await engine().parts.empty.getLabel(), undefined);
      });

      test('reads an InteractionTag label and disabled state', async () => {
        assertEqual(await engine().parts.interaction.getLabel(), 'Interactive Tag');
        assertFalse(await engine().parts.interaction.isDisabled());

        assertEqual(await engine().parts.interactionDisabled.getLabel(), 'Disabled Interactive Tag');
        assertTrue(await engine().parts.interactionDisabled.isDisabled());
      });

      test('counts and labels a mixed group of Tags and InteractionTags per instance (disambiguation)', async () => {
        assertEqual(await engine().parts.groupA.getTagCount(), 4);
        assertEqual(await engine().parts.groupA.getTagLabels(), ['Alpha', 'Beta', 'Gamma', 'Delta']);

        assertEqual(await engine().parts.groupB.getTagCount(), 2);
        assertEqual(await engine().parts.groupB.getTagLabels(), ['One', 'Two']);
      });

      test('has zero tags for an empty group', async () => {
        assertEqual(await engine().parts.groupEmpty.getTagCount(), 0);
        assertEqual(await engine().parts.groupEmpty.getTagLabels(), []);
        assertEqual(await engine().parts.groupEmpty.getTagByIndex(0), null);
      });

      test('getTagByIndex resolves the concrete driver matching each position', async () => {
        const first = await engine().parts.groupA.getTagByIndex(0);
        assertTrue(first instanceof TagDriver);
        assertEqual(await first?.getLabel(), 'Alpha');

        const third = await engine().parts.groupA.getTagByIndex(2);
        assertTrue(third instanceof InteractionTagDriver);
        assertEqual(await third?.getLabel(), 'Gamma');

        assertEqual(await engine().parts.groupA.getTagByIndex(99), null);
      });

      test('dismiss() removes only the targeted InteractionTag from its own group', async () => {
        const gamma = await engine().parts.groupA.getTagByIndex(2);
        assertTrue(gamma instanceof InteractionTagDriver);
        await (gamma as InteractionTagDriver).dismiss();

        assertEqual(await engine().parts.groupA.getTagCount(), 3);
        assertEqual(await engine().parts.groupA.getTagLabels(), ['Alpha', 'Beta', 'Delta']);

        // Group B is untouched by Group A's dismissal — proves the enumeration
        // is scoped per instance, not shared/global state.
        assertEqual(await engine().parts.groupB.getTagCount(), 2);
        assertEqual(await engine().parts.groupB.getTagLabels(), ['One', 'Two']);
      });
    });
  },
};
