import { ScenePart, TestEngine } from '@atomic-testing/core';

import { DOMInteractor } from './DOMInteractor';
import { IDomTestEngineOption } from './types';

/**
 * Create test engine for DOM testing
 * @param element The element to test, if not sure, use document.body
 * @param partDefinitions The scene part definitions
 * @param _option The option, reserved for future use
 * @returns The test engine
 */
export function createDomTestEngine<T extends ScenePart>(
  element: HTMLElement,
  partDefinitions: T,
  _option?: IDomTestEngineOption
): TestEngine<T> {
  const cleanup = () => Promise.resolve();
  return new TestEngine(
    [],
    new DOMInteractor(element),
    {
      parts: partDefinitions,
    },
    cleanup
  );
}
