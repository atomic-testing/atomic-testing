import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dropdownExampleTestSuite } from '../src/examples';

testRunner(dropdownExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
