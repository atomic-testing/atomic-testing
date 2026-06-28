import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicAccordionTestSuite } from '../src/examples';

testRunner(basicAccordionTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
