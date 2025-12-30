import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const names: string[] = ['Jack', 'Lucy', 'Maria'];

//#region Chip
export const ClickableChip: React.FunctionComponent = () => {
  const [selected, setSelected] = React.useState<string | null>(null);
  return (
    <Stack direction={'column'} gap={1}>
      <Stack direction={'row'} gap={0.5}>
        {names.map(name => (
          <Chip key={name} label={name} onClick={() => setSelected(name)} data-testid={`clickable-${name}`} />
        ))}
      </Stack>
      <Stack direction={'row'} gap={0.5}>
        <span>Selected:</span>
        <span data-testid={'selected'}>{selected}</span>
      </Stack>
    </Stack>
  );
};

/**
 * Clickable Chip example from MUI's website
 * @see https://mui.com/material-ui/react-chip#description
 */
export const clickableChipUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Clickable Chip',
  ui: <ClickableChip />,
};
//#endregion
