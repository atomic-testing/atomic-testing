import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/internal-test-runner';

import { checkboxGroupTestSuite, singleCheckboxTestSuite } from '../src/examples';

testRunner(singleCheckboxTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(checkboxGroupTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
