import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { basicRadioGroupTestSuite } from '../src/examples';

testRunner(basicRadioGroupTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
