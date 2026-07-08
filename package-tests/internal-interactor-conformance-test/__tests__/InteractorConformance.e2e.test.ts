import {
  conformanceFixtureHtml,
  conformanceScenePart,
  defineConformanceSuite,
} from '@atomic-testing/internal-interactor-conformance';
import { E2eTestInterface, E2eTestRunEnvironmentFixture } from '@atomic-testing/internal-test-runner';
import {
  playwrightGetTestEngine,
  playWrightTestFrameworkMapper,
} from '@atomic-testing/internal-test-runner-playwright-adapter';
import { Page } from '@playwright/test';

// PlaywrightInteractor leg: load the SAME fixture via page.setContent (no dev
// server needed) and drive it with the Playwright adapter. Passing against the
// jsdom-defined specs proves the #1047 read-path fixes bring PlaywrightInteractor
// into conformance.
const interaction: E2eTestInterface<typeof conformanceScenePart> = {
  getTestEngine: playwrightGetTestEngine,
  goto: async (_url: string, fixture?: E2eTestRunEnvironmentFixture): Promise<void> => {
    const page = fixture!.page as Page;
    await page.setContent(conformanceFixtureHtml);
  },
};

defineConformanceSuite(playWrightTestFrameworkMapper, interaction);
