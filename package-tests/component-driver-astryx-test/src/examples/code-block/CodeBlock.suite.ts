import { CodeBlockDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { codeBlockUIExample } from './CodeBlock.examples';

export const codeBlockExampleScenePart = {
  basic: {
    locator: byDataTestId('codeblock-basic'),
    driver: CodeBlockDriver,
  },
  collapsible: {
    locator: byDataTestId('codeblock-collapsible'),
    driver: CodeBlockDriver,
  },
  large: {
    locator: byDataTestId('codeblock-large'),
    driver: CodeBlockDriver,
  },
} satisfies ScenePart;

export const codeBlockExample: IExampleUnit<typeof codeBlockExampleScenePart, JSX.Element> = {
  ...codeBlockUIExample,
  scene: codeBlockExampleScenePart,
};

export const codeBlockExampleTestSuite: TestSuiteInfo<typeof codeBlockExample.scene> = {
  title: 'Astryx CodeBlock',
  url: '/code-block',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${codeBlockExample.title}`, () => {
      const engine = useTestEngine(codeBlockExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLanguage reads data-language; getCode reads the <code> text; lines are data-line markers.
      test(`reads the language, code, and line count`, async () => {
        assertEqual(await engine().parts.basic.getLanguage(), 'javascript');
        assertTrue((await engine().parts.basic.getCode())?.includes('const x = 1;') ?? false);
        assertEqual(await engine().parts.basic.getLineCount(), 2);
      });

      // A non-collapsible block has no collapse toggle, so it is never collapsed.
      test(`a plain block is never collapsed`, async () => {
        assertFalse(await engine().parts.basic.isCollapsed());
      });

      // Above 100 lines Astryx wraps the data-line markers in chunk <div>s; the
      // line count must descend through those wrappers rather than count flat children.
      test(`counts every line in a chunked (>100-line) block`, async () => {
        assertEqual(await engine().parts.large.getLineCount(), 150);
      });

      // The collapsible block exposes a toggle; toggleCollapse flips its state.
      // Astryx renders it expanded by default, so this goes expanded -> collapsed.
      test(`toggleCollapse flips the collapsible block's state`, async () => {
        assertEqual(await engine().parts.collapsible.getLanguage(), 'text');

        const before = await engine().parts.collapsible.isCollapsed();
        await engine().parts.collapsible.toggleCollapse();
        assertEqual(await engine().parts.collapsible.isCollapsed(), !before);
      });
    });
  },
};
