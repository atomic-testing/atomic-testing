import { createTestEngine } from '@atomic-testing/react';
import { radioButtonGroupExamples } from '../src/examples/HTMLRadioButtonGroup.examples';

describe('HTMLRadioButtonGroupDriver', () => {
  radioButtonGroupExamples.forEach((example) => {
    test(`${example.title}`, async () => {
      const testEngine = createTestEngine(example.ui, example.scene);
      const targetValue = '3';
      await testEngine.parts.input.setValue(targetValue);
      const val = await testEngine.parts.input.getValue();
      expect(val).toBe(targetValue);
      await testEngine.cleanUp();
    });
  });
});
