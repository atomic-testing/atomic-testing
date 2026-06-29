import { CitationDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { citationUIExample } from './Citation.examples';

export const citationExampleScenePart = {
  link: {
    locator: byDataTestId('citation-link'),
    driver: CitationDriver,
  },
  plain: {
    locator: byDataTestId('citation-plain'),
    driver: CitationDriver,
  },
  number: {
    locator: byDataTestId('citation-number'),
    driver: CitationDriver,
  },
} satisfies ScenePart;

export const citationExample: IExampleUnit<typeof citationExampleScenePart, JSX.Element> = {
  ...citationUIExample,
  scene: citationExampleScenePart,
};

export const citationExampleTestSuite: TestSuiteInfo<typeof citationExample.scene> = {
  title: 'Astryx Citation',
  url: '/citation',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${citationExample.title}`, () => {
      const engine = useTestEngine(citationExample.scene, getTestEngine, { beforeEach, afterEach });

      // getTitle reads the title attribute; getNumber parses the aria-label.
      test(`getTitle and getNumber read the citation`, async () => {
        assertEqual(await engine().parts.link.getTitle(), 'Example Source');
        assertEqual(await engine().parts.link.getNumber(), 1);
        assertEqual(await engine().parts.link.getVariant(), 'label');
      });

      // A source with a url renders an <a href>: getHref returns it and isLink is true.
      test(`getHref and isLink detect the link case`, async () => {
        assertEqual(await engine().parts.link.getHref(), 'https://example.com');
        assertTrue(await engine().parts.link.isLink());
      });

      // A source without a url renders a <span>: no href, isLink is false.
      test(`an unlinked citation has no href`, async () => {
        assertEqual(await engine().parts.plain.getHref(), undefined);
        assertFalse(await engine().parts.plain.isLink());
        assertEqual(await engine().parts.plain.getNumber(), 2);
      });

      // The number variant exposes the same parsed number and its data-variant.
      test(`reads the number variant`, async () => {
        assertEqual(await engine().parts.number.getNumber(), 3);
        assertEqual(await engine().parts.number.getVariant(), 'number');
      });
    });
  },
};
