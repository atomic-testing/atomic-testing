import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { dateTimeInputExampleTestSuite } from '../src/examples';

testRunner(dateTimeInputExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
