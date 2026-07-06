import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/internal-test-runner-playwright-adapter';

import { dividerExampleTestSuite } from '../src/examples';

testRunner(dividerExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
