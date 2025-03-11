import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { focusEventExampleTestSuite } from '../src/examples';

testRunner(focusEventExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
