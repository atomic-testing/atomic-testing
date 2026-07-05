import { createTestEngine } from '@atomic-testing/angular-21';
import { testRunner } from '@atomic-testing/internal-test-runner';
import { vitestAdapter } from '@atomic-testing/internal-test-runner-vitest-adapter';

import { AutocompleteExampleComponent } from '../src/examples/autocomplete/Autocomplete.examples';
import { autocompleteScenePart, autocompleteTestSuite } from '../src/examples/autocomplete/Autocomplete.suite';

testRunner(autocompleteTestSuite, vitestAdapter, {
  getTestEngine: (scenePart: typeof autocompleteScenePart) => createTestEngine(AutocompleteExampleComponent, scenePart),
});
