import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicSelectTestSuite, nativeSelectTestSuite } from '../src/examples';

testRunner(basicSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(nativeSelectTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
