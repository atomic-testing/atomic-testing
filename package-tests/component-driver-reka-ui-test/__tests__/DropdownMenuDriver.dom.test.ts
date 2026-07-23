import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';
import { createTestEngine } from '@atomic-testing/vue-3';

import { DropdownMenuExample } from '../src/examples/dropdown-menu/DropdownMenu.examples';
import { dropdownMenuTestSuite } from '../src/examples/dropdown-menu/DropdownMenu.suite';

testRunner(dropdownMenuTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createTestEngine(DropdownMenuExample, scenePart),
});
