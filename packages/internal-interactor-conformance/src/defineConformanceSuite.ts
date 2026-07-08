import { InteractionInterface, TestFrameworkMapper, testRunner } from '@atomic-testing/internal-test-runner';

import { conformanceScenePart } from './conformanceFixture';
import { interactorConformanceSuites } from './conformanceSuites';

/**
 * Register the interactor conformance suite (TCK) against a concrete
 * environment. Reuses the shared `TestFrameworkMapper` (ADR-004) so the identical
 * specs run under Jest and Playwright.
 *
 * @param frameworkMapper - The runner adapter (`jestTestAdapter` /
 *   `playWrightTestFrameworkMapper`) that maps describe/test/assert onto the host
 *   runner.
 * @param interaction - Supplies the `TestEngine` under test (and, for e2e, the
 *   navigation/`setContent` step) — i.e. which interactor the suite exercises.
 */
export function defineConformanceSuite(
  frameworkMapper: TestFrameworkMapper,
  interaction: InteractionInterface<typeof conformanceScenePart>
): void {
  testRunner(interactorConformanceSuites, frameworkMapper, interaction);
}
