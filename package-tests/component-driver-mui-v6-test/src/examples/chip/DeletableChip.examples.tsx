import React, { useCallback } from 'react';
import { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const names: string[] = ['Jack', 'Lucy', 'Maria'];

//#region Chip
export const DeletableChip: React.FunctionComponent = () => {
  const [choices, setChoices] = React.useState<ReadonlySet<string>>(new Set(names));

  const onDelete = useCallback(
    (name: string) => {
      const newChoices = new Set(choices);
      newChoices.delete(name);
      setChoices(newChoices);
    },
    [choices]
  );

  return (
    <Stack direction={'column'} gap={1}>
      <Stack direction={'row'} gap={0.5}>
        {Array.from(choices).map(name => (
          <Chip key={name} label={name} onDelete={() => onDelete(name)} data-testid={`deletable-${name}`} />
        ))}
      </Stack>
    </Stack>
  );
};

/**
 * Deletable Chip example from MUI's website
 * @see https://mui.com/material-ui/react-chip#description
 */
export const deletableChipUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Deletable Chip',
  ui: <DeletableChip />,
};
//#endregion
