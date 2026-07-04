import { IExampleUIUnit } from '@atomic-testing/core';
import { Command } from 'cmdk';
import { Popover } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * The canonical shadcn/ui "Combobox" composition (https://ui.shadcn.com/docs/components/combobox):
 * a Radix `Popover` whose content hosts a cmdk `Command` palette. This is a
 * composition pattern, not a Radix primitive — the trigger is a plain
 * `Popover.Trigger` given `role="combobox"` by the consumer (shadcn does the
 * same), and all filtering/keyboard-navigation behavior inside the panel is
 * cmdk's, not Radix's. Selection state lives in consumer React state rendered
 * into the trigger's text, exactly as shadcn's recipe keeps it.
 */
const Combobox: React.FC<{ testId: string; placeholder: string; options: string[] }> = ({
  testId,
  placeholder,
  options,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger data-testid={testId} role='combobox' aria-expanded={open}>
        {value === '' ? placeholder : value}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content style={{ backgroundColor: 'white', border: '1px solid #888', padding: 8 }}>
          <Command>
            <Command.Input placeholder={placeholder} />
            <Command.List>
              <Command.Empty>Nothing found.</Command.Empty>
              {options.map(option => (
                <Command.Item
                  key={option}
                  value={option}
                  onSelect={selected => {
                    setValue(selected === value ? '' : selected);
                    setOpen(false);
                  }}>
                  {option}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];
const fruits = ['Apple', 'Banana', 'Cherry'];

/** Two independent instances so the suite can prove per-instance anchoring (no cross-talk). */
export const ComboboxExample = () => (
  <div>
    <Combobox testId='framework-combobox' placeholder='Select framework...' options={frameworks} />
    <Combobox testId='fruit-combobox' placeholder='Select fruit...' options={fruits} />
  </div>
);

export const comboboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Popover + cmdk Combobox',
  ui: <ComboboxExample />,
};
