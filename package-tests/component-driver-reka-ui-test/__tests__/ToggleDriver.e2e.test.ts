import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { toggleTestSuite } from '../src/examples/toggle/Toggle.suite';

testRunner(toggleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
