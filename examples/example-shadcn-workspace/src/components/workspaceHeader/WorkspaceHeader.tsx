import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { WorkspaceHeaderDataTestId as T } from './WorkspaceHeaderDataTestId';

/**
 * The page header: title + a visible session-status line + an "Account"
 * `DropdownMenu`. Selecting a menu item updates the status line (plain React
 * state, no backend), so both test runners can assert the selection landed.
 * The separator between the two items is deliberate: it exercises the driver's
 * separator-skipping item enumeration (`getMenuItemCount()` must still say 2).
 */
export function WorkspaceHeader() {
  const [status, setStatus] = useState('Signed in as Ada Lovelace');

  return (
    <header data-testid={T.root} className='border-b'>
      <div className='mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-4'>
        <div>
          <h1 className='font-heading text-lg font-semibold'>Workspace settings</h1>
          <p data-testid={T.accountStatus} className='text-sm text-muted-foreground'>
            {status}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' data-testid={T.accountTrigger}>
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' data-testid={T.accountMenu}>
            <DropdownMenuItem onSelect={() => setStatus('Viewing profile')}>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onSelect={() => setStatus('Signed out')}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
