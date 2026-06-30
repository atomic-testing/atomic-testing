export const TicketGridDataTestId = {
  root: 'ticket-grid',
  count: 'ticket-count',
  rowMenu: 'ticket-row-menu',
} as const;

// The per-row action menu items (also the labels the MenuDriver selects by).
export const RowMenuAction = {
  edit: 'Edit',
  assignToMe: 'Assign to me',
  close: 'Close ticket',
} as const;
