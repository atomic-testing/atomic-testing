import { HTMLButtonDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, ElementNotFoundErrorId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { elementNotFoundUIExample } from './ElementNotFound.examples';

export const elementNotFoundScenePart = {
  present: { locator: byDataTestId('present'), driver: HTMLButtonDriver },
} satisfies ScenePart;

export const elementNotFoundExample: IExampleUnit<typeof elementNotFoundScenePart, JSX.Element> = {
  ...elementNotFoundUIExample,
  scene: elementNotFoundScenePart,
};

export const elementNotFoundTestSuite: TestSuiteInfo<typeof elementNotFoundExample.scene> = {
  title: 'Interactor: element-not-found error contract',
  url: '/element-not-found',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual }) => {
    describe(`${elementNotFoundExample.title}`, () => {
      const engine = useTestEngine(elementNotFoundExample.scene, getTestEngine, { beforeEach, afterEach });

      // Happy path: a present element still resolves through the error-translation
      // wrapper, so normal mutations are unaffected (auto-wait/act preserved).
      test('click resolves for a present element', async () => {
        await engine().interactor.click(byDataTestId('present'));
        assertEqual(await engine().interactor.getText(byDataTestId('present')), 'clicked');
      });

      // The unified contract (ADR-006): a mutative call on a locator that matches
      // nothing throws ElementNotFoundError — the SAME discriminant in jsdom and
      // in every browser, so a shared suite can assert it without branching on
      // the environment.
      test('click throws ElementNotFoundError for a missing element', async () => {
        // Bound Playwright's auto-wait so a genuinely-absent element fails fast
        // instead of hanging to the per-test timeout. The jsdom interactor has no
        // `page` and ignores this — it throws synchronously.
        const interactor = engine().interactor as unknown as {
          page?: { setDefaultTimeout(ms: number): void };
        };
        interactor.page?.setDefaultTimeout(2000);

        let errorName: string | undefined;
        try {
          await engine().interactor.click(byDataTestId('definitely-not-present'));
        } catch (e) {
          errorName = (e as Error).name;
        }
        assertEqual(errorName, ElementNotFoundErrorId);
      });
    });
  },
};
