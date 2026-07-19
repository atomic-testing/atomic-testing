import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { breadcrumbExampleTestSuite } from '../src/examples';

testRunner(breadcrumbExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
