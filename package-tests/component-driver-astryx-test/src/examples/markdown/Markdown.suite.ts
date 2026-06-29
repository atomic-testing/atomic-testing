import { MarkdownDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { markdownUIExample } from './Markdown.examples';

export const markdownExampleScenePart = {
  block: {
    locator: byDataTestId('markdown-block'),
    driver: MarkdownDriver,
  },
  inline: {
    locator: byDataTestId('markdown-inline'),
    driver: MarkdownDriver,
  },
} satisfies ScenePart;

export const markdownExample: IExampleUnit<typeof markdownExampleScenePart, JSX.Element> = {
  ...markdownUIExample,
  scene: markdownExampleScenePart,
};

export const markdownExampleTestSuite: TestSuiteInfo<typeof markdownExample.scene> = {
  title: 'Astryx Markdown',
  url: '/markdown',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${markdownExample.title}`, () => {
      const engine = useTestEngine(markdownExample.scene, getTestEngine, { beforeEach, afterEach });

      // The block root is role="document"; the inline root is a roleless span.
      test(`isInline distinguishes block from inline rendering`, async () => {
        assertFalse(await engine().parts.block.isInline());
        assertTrue(await engine().parts.inline.isInline());
      });

      // The block source has one heading and one link; the inline source has neither.
      test(`counts headings and links in the block`, async () => {
        assertEqual(await engine().parts.block.getHeadingCount(), 1);
        assertEqual(await engine().parts.block.getLinkCount(), 1);
      });

      test(`inline markdown has no headings or links`, async () => {
        assertEqual(await engine().parts.inline.getHeadingCount(), 0);
        assertEqual(await engine().parts.inline.getLinkCount(), 0);
      });
    });
  },
};
