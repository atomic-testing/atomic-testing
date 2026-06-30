import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { type Filters } from '../../data/filterTickets';
import { parseCalendarDate, TODAY, toIso } from '../../data/today';
import { ASSIGNEES, type Assignee, STATUSES, type Status } from '../../models/Ticket';
import { FilterBarDataTestId } from './FilterBarDataTestId';

const ANY_STATUS = 'Any status';

// `referenceDate` makes an empty picker open on the seed's month, so date entry is deterministic
// and the calendar never opens on the wall-clock month.
const referenceDate = parseCalendarDate(TODAY);

export interface FilterBarProps {
  'data-testid'?: string;
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange, ...rest }: FilterBarProps) {
  const patch = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  return (
    <Stack
      data-testid={rest['data-testid'] ?? FilterBarDataTestId.root}
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ p: 2, alignItems: { md: 'center' } }}>
      <TextField
        data-testid={FilterBarDataTestId.search}
        label='Search'
        size='small'
        value={filters.search}
        onChange={event => patch({ search: event.target.value })}
      />

      <Autocomplete
        data-testid={FilterBarDataTestId.assignee}
        sx={{ minWidth: 180 }}
        options={ASSIGNEES as readonly Assignee[]}
        value={filters.assignee}
        onChange={(_event, value) => patch({ assignee: value })}
        renderInput={params => <TextField {...params} label='Assignee' size='small' />}
      />

      <FormControl size='small' sx={{ minWidth: 160 }}>
        <InputLabel id='filter-status-label'>Status</InputLabel>
        <Select
          data-testid={FilterBarDataTestId.status}
          labelId='filter-status-label'
          label='Status'
          value={filters.status ?? ''}
          onChange={event => patch({ status: (event.target.value as Status) || null })}>
          <MenuItem value=''>{ANY_STATUS}</MenuItem>
          {STATUSES.map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div data-testid={FilterBarDataTestId.dueFrom}>
        <DesktopDatePicker
          label='Due from'
          slotProps={{ textField: { size: 'small' } }}
          referenceDate={referenceDate}
          value={filters.dueFrom != null ? parseCalendarDate(filters.dueFrom) : null}
          onChange={date => patch({ dueFrom: date != null ? toIso(date) : null })}
        />
      </div>

      <div data-testid={FilterBarDataTestId.dueTo}>
        <DesktopDatePicker
          label='Due to'
          slotProps={{ textField: { size: 'small' } }}
          referenceDate={referenceDate}
          value={filters.dueTo != null ? parseCalendarDate(filters.dueTo) : null}
          onChange={date => patch({ dueTo: date != null ? toIso(date) : null })}
        />
      </div>
    </Stack>
  );
}
