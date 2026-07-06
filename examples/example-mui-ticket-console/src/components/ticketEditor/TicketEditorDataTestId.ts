export const TicketEditorDataTestId = {
  root: 'ticket-editor',
  title: 'editor-title',
  status: 'editor-status',
  priority: 'editor-priority',
  assignee: 'editor-assignee',
  watching: 'editor-watching',
  due: 'editor-due',
  save: 'editor-save',
  cancel: 'editor-cancel',
} as const;

export const labelChipTestId = (label: string): string => `editor-label-${label}`;
