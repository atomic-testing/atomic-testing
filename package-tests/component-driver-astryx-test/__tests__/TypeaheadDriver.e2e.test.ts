import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { typeaheadExampleTestSuite } from '../src/examples';

testRunner(typeaheadExampleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
