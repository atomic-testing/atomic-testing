import { BlockquoteDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { blockquoteUIExample } from './Blockquote.examples';

export const blockquoteExampleScenePart = {
  cited: {
    locator: byDataTestId('blockquote-cited'),
    driver: BlockquoteDriver,
  },
  plain: {
    locator: byDataTestId('blockquote-plain'),
    driver: BlockquoteDriver,
  },
} satisfies ScenePart;

export const blockquoteExample: IExampleUnit<typeof blockquoteExampleScenePart, JSX.Element> = {
  ...blockquoteUIExample,
  scene: blockquoteExampleScenePart,
};

export const blockquoteExampleTestSuite: TestSuiteInfo<typeof blockquoteExample.scene> = {
  title: 'Astryx Blockquote',
  url: '/blockquote',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${blockquoteExample.title}`, () => {
      const engine = useTestEngine(blockquoteExample.scene, getTestEngine, { beforeEach, afterEach });

      // getCitation isolates the <cite> descendant from the whole-element getText.
      test(`reads the citation when present`, async () => {
        assertEqual(await engine().parts.cited.getCitation(), 'Steve Jobs');
      });

      // An uncited blockquote has no <cite>, so getCitation is undefined and getText is the quote alone.
      test(`citation is undefined when absent`, async () => {
        assertEqual(await engine().parts.plain.getCitation(), undefined);
        assertEqual(await engine().parts.plain.getText(), 'Stay hungry, stay foolish.');
      });
    });
  },
};
