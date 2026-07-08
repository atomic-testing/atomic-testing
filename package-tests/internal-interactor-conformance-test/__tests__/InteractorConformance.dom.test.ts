import { createTestEngine } from '@atomic-testing/dom-core';
import {
  conformanceFixtureHtml,
  conformanceScenePart,
  defineConformanceSuite,
} from '@atomic-testing/internal-interactor-conformance';
import { jestTestAdapter } from '@atomic-testing/internal-test-runner-jest-adapter';

// DOMInteractor leg: mount the framework-agnostic fixture into the jsdom
// document and drive it with the DOM adapter. jsdom is the contract every other
// interactor is proven against (ADR-006).
defineConformanceSuite(jestTestAdapter, {
  getTestEngine: (scenePart: typeof conformanceScenePart) => {
    document.body.innerHTML = conformanceFixtureHtml;
    return createTestEngine(document.body, scenePart);
  },
});
