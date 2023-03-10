import { TestEngine } from '@atomic-testing/core';
import { createTestEngine } from '@atomic-testing/playwright';
import { expect, test } from '@playwright/test';
import {
  iconCheckboxExample,
  indeterminateCheckboxExample,
  labelCheckboxExample,
} from '../src/examples/Checkbox.examples';

test.describe(`${labelCheckboxExample.title}`, () => {
  let testEngine: TestEngine<typeof labelCheckboxExample.scene>;
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkbox');
    testEngine = createTestEngine(page, labelCheckboxExample.scene);
  });

  test.afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`apple is checked initially`, async () => {
    const selected = await testEngine.parts.apple.isSelected();
    expect(selected).toBe(true);
  });

  test(`banana is not checked initially`, async () => {
    const selected = await testEngine.parts.banana.isSelected();
    expect(selected).toBe(false);
  });

  test(`switching apple to unchecked should return false upon completion`, async () => {
    await testEngine.parts.apple.setSelected(false);
    const selected = await testEngine.parts.apple.isSelected();
    expect(selected).toBe(false);
  });
});

test.describe(`${iconCheckboxExample.title}`, () => {
  let testEngine: TestEngine<typeof iconCheckboxExample.scene>;
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkbox');
    testEngine = createTestEngine(page, iconCheckboxExample.scene);
  });

  test.afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`favorite is not checked initially`, async () => {
    const selected = await testEngine.parts.favorite.isSelected();
    expect(selected).toBe(false);
  });

  test(`bookmark is not checked initially`, async () => {
    const selected = await testEngine.parts.bookmark.isSelected();
    expect(selected).toBe(false);
  });

  test(`switching favorite to checked should return true upon completion`, async () => {
    await testEngine.parts.favorite.setSelected(true);
    const selected = await testEngine.parts.favorite.isSelected();
    expect(selected).toBe(true);
  });
});

test.describe(`${indeterminateCheckboxExample.title}`, () => {
  let testEngine: TestEngine<typeof indeterminateCheckboxExample.scene>;
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkbox');
    testEngine = createTestEngine(page, indeterminateCheckboxExample.scene);
  });

  test.afterEach(async () => {
    await testEngine.cleanUp();
  });

  test(`parent is checked initially`, async () => {
    const selected = await testEngine.parts.parent.isSelected();
    expect(selected).toBe(false);
  });

  test(`parent is indeterminate initially`, async () => {
    const selected = await testEngine.parts.parent.isIndeterminate();
    expect(selected).toBe(true);
  });

  test.describe(`When checking all the children`, () => {
    test.beforeEach(async () => {
      await testEngine.parts.child1.setSelected(true);
      await testEngine.parts.child2.setSelected(true);
    });

    test(`parent should be checked`, async () => {
      const selected = await testEngine.parts.parent.isSelected();
      expect(selected).toBe(true);
    });

    test(`parent should not be indeterminate`, async () => {
      const selected = await testEngine.parts.parent.isIndeterminate();
      expect(selected).toBe(false);
    });
  });

  test.describe(`When unchecking all the children`, () => {
    test.beforeEach(async () => {
      await testEngine.parts.child1.setSelected(false);
      await testEngine.parts.child2.setSelected(false);
    });

    test(`parent should not be checked`, async () => {
      const selected = await testEngine.parts.parent.isSelected();
      expect(selected).toBe(false);
    });

    // eslint-disable-next-line jest/no-identical-title
    test(`parent should not be indeterminate`, async () => {
      const selected = await testEngine.parts.parent.isIndeterminate();
      expect(selected).toBe(false);
    });
  });

  test.describe('When checking parent', () => {
    test.beforeEach(async () => {
      await testEngine.parts.parent.setSelected(true);
    });

    // eslint-disable-next-line jest/no-identical-title
    test(`parent should not be indeterminate`, async () => {
      const selected = await testEngine.parts.child1.isIndeterminate();
      expect(selected).toBe(false);
    });

    test(`child1 should be checked`, async () => {
      const selected = await testEngine.parts.child1.isSelected();
      expect(selected).toBe(true);
    });

    test(`child2 should be checked`, async () => {
      const selected = await testEngine.parts.child2.isSelected();
      expect(selected).toBe(true);
    });
  });

  test.describe('When unchecking parent', () => {
    test.beforeEach(async () => {
      await testEngine.parts.parent.setSelected(false);
    });

    // eslint-disable-next-line jest/no-identical-title
    test(`parent should not be indeterminate`, async () => {
      const selected = await testEngine.parts.child1.isIndeterminate();
      expect(selected).toBe(false);
    });

    test(`child1 should not be checked`, async () => {
      const selected = await testEngine.parts.child1.isSelected();
      expect(selected).toBe(false);
    });

    test(`child2 should not be checked`, async () => {
      const selected = await testEngine.parts.child2.isSelected();
      expect(selected).toBe(false);
    });
  });
});
