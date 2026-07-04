import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { slideToggleTestSuite } from '../src/examples/slideToggle/SlideToggle.suite';

testRunner(slideToggleTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
