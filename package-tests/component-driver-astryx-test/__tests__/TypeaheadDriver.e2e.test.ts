import { testRunner } from '@atomic-testing/internal-test-runner';
import { getTestRunnerInterface, playWrightTestFrameworkMapper } from '@atomic-testing/playwright';

import { typeaheadExampleTestSuite } from '../src/examples';

testRunner(typeaheadExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
