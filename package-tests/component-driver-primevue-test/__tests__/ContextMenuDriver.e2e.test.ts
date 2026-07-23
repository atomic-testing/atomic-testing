import { testRunner } from '@atomic-testing/internal-test-runner';
import {
  getTestRunnerInterface,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';

import { contextMenuTestSuite } from '../src/examples/context-menu/ContextMenu.suite';

testRunner(contextMenuTestSuite, playWrightTestFrameworkMapper, getTestRunnerInterface());
