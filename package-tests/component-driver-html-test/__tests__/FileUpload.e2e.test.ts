import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { fileUploadExampleTestSuite } from '../src/examples';

testRunner(fileUploadExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
