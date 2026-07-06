import { AspectRatioDriver } from '@atomic-testing/component-driver-radix-v1';
import { byCssSelector, byDataTestId, IExampleUnit, locatorUtil, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { aspectRatioUIExample } from './AspectRatio.examples';

// Radix forwards data-testid onto AspectRatio.Root's inner content div, not the
// outer ratio-encoding wrapper (see AspectRatio.examples.tsx) — so each scene
// part descends from the sizing container to Radix's own
// `data-radix-aspect-ratio-wrapper` attribute to anchor on the right element.
const wrapperLocator = byCssSelector('[data-radix-aspect-ratio-wrapper]');

export const aspectRatioExampleScenePart = {
  widescreen: {
    locator: locatorUtil.append(byDataTestId('aspect-ratio-widescreen'), wrapperLocator),
    driver: AspectRatioDriver,
  },
  square: {
    locator: locatorUtil.append(byDataTestId('aspect-ratio-square'), wrapperLocator),
    driver: AspectRatioDriver,
  },
} satisfies ScenePart;

export const aspectRatioExample: IExampleUnit<typeof aspectRatioExampleScenePart, JSX.Element> = {
  ...aspectRatioUIExample,
  scene: aspectRatioExampleScenePart,
};

export const aspectRatioExampleTestSuite: TestSuiteInfo<typeof aspectRatioExample.scene> = {
  title: 'Radix AspectRatio',
  url: '/aspect-ratio',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertApproxEqual }) => {
    describe(`${aspectRatioExample.title}`, () => {
      const engine = useTestEngine(aspectRatioExample.scene, getTestEngine, { beforeEach, afterEach });

      test('reads the configured ratio per instance', async () => {
        // NaN fallback (rather than `!`) keeps a genuinely-undefined read a loud
        // assertion failure instead of a silent type-cast.
        assertApproxEqual((await engine().parts.widescreen.getRatio()) ?? NaN, 16 / 9, 0.01);
        assertApproxEqual((await engine().parts.square.getRatio()) ?? NaN, 1, 0.01);
      });
    });
  },
};
