import { createTestEngine } from '@atomic-testing/react';
import { textInputExamples } from '../src/examples';

describe('HTMLTextInputDriver', () => {
  textInputExamples.forEach((example) => {
    test(`${example.title}`, async () => {
      const testEngine = createTestEngine(example.ui, example.scene);
      const targetValue = 'abc';
      await testEngine.parts.input.setValue(targetValue);
      const val = await testEngine.parts.input.getValue();
      expect(val).toBe(targetValue);
      await testEngine.cleanUp();
    });
  });
});
