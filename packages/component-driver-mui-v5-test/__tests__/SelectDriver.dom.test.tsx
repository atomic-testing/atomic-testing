import { createTestEngine } from '@atomic-testing/react';

import { selectExamples } from '../src/examples/Select.examples';

describe('SelectDriver', () => {
  selectExamples.forEach((example) => {
    test(`${example.title}`, async () => {
      const testEngine = createTestEngine(example.ui, example.scene);
      const targetValue = '30';
      await testEngine.parts.select.setValue(targetValue);
      const val = await testEngine.parts.select.getValue();
      expect(val).toBe(targetValue);
      await testEngine.cleanUp();
    });
  });
});
