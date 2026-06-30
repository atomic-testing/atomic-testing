import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { basicAccordionTestSuite } from '../src/examples';

testRunner(basicAccordionTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
