import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { separatorTestSuite } from '../src/examples/separator/Separator.suite';

testRunner(separatorTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
