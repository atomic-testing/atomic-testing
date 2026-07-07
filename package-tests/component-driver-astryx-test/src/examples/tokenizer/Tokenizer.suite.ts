import { TokenizerDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { tokenizerUIExample } from './Tokenizer.examples';

export const tokenizerExampleScenePart = {
  tags: {
    locator: byDataTestId('tags'),
    driver: TokenizerDriver,
  },
  plain: {
    locator: byDataTestId('plain-tags'),
    driver: TokenizerDriver,
  },
  disabled: {
    locator: byDataTestId('disabled-tags'),
    driver: TokenizerDriver,
  },
} satisfies ScenePart;

export const tokenizerExample: IExampleUnit<typeof tokenizerExampleScenePart, JSX.Element> = {
  ...tokenizerUIExample,
  scene: tokenizerExampleScenePart,
};

export const tokenizerExampleTestSuite: TestSuiteInfo<typeof tokenizerExample.scene> = {
  title: 'Astryx Tokenizer',
  url: '/tokenizer',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tokenizerExample.title}`, () => {
      const engine = useTestEngine(tokenizerExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // getTokenLabels lists the existing chips; the two tokenizers stay independent.
      test(`reads existing tokens`, async () => {
        assertEqual(await engine().parts.tags.getTokenLabels(), ['Apple']);
        assertEqual(await engine().parts.tags.getTokenCount(), 1);
        assertEqual(await engine().parts.plain.getTokenCount(), 0);
      });

      // addByLabel picks a search result and adds it as a token.
      test(`addByLabel adds a token from search`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.tags.type('gr');
        assertTrue((await engine().parts.tags.getResultLabels()).includes('Grape'));
        assertTrue(await engine().parts.tags.addByLabel('Grape'));
        assertEqual(await engine().parts.tags.getTokenLabels(), ['Apple', 'Grape']);
      });

      // removeToken removes a chip by its label.
      test(`removeToken removes a chip`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertFalse(await engine().parts.tags.removeToken('Nope'));
        assertTrue(await engine().parts.tags.removeToken('Apple'));
        assertEqual(await engine().parts.tags.getTokenCount(), 0);
      });

      // create adds the current query as a new token (hasCreate).
      test(`create adds a new token`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.tags.type('Mango');
        assertTrue(await engine().parts.tags.create());
        assertTrue((await engine().parts.tags.getTokenLabels()).includes('Mango'));
      });

      // clearAll removes every token.
      test(`clearAll empties the tokenizer`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        assertTrue(await engine().parts.tags.clearAll());
        assertEqual(await engine().parts.tags.getTokenCount(), 0);
      });

      // getDisabledMessage resolves through the combobox input's aria-describedby.
      test(`getDisabledMessage returns the disabled-reason tooltip, undefined when none`, async () => {
        assertEqual(
          await engine().parts.disabled.getDisabledMessage(),
          'Tags are locked while the review is in progress'
        );
        assertEqual(await engine().parts.tags.getDisabledMessage(), undefined);
      });
    });
  },
};
