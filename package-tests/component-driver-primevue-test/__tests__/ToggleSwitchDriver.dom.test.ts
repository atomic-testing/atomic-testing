import { testRunner } from '@atomic-testing/internal-test-runner';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

import { createPrimeVueTestEngine } from '../src/createPrimeVueTestEngine';
import { ToggleSwitchExample } from '../src/examples/toggle-switch/ToggleSwitch.examples';
import { toggleSwitchTestSuite } from '../src/examples/toggle-switch/ToggleSwitch.suite';

testRunner(toggleSwitchTestSuite, jestTestAdapter, {
  getTestEngine: scenePart => createPrimeVueTestEngine(ToggleSwitchExample, scenePart),
});
