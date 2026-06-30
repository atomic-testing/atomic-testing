import { CommandPalette } from '@astryxdesign/core/CommandPalette';
import { createStaticSource } from '@astryxdesign/core/Typeahead';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

type Item = { id: string; label: string };

const commandSource = createStaticSource<Item>([
  { id: 'new', label: 'New File' },
  { id: 'open', label: 'Open File' },
  { id: 'save', label: 'Save' },
]);

const actionSource = createStaticSource<Item>([
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
]);

const CommandsPalette = () => {
  const [open, setOpen] = useState(true);
  return <CommandPalette<Item> isOpen={open} onOpenChange={setOpen} searchSource={commandSource} label='Commands' />;
};

const ActionsPalette = () => {
  // Kept closed: two *modal* <dialog>s can't coexist (the native top-layer makes the
  // lower one inert), so only one palette is open at a time — realistic usage. The
  // closed palette still renders its <dialog> (sans `open`), which exercises the
  // closed-state read and proves the per-`aria-label` anchors are independent.
  const [open, setOpen] = useState(false);
  return <CommandPalette<Item> isOpen={open} onOpenChange={setOpen} searchSource={actionSource} label='Actions' />;
};

/**
 * Astryx CommandPalette scene.
 *
 * CommandPalette renders a native `<dialog>` (controlled by `isOpen`) that does not
 * forward `data-testid`, so the scene anchors each palette by its `aria-label`. One
 * palette is open and one closed — the distinct anchors verify selector scoping
 * without stacking two inert-making modals.
 */
export const CommandPaletteExample = () => (
  <>
    <CommandsPalette />
    <ActionsPalette />
  </>
);

export const commandPaletteUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx CommandPalette',
  ui: <CommandPaletteExample />,
};
