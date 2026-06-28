import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { iconCheckboxTestSuite, indeterminateCheckboxTestSuite, labelCheckboxTestSuite } from '../src/examples';

testRunner(labelCheckboxTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(iconCheckboxTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());

testRunner(indeterminateCheckboxTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
