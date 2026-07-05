import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { inputTestSuite } from '../src/examples/input/Input.suite';

testRunner(inputTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
