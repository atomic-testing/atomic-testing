import { IExampleUIUnit } from '@atomic-testing/core';
import { Card, CardFooter, CardHeader, CardPreview, FluentProvider, webLightTheme } from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

const SelectableCard = ({ testId, disabled }: { testId: string; disabled?: boolean }) => {
  const [selected, setSelected] = useState(false);
  return (
    <Card
      data-testid={testId}
      selected={selected}
      disabled={disabled}
      onSelectionChange={(_event, data) => setSelected(data.selected)}>
      Selectable card
    </Card>
  );
};

export const CardExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Card data-testid='card-plain'>
      <CardHeader header='Header text' description='Description text' />
      <CardPreview>
        <div>preview content</div>
      </CardPreview>
      <CardFooter>Footer text</CardFooter>
    </Card>
    <SelectableCard testId='card-selectable' />
    <SelectableCard testId='card-disabled' disabled />
  </FluentProvider>
);

export const cardUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Card',
  ui: <CardExample />,
};
