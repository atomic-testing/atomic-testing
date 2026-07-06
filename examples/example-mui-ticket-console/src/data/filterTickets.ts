import { CURRENT_USER, type Assignee, type Status, type Ticket } from '../models/Ticket';
import { isOverdue, parseCalendarDate } from './today';

export type TabView = 'All' | 'Mine' | 'Overdue';

export interface Filters {
  readonly search: string;
  /** `null` means "any assignee". */
  readonly assignee: Assignee | null;
  /** `null` means "any status". */
  readonly status: Status | null;
  /** Inclusive `yyyy-mm-dd` lower bound, or `null` for unbounded. */
  readonly dueFrom: string | null;
  /** Inclusive `yyyy-mm-dd` upper bound, or `null` for unbounded. */
  readonly dueTo: string | null;
}

export const emptyFilters: Filters = {
  search: '',
  assignee: null,
  status: null,
  dueFrom: null,
  dueTo: null,
};

export interface TicketQuery {
  readonly queueId: string | null;
  readonly filters: Filters;
  readonly tab: TabView;
}

function matchesTab(ticket: Ticket, tab: TabView): boolean {
  switch (tab) {
    case 'Mine':
      return ticket.assignee === CURRENT_USER;
    case 'Overdue':
      return isOverdue(ticket.due) && ticket.status !== 'Closed';
    case 'All':
      return true;
  }
}

function withinDueRange(due: string, from: string | null, to: string | null): boolean {
  const dueMs = parseCalendarDate(due).getTime();
  if (from != null && dueMs < parseCalendarDate(from).getTime()) {
    return false;
  }
  if (to != null && dueMs > parseCalendarDate(to).getTime()) {
    return false;
  }
  return true;
}

// Pure, deterministic projection of the seed tickets for a given sidebar/filter/tab state. Keeping
// it free of component state lets the same logic back both the UI and any reasoning in tests.
export function filterTickets(tickets: readonly Ticket[], query: TicketQuery): Ticket[] {
  const { queueId, filters, tab } = query;
  const needle = filters.search.trim().toLowerCase();
  return tickets.filter(ticket => {
    if (queueId != null && ticket.queueId !== queueId) {
      return false;
    }
    if (needle.length > 0 && !ticket.title.toLowerCase().includes(needle)) {
      return false;
    }
    if (filters.assignee != null && ticket.assignee !== filters.assignee) {
      return false;
    }
    if (filters.status != null && ticket.status !== filters.status) {
      return false;
    }
    if (!withinDueRange(ticket.due, filters.dueFrom, filters.dueTo)) {
      return false;
    }
    return matchesTab(ticket, tab);
  });
}
