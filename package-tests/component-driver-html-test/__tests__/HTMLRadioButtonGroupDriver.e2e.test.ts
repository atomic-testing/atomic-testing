import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';
import { testRunner } from '@atomic-testing/test-runner';

import { uncontrolledRadioButtonGroupTestSuite } from '../src/examples';

testRunner(uncontrolledRadioButtonGroupTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
