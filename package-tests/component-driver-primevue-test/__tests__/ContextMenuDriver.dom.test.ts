import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { ContextMenuExample } from '../src/examples/context-menu/ContextMenu.examples';
import { contextMenuTestSuite } from '../src/examples/context-menu/ContextMenu.suite';

testRunner(contextMenuTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(ContextMenuExample, scenePart),
});
