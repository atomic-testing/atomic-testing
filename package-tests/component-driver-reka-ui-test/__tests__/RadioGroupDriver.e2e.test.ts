import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { radioGroupTestSuite } from '../src/examples/radio-group/RadioGroup.suite';

testRunner(radioGroupTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
