import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { geometryExampleTestSuite } from '../src/examples';

testRunner(geometryExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
