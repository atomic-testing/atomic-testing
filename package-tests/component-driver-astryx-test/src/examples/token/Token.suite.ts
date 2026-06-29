import { TokenDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { tokenUIExample } from './Token.examples';

export const tokenExampleScenePart = {
  basic: {
    locator: byDataTestId('token-basic'),
    driver: TokenDriver,
  },
  removable: {
    locator: byDataTestId('token-removable'),
    driver: TokenDriver,
  },
  link: {
    locator: byDataTestId('token-link'),
    driver: TokenDriver,
  },
} satisfies ScenePart;

export const tokenExample: IExampleUnit<typeof tokenExampleScenePart, JSX.Element> = {
  ...tokenUIExample,
  scene: tokenExampleScenePart,
};

export const tokenExampleTestSuite: TestSuiteInfo<typeof tokenExample.scene> = {
  title: 'Astryx Token',
  url: '/token',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${tokenExample.title}`, () => {
      const engine = useTestEngine(tokenExample.scene, getTestEngine, { beforeEach, afterEach });

      // getLabel reads the nested label text.
      test(`getLabel reads each token's label`, async () => {
        assertEqual(await engine().parts.basic.getLabel(), 'Tag');
        assertEqual(await engine().parts.removable.getLabel(), 'Removable');
        assertEqual(await engine().parts.link.getLabel(), 'Link');
      });

      // isRemovable is true only for the token with a Remove button.
      test(`isRemovable detects the remove control`, async () => {
        assertTrue(await engine().parts.removable.isRemovable());
        assertFalse(await engine().parts.basic.isRemovable());
      });

      // remove() clicks the Remove button when present, and reports false otherwise.
      test(`remove returns false when not removable`, async () => {
        assertFalse(await engine().parts.basic.remove());
        assertTrue(await engine().parts.removable.remove());
      });

      // A token with href renders an <a>: getHref returns it; the basic token has none.
      test(`getHref detects the link case`, async () => {
        assertEqual(await engine().parts.link.getHref(), '/destination');
        assertEqual(await engine().parts.basic.getHref(), undefined);
      });
    });
  },
};
