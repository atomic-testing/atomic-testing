import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { switchTestSuite } from '../src/examples/switch/Switch.suite';

testRunner(switchTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
