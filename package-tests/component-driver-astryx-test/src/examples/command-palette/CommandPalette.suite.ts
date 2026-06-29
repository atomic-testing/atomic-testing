import { CommandPaletteDriver } from '@atomic-testing/component-driver-astryx';
import { byCssSelector, IExampleUnit, ScenePart } from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

import { skipInteractionOnWebkit, useBrowserName } from '../../webkitGate';
import { commandPaletteUIExample } from './CommandPalette.examples';

export const commandPaletteExampleScenePart = {
  commands: {
    locator: byCssSelector('dialog[aria-label="Commands"]', 'Root'),
    driver: CommandPaletteDriver,
  },
  actions: {
    locator: byCssSelector('dialog[aria-label="Actions"]', 'Root'),
    driver: CommandPaletteDriver,
  },
} satisfies ScenePart;

export const commandPaletteExample: IExampleUnit<typeof commandPaletteExampleScenePart, JSX.Element> = {
  ...commandPaletteUIExample,
  scene: commandPaletteExampleScenePart,
};

export const commandPaletteExampleTestSuite: TestSuiteInfo<typeof commandPaletteExample.scene> = {
  title: 'Astryx CommandPalette',
  url: '/command-palette',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    describe(`${commandPaletteExample.title}`, () => {
      const engine = useTestEngine(commandPaletteExample.scene, getTestEngine, { beforeEach, afterEach });
      const browser = useBrowserName(beforeEach);

      // isOpen reads each native <dialog>'s open attribute; the two anchors are independent.
      test(`reads the open state`, async () => {
        assertTrue(await engine().parts.commands.isOpen());
        assertFalse(await engine().parts.actions.isOpen());
      });

      // search runs the async query; getOptionLabels waits for results; getOptionValue reads data-value.
      test(`search lists options and reads values`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.commands.search('File');
        const labels = await engine().parts.commands.getOptionLabels();
        assertTrue(labels.includes('New File'));
        assertTrue(labels.includes('Open File'));
        assertFalse(labels.includes('Save'));
        assertEqual(await engine().parts.commands.getOptionValue('New File'), 'new');
      });

      // Searching the open palette does not leak into the closed one (distinct anchors).
      test(`scopes results to the open palette`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.commands.search('File');
        assertTrue((await engine().parts.commands.getOptionLabels()).includes('New File'));
        assertFalse(await engine().parts.actions.isOpen());
      });

      // selectByLabel picks a result; an unknown label returns false.
      test(`selectByLabel picks a command`, async () => {
        if (skipInteractionOnWebkit(test, browser())) return;
        await engine().parts.commands.search('Save');
        assertFalse(await engine().parts.commands.selectByLabel('Nope'));
        assertTrue(await engine().parts.commands.selectByLabel('Save'));
      });
    });
  },
};
