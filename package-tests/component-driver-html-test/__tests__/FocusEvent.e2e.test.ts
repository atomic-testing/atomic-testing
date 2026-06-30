import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { focusEventExampleTestSuite } from '../src/examples';

testRunner(focusEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
