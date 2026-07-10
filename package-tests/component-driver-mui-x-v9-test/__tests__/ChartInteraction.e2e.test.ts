// E2E-only on purpose: chart hover/tooltip behavior needs a real layout engine, so this suite
// has no .dom.test.ts counterpart — the documented exception for the e2e-primary chart family
// (see #904 and the chart shims note in jest.setup.js).
import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { chartInteractionTestSuite } from '../src/examples';

testRunner(chartInteractionTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
