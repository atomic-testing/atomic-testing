import { IExampleUIUnit } from '@atomic-testing/core';
import {
  FluentProvider,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  TagPickerProps,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

const fruitOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

interface TagPickerInstanceProps {
  testIdPrefix: string;
  options: string[];
  defaultSelected?: string[];
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  /**
   * Pins the list permanently open (`open` without a state-updating
   * `onOpenChange`, so `useControllableState` treats `open` as fully
   * controlled) — the same technique `Combobox.examples.tsx` documents for
   * its own `pair-a`/`pair-b` instances: Fluent's picker closes any OTHER
   * open instance on outside interaction, so two default/uncontrolled
   * instances can never be observed open at the same time via sequential
   * clicks. Pinning both open lets the two-instance disambiguation test
   * prove the portalled-list locator is scoped per instance.
   */
  pinOpen?: boolean;
}

const TagPickerInstance = ({
  testIdPrefix,
  options,
  defaultSelected = [],
  disabled,
  required,
  invalid,
  pinOpen,
}: TagPickerInstanceProps) => {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(defaultSelected);
  const onOptionSelect: TagPickerProps['onOptionSelect'] = (_e, data) => {
    setSelectedOptions(data.selectedOptions);
  };

  return (
    <TagPicker
      onOptionSelect={onOptionSelect}
      selectedOptions={selectedOptions}
      disabled={disabled}
      {...(pinOpen ? { open: true, onOpenChange: () => {} } : {})}>
      <TagPickerControl data-testid={`${testIdPrefix}-control`}>
        <TagPickerGroup>
          {selectedOptions.map(option => (
            <Tag key={option} value={option}>
              {option}
            </Tag>
          ))}
        </TagPickerGroup>
        <TagPickerInput
          data-testid={`${testIdPrefix}-input`}
          required={required}
          aria-invalid={invalid ? 'true' : undefined}
        />
      </TagPickerControl>
      <TagPickerList>
        {options
          .filter(option => !selectedOptions.includes(option))
          .map(option => (
            <TagPickerOption value={option} key={option}>
              {option}
            </TagPickerOption>
          ))}
      </TagPickerList>
    </TagPicker>
  );
};

export const TagPickerExample = () => (
  <FluentProvider theme={webLightTheme}>
    <TagPickerInstance testIdPrefix='tagpicker-one' options={fruitOptions} defaultSelected={['Apple', 'Banana']} />
    <TagPickerInstance testIdPrefix='tagpicker-empty' options={fruitOptions} />
    <TagPickerInstance testIdPrefix='tagpicker-disabled' options={fruitOptions} disabled defaultSelected={['Apple']} />
    <TagPickerInstance testIdPrefix='tagpicker-required' options={fruitOptions} required invalid />
    <TagPickerInstance
      testIdPrefix='tagpicker-pair-a'
      options={['Alpha', 'Beta']}
      defaultSelected={['Alpha']}
      pinOpen
    />
    <TagPickerInstance
      testIdPrefix='tagpicker-pair-b'
      options={['Gamma', 'Delta', 'Epsilon']}
      defaultSelected={['Gamma']}
      pinOpen
    />
  </FluentProvider>
);

export const tagPickerUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent TagPicker',
  ui: <TagPickerExample />,
};
