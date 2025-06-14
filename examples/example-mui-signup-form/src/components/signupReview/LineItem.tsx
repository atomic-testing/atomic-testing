import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { HasDataTestId } from '../../models/types';

export interface LineItemProps extends HasDataTestId {
  label: string;
  value: string;
  onClick?: () => void;
  noDivider?: boolean;
}

export const LineItemDataTestId = {
  name: 'name',
  value: 'value'
} as const;

export function LineItem(props: LineItemProps) {
  const { label, value, onClick, noDivider = false } = props;

  return (
    <>
      <ListItem data-testid={props['data-testid']}>
        <ListItemButton onClick={onClick}>
          <span data-testid={LineItemDataTestId.name}>{label}</span>
          <ListItemSecondaryAction data-testid={LineItemDataTestId.name}>{value}</ListItemSecondaryAction>
        </ListItemButton>
      </ListItem>
      {noDivider ? null : <Divider />}
    </>
  );
}
