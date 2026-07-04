import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ProfileSettingsDataTestId as T } from './ProfileSettingsDataTestId';

/**
 * Timezone options for the Select. The Radix/shadcn `Select.Item` renders no
 * `data-value` attribute, so the driver identifies options by their VISIBLE
 * LABEL — these labels are what `selectByLabel`/`getSelectedLabel` match.
 */
const TIMEZONES = [
  { value: 'utc', label: 'UTC' },
  { value: 'london', label: 'London' },
  { value: 'new-york', label: 'New York' },
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'sydney', label: 'Sydney' },
];

/**
 * The Profile tab: a display-name `Input`, a timezone `Select`, a Save button
 * that surfaces a visible confirmation line, and a "danger zone" whose
 * destructive delete action is guarded by a confirm `Dialog`. All state is
 * plain, deterministic React state — no backend — so DOM and E2E assertions
 * agree byte-for-byte.
 */
export function ProfileSettings() {
  const [displayName, setDisplayName] = useState('Ada Lovelace');
  const [timezone, setTimezone] = useState('utc');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const save = () => {
    const timezoneLabel = TIMEZONES.find((tz) => tz.value === timezone)?.label ?? timezone;
    setSavedMessage(`Saved — ${displayName} (${timezoneLabel})`);
  };

  const confirmDelete = () => {
    setDeleted(true);
    setConfirmOpen(false);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div data-testid={T.form} className='flex flex-col gap-4 rounded-lg border p-4'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='display-name' className='text-sm font-medium'>
            Display name
          </label>
          <Input
            id='display-name'
            data-testid={T.displayNameInput}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='timezone' className='text-sm font-medium'>
            Timezone
          </label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger id='timezone' data-testid={T.timezoneSelect} className='w-full'>
              <SelectValue placeholder='Pick a timezone' />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-3'>
          <Button data-testid={T.saveButton} onClick={save}>
            Save
          </Button>
          {savedMessage != null && (
            <p data-testid={T.saveStatus} className='text-sm text-muted-foreground'>
              {savedMessage}
            </p>
          )}
        </div>
      </div>

      <div data-testid={T.dangerZone} className='flex items-center justify-between gap-4 rounded-lg border border-destructive/30 p-4'>
        <div>
          <h2 className='text-sm font-medium'>Danger zone</h2>
          <p data-testid={T.workspaceStatus} className='text-sm text-muted-foreground'>
            {deleted ? 'Workspace deleted' : 'Workspace active'}
          </p>
        </div>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button variant='destructive' data-testid={T.deleteTrigger} disabled={deleted}>
              Delete workspace
            </Button>
          </DialogTrigger>
          <DialogContent data-testid={T.deleteDialog}>
            <DialogHeader>
              <DialogTitle>Delete workspace?</DialogTitle>
              <DialogDescription>
                This permanently deletes the workspace and all of its settings. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' data-testid={T.deleteCancel} onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant='destructive' data-testid={T.deleteConfirm} onClick={confirmDelete}>
                Delete workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
