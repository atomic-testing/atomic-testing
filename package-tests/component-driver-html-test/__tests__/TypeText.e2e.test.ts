import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { typeTextExampleTestSuite } from '../src/examples';

testRunner(typeTextExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
