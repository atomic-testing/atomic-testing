import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { dropdownMenuExampleTestSuite } from '../src/examples';

testRunner(dropdownMenuExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
