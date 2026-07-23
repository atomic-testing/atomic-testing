import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
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
  html5DragSource: {
    locator: byDataTestId('html5-drag-source'),
    driver: HTMLElementDriver,
  },
  html5DropTarget: {
    locator: byDataTestId('html5-drop-target'),
    driver: HTMLElementDriver,
  },
  html5DragStartCount: {
    locator: byDataTestId('html5-drag-start-count'),
    driver: HTMLElementDriver,
  },
  html5DropPayload: {
    locator: byDataTestId('html5-drop-payload'),
    driver: HTMLElementDriver,
  },
  html5DragEndCount: {
    locator: byDataTestId('html5-drag-end-count'),
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
        await engine().interactor.dragTo(engine().parts.dragSource.locator, engine().parts.dropTarget.locator);
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
        await engine().interactor.drag(engine().parts.dragBox.locator, { x: 40, y: 20 });
        const count = await engine().parts.dragInteractions.waitUntil({
          probeFn: () => engine().parts.dragInteractions.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(count, '1');
      });

      // Cross-engine: dragTo against a NATIVE HTML5 DnD source/target fires the
      // full dragstart -> dragenter -> dragover -> drop -> dragend sequence and
      // carries a dataTransfer payload from dragstart's setData through to
      // drop's getData (#922). The target has no mouse handlers, so this only
      // passes if the HTML5 event sequence itself is synthesized.
      test(`dragTo drives native HTML5 drag-and-drop (dataTransfer payload observable)`, async () => {
        assertEqual(await engine().parts.html5DragStartCount.getText(), '0');
        assertEqual(await engine().parts.html5DropPayload.getText(), '');
        assertEqual(await engine().parts.html5DragEndCount.getText(), '0');

        await engine().interactor.dragTo(
          engine().parts.html5DragSource.locator,
          engine().parts.html5DropTarget.locator
        );

        const payload = await engine().parts.html5DropPayload.waitUntil({
          probeFn: () => engine().parts.html5DropPayload.getText(),
          terminateCondition: text => text != null && text !== '',
          timeoutMs: 2000,
        });
        assertEqual(payload, 'atomic-testing-drag-payload');
        assertEqual(await engine().parts.html5DragStartCount.getText(), '1');
        assertEqual(await engine().parts.html5DragEndCount.getText(), '1');
      });

      // Cross-engine: drag (the single-element delta gesture) also fires
      // dragstart/dragend on a native-DnD element, dragging and dropping onto
      // itself (there is no separate target for a delta drag) — see #922.
      test(`drag fires dragstart/dragend on a native HTML5 DnD element`, async () => {
        assertEqual(await engine().parts.html5DragStartCount.getText(), '0');
        await engine().interactor.drag(engine().parts.html5DragSource.locator, { x: 10, y: 10 });
        const startCount = await engine().parts.html5DragStartCount.waitUntil({
          probeFn: () => engine().parts.html5DragStartCount.getText(),
          terminateCondition: '1',
          timeoutMs: 2000,
        });
        assertEqual(startCount, '1');
        assertEqual(await engine().parts.html5DragEndCount.getText(), '1');
      });

      // E2E-only: jsdom has no layout, so the box never actually moves. Real
      // movement is browser-only — assert the offset reaches roughly the delta.
      if (hasLayout) {
        test(`drag moves the box by the delta`, async () => {
          await engine().interactor.drag(engine().parts.dragBox.locator, { x: 40, y: 20 });
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
