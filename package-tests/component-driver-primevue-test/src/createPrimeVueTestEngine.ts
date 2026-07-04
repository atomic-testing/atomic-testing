import { ScenePart, TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/vue-3';
import { Component } from 'vue';

import { primeVuePlugins } from './primevueSetup';

/**
 * jsdom test-engine factory with the PrimeVue plugin pre-installed — the Vue
 * counterpart of the React adapters' bare `createTestEngine` call in the
 * sibling test packages' `.dom.test.ts` files.
 */
export function createPrimeVueTestEngine<T extends ScenePart>(ui: Component, scenePart: T): TestEngine<T> {
  return createTestEngine(ui, scenePart, { plugins: primeVuePlugins });
}
