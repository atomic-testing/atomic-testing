import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ScenePart } from '@atomic-testing/core';
import { IExampleUnit, TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { dragUIExample } from './Drag.examples';

export const dragExampleScenePart = {
  dragBox: {
    locator: byDataTestId('drag-box'),
    driver: HTMLElementDriver,
  },
  dragSource: {
    locator: byDataTestId('drag-source'),
    driver: HTMLElementDriver,
  },
  dropTarget: {
    locator: byDataTestId('drop-target'),
    driver: HTMLElementDriver,
  },
  dragInteractions: {
    locator: byDataTestId('drag-interactions'),
    driver: HTMLElementDriver,
  },
  dragPosition: {
    locator: byDataTestId('drag-position'),
    driver: HTMLElementDriver,
  },
  dropStatus: {
    locator: byDataTestId('drop-status'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export const dragExample: IExampleUnit<typeof dragExampleScenePart, JSX.Element> = {
  ...dragUIExample,
  scene: dragExampleScenePart,
};

export const dragExampleTestSuite: TestSuiteInfo<typeof dragExample.scene> = {
  title: 'Drag: dragTo / drag',
  url: '/drag',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertApproxEqual, hasLayout }) => {
    describe(`${dragExample.title}`, () => {
      const engine = useTestEngine(dragExample.scene, getTestEngine, { beforeEach, afterEach });

      // Cross-engine: a mouseup lands on the drop target in both engines, so the
      // drop handler fires. A static source is used (not the pointer-following
      // box) so the target stays topmost at release in a real browser. Positional
      // outcome is not asserted here.
      test(`dragTo drops onto the target`, async () => {
        await engine().parts.dragSource.dragTo(engine().parts.dropTarget);
        const status = await engine().parts.dropStatus.waitUntil({
          probeFn: () => engine().parts.dropStatus.getText(),
          terminateCondition: 'dropped',
          timeoutMs: 2000,
        });
        assertEqual(status, 'dropped');
      });

      // Cross-engine: drag fires a mousedown, so the interaction counter advances.
      // This proves the event wiring, not the coordinates.
      test(`drag fires the mousedown interaction`, async () => {
        assertEqual(await engine().parts.dragInteractions.getText(), '0');
        await engine().parts.dragBox.drag({ x: 40, y: 20 });
        const count = await engine().parts.dragInteractions.waitUntil({
          probeFn: () => engine().parts.dragInteractions.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // E2E-only: jsdom has no layout, so the box never actually moves. Real
      // movement is browser-only — assert the offset reaches roughly the delta.
      if (hasLayout) {
        test(`drag moves the box by the delta`, async () => {
          await engine().parts.dragBox.drag({ x: 40, y: 20 });
          const position = await engine().parts.dragPosition.waitUntil({
            probeFn: () => engine().parts.dragPosition.getText(),
            terminateCondition: text => text != null && text !== '0,0',
            timeoutMs: 2000,
          });
          const [x, y] = (position ?? '0,0').split(',').map(Number);
          assertApproxEqual(x, 40, 5);
          assertApproxEqual(y, 20, 5);
        });
      }
    });
  },
};
