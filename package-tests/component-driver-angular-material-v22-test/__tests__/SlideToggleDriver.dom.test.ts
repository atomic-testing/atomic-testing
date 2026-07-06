import { createTestEngine } from '@atomic-testing/angular-22';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { SlideToggleExampleComponent } from '../src/examples/slideToggle/SlideToggle.examples';
import { slideToggleScenePart, slideToggleTestSuite } from '../src/examples/slideToggle/SlideToggle.suite';

testRunner(slideToggleTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof slideToggleScenePart) => createTestEngine(SlideToggleExampleComponent, scenePart),
});
