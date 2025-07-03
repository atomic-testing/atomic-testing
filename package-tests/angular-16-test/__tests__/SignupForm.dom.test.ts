import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/angular-16';
import { FormsModule } from '@angular/forms';

import { signupFormExample } from '../src/SignupForm.example';

describe('SignupForm', () => {
  let engine: TestEngine<typeof signupFormExample.scene>;

  beforeEach(() => {
    engine = createTestEngine(signupFormExample.ui, signupFormExample.scene, {
      moduleMetadata: { imports: [FormsModule] },
    });
  });

  afterEach(async () => {
    await engine.cleanUp();
  });

  test('submits form', async () => {
    await engine.parts.nameInput.enterText('John');
    await engine.parts.emailInput.enterText('john@example.com');
    await engine.parts.submitButton.click();
    const text = await engine.parts.message.getText();
    expect(text).toBe('Submitted: John - john@example.com');
  });
});
