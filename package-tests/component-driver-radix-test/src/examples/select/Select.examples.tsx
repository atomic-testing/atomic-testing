import { IExampleUIUnit } from '@atomic-testing/core';
import { Label, Select } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Select audit scene (Wave 0 #923 accname evaluation; no driver yet).
 * The trigger's accessible name is COMPUTED — an `aria-labelledby` chain over
 * the associated Label and the rendered value — which is exactly the case the
 * verbatim-`aria-label` locator stopgap cannot match.
 */
export const SelectExample = () => (
  <div>
    <Label.Root htmlFor='fruit-select' data-testid='select-label'>
      Favorite fruit
    </Label.Root>
    <Select.Root defaultValue='apple'>
      <Select.Trigger id='fruit-select' data-testid='select-trigger'>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content data-testid='select-content' style={{ backgroundColor: 'white', border: '1px solid #888' }}>
          <Select.Viewport>
            <Select.Item value='apple' data-testid='select-item-apple'>
              <Select.ItemText>Apple</Select.ItemText>
              <Select.ItemIndicator>✓</Select.ItemIndicator>
            </Select.Item>
            <Select.Item value='banana' data-testid='select-item-banana'>
              <Select.ItemText>Banana</Select.ItemText>
              <Select.ItemIndicator>✓</Select.ItemIndicator>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
);

export const selectUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Select',
  ui: <SelectExample />,
};
