import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState } from 'react';

import { parseCalendarDate, TODAY, toIso } from '../../data/today';
import {
  ASSIGNEES,
  type Assignee,
  PRIORITIES,
  type Priority,
  STATUSES,
  type Status,
  type Ticket,
  type TicketEdit,
  toEdit,
} from '../../models/Ticket';
import { labelChipTestId, TicketEditorDataTestId as TID } from './TicketEditorDataTestId';

export interface TicketEditorProps {
  'data-testid'?: string;
  ticket: Ticket | null;
  onSave: (edit: TicketEdit) => void;
  onCancel: () => void;
}

// The editor dialog. Open state is driven by `ticket` (open when non-null); the inner form is keyed
// by ticket id so its draft state resets cleanly each time a different ticket is opened.
export function TicketEditor({ ticket, onSave, onCancel, ...rest }: TicketEditorProps) {
  return (
    <Dialog
      data-testid={rest['data-testid'] ?? TID.root}
      open={ticket != null}
      onClose={onCancel}
      fullWidth
      maxWidth='sm'>
      {ticket != null && <TicketEditorForm key={ticket.id} ticket={ticket} onSave={onSave} onCancel={onCancel} />}
    </Dialog>
  );
}

function TicketEditorForm({
  ticket,
  onSave,
  onCancel,
}: {
  ticket: Ticket;
  onSave: (edit: TicketEdit) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<TicketEdit>(() => toEdit(ticket));
  const [titleError, setTitleError] = useState<string | undefined>(undefined);

  const patch = (partial: Partial<TicketEdit>) => setDraft(prev => ({ ...prev, ...partial }));

  const save = () => {
    if (draft.title.trim().length === 0) {
      setTitleError('Title is required');
      return;
    }
    onSave(draft);
  };

  return (
    <>
      <DialogTitle>Edit ticket #{ticket.id}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            data-testid={TID.title}
            label='Title'
            value={draft.title}
            error={titleError != null}
            helperText={titleError}
            onChange={event => {
              patch({ title: event.target.value });
              setTitleError(undefined);
            }}
          />

          <FormControl fullWidth>
            <InputLabel id='editor-status-label'>Status</InputLabel>
            <Select
              data-testid={TID.status}
              labelId='editor-status-label'
              label='Status'
              value={draft.status}
              onChange={event => patch({ status: event.target.value as Status })}>
              {STATUSES.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id='editor-priority-label'>Priority</InputLabel>
            <Select
              data-testid={TID.priority}
              labelId='editor-priority-label'
              label='Priority'
              value={draft.priority}
              onChange={event => patch({ priority: event.target.value as Priority })}>
              {PRIORITIES.map(priority => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            data-testid={TID.assignee}
            options={ASSIGNEES as readonly Assignee[]}
            value={draft.assignee}
            onChange={(_event, value) => patch({ assignee: value })}
            renderInput={params => <TextField {...params} label='Assignee' />}
          />

          <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap' }}>
            {draft.labels.map(label => (
              <Chip
                key={label}
                data-testid={labelChipTestId(label)}
                label={label}
                onDelete={() => patch({ labels: draft.labels.filter(other => other !== label) })}
              />
            ))}
          </Stack>

          <FormControlLabel
            control={
              <Switch
                data-testid={TID.watching}
                checked={draft.watching}
                onChange={event => patch({ watching: event.target.checked })}
              />
            }
            label='Watching'
          />

          <div data-testid={TID.due}>
            <DesktopDatePicker
              label='Due'
              referenceDate={parseCalendarDate(TODAY)}
              value={parseCalendarDate(draft.due)}
              onChange={date => date != null && patch({ due: toIso(date) })}
            />
          </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button data-testid={TID.cancel} onClick={onCancel}>
          Cancel
        </Button>
        <Button data-testid={TID.save} variant='contained' onClick={save}>
          Save
        </Button>
      </DialogActions>
    </>
  );
}
