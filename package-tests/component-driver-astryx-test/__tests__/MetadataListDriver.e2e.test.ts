import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { metadataListExampleTestSuite } from '../src/examples';

testRunner(metadataListExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
