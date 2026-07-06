import { ComboboxDriver, MenuItemNotFoundErrorId } from '@atomic-testing/component-driver-radix-v1';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { comboboxUIExample } from './Combobox.examples';

export const comboboxExampleScenePart = {
  // ComboboxDriver extends PopoverDriver, so it is anchored at the TRIGGER and
  // derives the portalled panel from the trigger's aria-controls at call time —
  // per-instance safe, which the fruit/framework cross-talk tests below prove.
  framework: {
    locator: byDataTestId('framework-combobox'),
    driver: ComboboxDriver,
  },
  fruit: {
    locator: byDataTestId('fruit-combobox'),
    driver: ComboboxDriver,
  },
} satisfies ScenePart;

export const comboboxExample: IExampleUnit<typeof comboboxExampleScenePart, JSX.Element> = {
  ...comboboxUIExample,
  scene: comboboxExampleScenePart,
};

export const comboboxExampleTestSuite: TestSuiteInfo<typeof comboboxExample.scene> = {
  title: 'Radix Popover + cmdk Combobox',
  url: '/combobox',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${comboboxExample.title}`, () => {
      const engine = useTestEngine(comboboxExampleScenePart, getTestEngine, { beforeEach, afterEach });

      test('is closed initially and shows the placeholder', async () => {
        assertFalse(await engine().parts.framework.isOpen());
        assertEqual(await engine().parts.framework.getSelectedLabel(), 'Select framework...');
      });

      test('open() mounts the panel with all options', async () => {
        await engine().parts.framework.open();
        await engine().parts.framework.waitForOpen();
        assertTrue(await engine().parts.framework.isOpen());
        assertEqual(await engine().parts.framework.getOptionCount(), 5);
        assertEqual(await engine().parts.framework.getOptionValues(), [
          'Next.js',
          'SvelteKit',
          'Nuxt.js',
          'Remix',
          'Astro',
        ]);
      });

      test('setFilter narrows the mounted options (cmdk unmounts non-matches)', async () => {
        await engine().parts.framework.setFilter('nu');
        assertEqual(await engine().parts.framework.getFilterText(), 'nu');
        assertEqual(await engine().parts.framework.getOptionValues(), ['Nuxt.js']);
        assertFalse(await engine().parts.framework.isEmpty());
      });

      test('a filter matching nothing mounts Command.Empty', async () => {
        await engine().parts.framework.setFilter('zzz');
        assertEqual(await engine().parts.framework.getOptionCount(), 0);
        assertTrue(await engine().parts.framework.isEmpty());
        // clearing the filter restores the full list
        await engine().parts.framework.setFilter('');
        assertEqual(await engine().parts.framework.getOptionCount(), 5);
        assertFalse(await engine().parts.framework.isEmpty());
      });

      test('selectByValue clicks the option, closes the panel and updates the trigger', async () => {
        await engine().parts.framework.selectByValue('Remix');
        await engine().parts.framework.waitForClose();
        assertFalse(await engine().parts.framework.isOpen());
        assertEqual(await engine().parts.framework.getSelectedLabel(), 'Remix');
      });

      test('selectByLabel matches by visible text', async () => {
        await engine().parts.framework.selectByLabel('Astro');
        await engine().parts.framework.waitForClose();
        assertEqual(await engine().parts.framework.getSelectedLabel(), 'Astro');
      });

      test('selectByValue throws MenuItemNotFoundError for an unknown value', async () => {
        let thrownName: string | undefined;
        try {
          await engine().parts.framework.selectByValue('does-not-exist');
        } catch (error) {
          thrownName = (error as Error).name;
        }
        assertEqual(thrownName, MenuItemNotFoundErrorId);
      });

      test('keyboard highlight moves with highlightNext/highlightPrevious and Enter selects', async () => {
        await engine().parts.framework.open();
        await engine().parts.framework.waitForOpen();
        // cmdk highlights the first option on open
        assertEqual(await engine().parts.framework.getHighlightedValue(), 'Next.js');
        await engine().parts.framework.highlightNext();
        assertEqual(await engine().parts.framework.getHighlightedValue(), 'SvelteKit');
        await engine().parts.framework.highlightNext();
        await engine().parts.framework.highlightPrevious();
        assertEqual(await engine().parts.framework.getHighlightedValue(), 'SvelteKit');
        await engine().parts.framework.selectHighlighted();
        await engine().parts.framework.waitForClose();
        assertEqual(await engine().parts.framework.getSelectedLabel(), 'SvelteKit');
      });

      test('pressing Escape closes the panel (inherited PopoverDriver dismissal)', async () => {
        await engine().parts.framework.open();
        await engine().parts.framework.waitForOpen();
        const closed = await engine().parts.framework.closeByEscape();
        assertTrue(closed);
        assertFalse(await engine().parts.framework.isOpen());
      });

      test('two instances stay independent (trigger-anchored panels never cross-talk)', async () => {
        assertEqual(await engine().parts.fruit.getOptionValues(), ['Apple', 'Banana', 'Cherry']);
        await engine().parts.fruit.selectByValue('Banana');
        await engine().parts.fruit.waitForClose();
        assertEqual(await engine().parts.fruit.getSelectedLabel(), 'Banana');
        // the framework combobox is untouched by the fruit selection
        assertEqual(await engine().parts.framework.getSelectedLabel(), 'Select framework...');
        assertEqual(await engine().parts.framework.getOptionValues(), [
          'Next.js',
          'SvelteKit',
          'Nuxt.js',
          'Remix',
          'Astro',
        ]);
      });
    });
  },
};
