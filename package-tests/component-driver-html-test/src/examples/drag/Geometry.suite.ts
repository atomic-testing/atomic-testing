import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dragUIExample } from './Drag.examples';

// Reuses the drag example (same /drag route): its box has an explicit size, so a
// real layout engine reports plausible dimensions for getBoundingRect.
export const geometryExampleScenePart = {
  dragBox: {
    locator: byDataTestId('drag-box'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const geometryExample: IExampleUnit<typeof geometryExampleScenePart, JSX.Element> = {
  ...dragUIExample,
  scene: geometryExampleScenePart,
};

export const geometryExampleTestSuite: TestSuiteInfo<typeof geometryExample.scene> = {
  title: 'Geometry: getBoundingRect',
  url: '/drag',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, hasLayout }) => {
    describe(`${geometryExample.title}`, () => {
      const engine = useTestEngine(geometryExample.scene, getTestEngine, { beforeEach, afterEach });

      // Cross-engine: the rect is structurally valid in both engines.
      test(`getBoundingRect returns a numeric x/y/width/height shape`, async () => {
        const r = await engine().parts.dragBox.getBoundingRect();
        assertEqual(typeof r.width, 'number');
        assertEqual(typeof r.height, 'number');
        assertEqual(typeof r.x, 'number');
        assertEqual(typeof r.y, 'number');
      });

      // jsdom-only: no layout engine, so getBoundingClientRect is all zeros.
      if (!hasLayout) {
        test(`getBoundingRect returns a zero-rect under jsdom`, async () => {
          const r = await engine().parts.dragBox.getBoundingRect();
          assertEqual(r.width, 0);
          assertEqual(r.height, 0);
        });
      }

      // E2E-only: a real layout engine reports the box's actual 120x60-ish size.
      if (hasLayout) {
        test(`getBoundingRect returns the box's real dimensions`, async () => {
          const r = await engine().parts.dragBox.getBoundingRect();
          assertTrue(r.width > 0 && r.height > 0);
        });
      }
    });
  },
};
