import { DividerDriver } from '@atomic-testing/component-driver-astryx';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dividerUIExample } from './Divider.examples';

export const dividerExampleScenePart = {
  labeled: {
    locator: byDataTestId('divider-labeled'),
    driver: DividerDriver,
  },
  plain: {
    locator: byDataTestId('divider-plain'),
    driver: DividerDriver,
  },
} satisfies ScenePart;

export const dividerExample: IExampleUnit<typeof dividerExampleScenePart, JSX.Element> = {
  ...dividerUIExample,
  scene: dividerExampleScenePart,
};

export const dividerExampleTestSuite: TestSuiteInfo<typeof dividerExample.scene> = {
  title: 'Astryx Divider',
  url: '/divider',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${dividerExample.title}`, () => {
      const engine = useTestEngine(dividerExample.scene, getTestEngine, { beforeEach, afterEach });

      // getVariant/getOrientation read the stable data-* attributes; getLabel the middle child.
      test(`reads variant, orientation, and label`, async () => {
        assertEqual(await engine().parts.labeled.getVariant(), 'subtle');
        assertEqual(await engine().parts.labeled.getOrientation(), 'horizontal');
        assertEqual(await engine().parts.labeled.getLabel(), 'or');
      });

      // An unlabeled divider has a single inner div, so getLabel is undefined.
      test(`label is undefined when unlabeled`, async () => {
        assertEqual(await engine().parts.plain.getVariant(), 'strong');
        assertEqual(await engine().parts.plain.getLabel(), undefined);
      });
    });
  },
};
