import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import { HasDataTestId } from '../../models/types';

export interface LineItemProps extends HasDataTestId {
  label: string;
  value: string;
  onClick?: () => void;
  noDivider?: boolean;
}

export const LineItemDataTestId = {
  name: 'name',
  value: 'value',
} as const;

export function LineItem(props: LineItemProps) {
  const { label, value, onClick, noDivider = false } = props;

  return (
    <>
      <ListItem
        data-testid={props['data-testid']}
        disablePadding
        secondaryAction={<span data-testid={LineItemDataTestId.name}>{value}</span>}>
        <ListItemButton onClick={onClick}>
          <span data-testid={LineItemDataTestId.name}>{label}</span>
        </ListItemButton>
      </ListItem>
      {noDivider ? null : <Divider />}
    </>
  );
}
