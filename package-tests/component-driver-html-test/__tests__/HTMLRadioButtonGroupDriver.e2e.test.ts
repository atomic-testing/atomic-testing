import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { uncontrolledRadioButtonGroupTestSuite } from '../src/examples';

testRunner(uncontrolledRadioButtonGroupTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
