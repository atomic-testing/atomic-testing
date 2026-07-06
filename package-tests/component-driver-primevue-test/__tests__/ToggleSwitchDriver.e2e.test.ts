import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { toggleSwitchTestSuite } from '../src/examples/toggle-switch/ToggleSwitch.suite';

testRunner(toggleSwitchTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
