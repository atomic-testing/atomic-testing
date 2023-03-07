import { createTestEngine } from '@testzilla/react';
import { multipleSelectExample, singleSelectExample } from '../src/examples/HTMLSelect.examples';

describe('HTMLSelectDriver', () => {
  test('Single Select', async () => {
    const testEngine = createTestEngine(singleSelectExample.ui, singleSelectExample.scene);
    const targetValue = '3';
      await testEngine.parts.select.setValue(targetValue);
      const val = await testEngine.parts.select.getValue();
      expect(val).toBe(targetValue);
      await testEngine.cleanUp();
  });

  test('Multiple Select', async () => {
    const testEngine = createTestEngine(multipleSelectExample.ui, multipleSelectExample.scene);
    const targetValue = ['3', '5'];
    await testEngine.parts.select.setValue(targetValue);
    const val = await testEngine.parts.select.getValue();
    expect(val).toEqual(targetValue);
    await testEngine.cleanUp();
  });  
});
