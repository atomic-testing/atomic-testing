import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

import { type Ticket } from '../../models/Ticket';
import { RowMenuAction, TicketGridDataTestId } from './TicketGridDataTestId';

export interface TicketGridProps {
  'data-testid'?: string;
  rows: readonly Ticket[];
  onOpen: (ticketId: number) => void;
  onAssignToMe: (ticketId: number) => void;
  onClose: (ticketId: number) => void;
}

interface MenuState {
  anchorEl: HTMLElement;
  ticketId: number;
}

export function TicketGrid({ rows, onOpen, onAssignToMe, onClose, ...rest }: TicketGridProps) {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const closeMenu = () => setMenu(null);
  const runAndClose = (fn: (id: number) => void) => () => {
    if (menu != null) {
      fn(menu.ticketId);
    }
    closeMenu();
  };

  const columns: GridColDef<Ticket>[] = [
    { field: 'id', headerName: '#', width: 70 },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      // A button (not row-click) makes opening a row a plain, deterministic click in every engine.
      renderCell: params => (
        <Link component='button' type='button' underline='hover' onClick={() => onOpen(params.row.id)}>
          {params.row.title}
        </Link>
      ),
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      width: 120,
      valueGetter: (value: Ticket['assignee']) => value ?? '—',
    },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'priority', headerName: 'Priority', width: 110 },
    { field: 'due', headerName: 'Due', width: 130 },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <IconButton
          aria-label={`Actions for ticket ${params.row.id}`}
          size='small'
          onClick={event => setMenu({ anchorEl: event.currentTarget, ticketId: params.row.id })}>
          <MoreVertIcon fontSize='small' />
        </IconButton>
      ),
    },
  ];

  return (
    <div data-testid={rest['data-testid'] ?? TicketGridDataTestId.root}>
      <div data-testid={TicketGridDataTestId.count}>{rows.length} tickets</div>
      <div style={{ height: 460, width: '100%' }}>
        <DataGrid
          rows={rows as Ticket[]}
          columns={columns}
          getRowId={row => row.id}
          disableColumnMenu
          // The seed is small; a page large enough to hold it keeps row counts pagination-free, and
          // disabling virtualization makes every row render in jsdom (no layout) exactly as it does
          // in a real browser — so DOM and E2E read the same getRowCount.
          disableVirtualization
          initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
          pageSizeOptions={[25, 50]}
        />
      </div>

      <Menu
        data-testid={TicketGridDataTestId.rowMenu}
        anchorEl={menu?.anchorEl ?? null}
        open={menu != null}
        onClose={closeMenu}>
        <MenuItem onClick={runAndClose(onOpen)}>{RowMenuAction.edit}</MenuItem>
        <MenuItem onClick={runAndClose(onAssignToMe)}>{RowMenuAction.assignToMe}</MenuItem>
        <MenuItem onClick={runAndClose(onClose)}>{RowMenuAction.close}</MenuItem>
      </Menu>
    </div>
  );
}
