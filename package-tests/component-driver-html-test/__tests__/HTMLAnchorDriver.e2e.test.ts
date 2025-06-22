import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { hoverAnchorExampleTestSuite } from '../src/examples';

testRunner(hoverAnchorExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
