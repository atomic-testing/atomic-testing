import { useMemo, useState } from 'react';

import { emptyFilters, type Filters, filterTickets, type TabView } from '../data/filterTickets';
import { TICKETS } from '../data/seed';
import { CURRENT_USER, type Ticket, type TicketEdit } from '../models/Ticket';

// Owns all console state and derives the visible ticket set with the pure `filterTickets`. App and
// the feature components stay presentational; this hook is the single source of truth.
export function useTicketConsole() {
  const [tickets, setTickets] = useState<readonly Ticket[]>(TICKETS);
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [tab, setTab] = useState<TabView>('All');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const visible = useMemo(
    () => filterTickets(tickets, { queueId: selectedQueue, filters, tab }),
    [tickets, selectedQueue, filters, tab]
  );
  const editingTicket = editingId != null ? (tickets.find(ticket => ticket.id === editingId) ?? null) : null;

  const patchTicket = (id: number, partial: Partial<Ticket>, toast: string) => {
    setTickets(prev => prev.map(ticket => (ticket.id === id ? { ...ticket, ...partial } : ticket)));
    setSnackbar(toast);
  };

  return {
    tickets,
    visible,
    selectedQueue,
    filters,
    tab,
    editingTicket,
    snackbar,
    selectQueue: (queueId: string | null) => setSelectedQueue(queueId),
    updateFilters: (next: Filters) => setFilters(next),
    selectTab: (next: TabView) => setTab(next),
    openEditor: (id: number) => setEditingId(id),
    closeEditor: () => setEditingId(null),
    save: (edit: TicketEdit) => {
      const id = editingId;
      if (id != null) {
        patchTicket(id, edit, `Ticket #${id} saved`);
      }
      setEditingId(null);
    },
    assignToMe: (id: number) => patchTicket(id, { assignee: CURRENT_USER }, `Ticket #${id} saved`),
    closeTicket: (id: number) => patchTicket(id, { status: 'Closed' }, `Ticket #${id} saved`),
    dismissSnackbar: () => setSnackbar(null),
  };
}
