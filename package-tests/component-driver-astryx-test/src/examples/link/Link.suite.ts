import { LinkDriver } from '@atomic-testing/component-driver-astryx';
import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { linkUIExample } from './Link.examples';

export const linkExampleScenePart = {
  docsLink: {
    locator: byDataTestId('docs-link'),
    driver: LinkDriver,
  },
  externalLink: {
    locator: byDataTestId('external-link'),
    driver: LinkDriver,
  },
  actionLink: {
    locator: byDataTestId('action-link'),
    driver: LinkDriver,
  },
  actionCount: {
    locator: byDataTestId('action-count'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const linkExample: IExampleUnit<typeof linkExampleScenePart, JSX.Element> = {
  ...linkUIExample,
  scene: linkExampleScenePart,
};

export const linkExampleTestSuite: TestSuiteInfo<typeof linkExample.scene> = {
  title: 'Astryx Link',
  url: '/link',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${linkExample.title}`, () => {
      const engine = useTestEngine(linkExample.scene, getTestEngine, { beforeEach, afterEach });

      // getHref/getText read the anchor.
      test(`getHref and getText read the link`, async () => {
        assertEqual(await engine().parts.docsLink.getHref(), '/docs');
        assertEqual(await engine().parts.docsLink.getText(), 'Documentation');
      });

      // External links set target=_blank and rel=noopener noreferrer.
      test(`external link exposes target and rel`, async () => {
        assertEqual(await engine().parts.externalLink.getTarget(), '_blank');
        assertEqual(await engine().parts.externalLink.getRel(), 'noopener noreferrer');
      });

      // A link with no href renders as the <button> fallback.
      test(`isButtonFallback detects the no-href fallback`, async () => {
        assertTrue(await engine().parts.actionLink.isButtonFallback());
        assertFalse(await engine().parts.docsLink.isButtonFallback());
      });

      // click reaches the fallback button's handler.
      test(`click triggers the action link`, async () => {
        await engine().parts.actionLink.click();
        const count = await engine().parts.actionCount.waitUntil({
          probeFn: () => engine().parts.actionCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });
    });
  },
};
