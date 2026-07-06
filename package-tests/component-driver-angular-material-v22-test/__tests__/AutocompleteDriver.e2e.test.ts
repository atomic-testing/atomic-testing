import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { autocompleteTestSuite } from '../src/examples/autocomplete/Autocomplete.suite';

testRunner(autocompleteTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
