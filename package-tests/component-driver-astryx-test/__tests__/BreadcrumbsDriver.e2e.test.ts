import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { breadcrumbsExampleTestSuite } from '../src/examples';

testRunner(breadcrumbsExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
