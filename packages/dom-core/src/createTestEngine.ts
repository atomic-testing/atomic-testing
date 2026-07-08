import { ScenePart, TestEngine } from '@atomic-testing/core';

import { DOMInteractor } from './DOMInteractor';

/**
 * Create test engine for DOM testing
 * @param element The element to test, if not sure, use document.body
 * @param partDefinitions The scene part definitions
 * @returns The test engine
 */
export function createTestEngine<T extends ScenePart>(element: HTMLElement, partDefinitions: T): TestEngine<T> {
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

/**
 * @deprecated Use {@link createTestEngine}. Kept as an alias for backward
 * compatibility; every adapter now exports `createTestEngine`.
 */
export const createDomTestEngine = createTestEngine;
