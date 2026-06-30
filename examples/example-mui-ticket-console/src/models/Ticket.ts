// Domain model for the ticket triage console. All state is client-side; the seed is deterministic
// (see src/data) so the DOM and E2E assertions are identical and stable.

export const STATUSES = ['Open', 'In Progress', 'Blocked', 'Closed'] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;
export type Priority = (typeof PRIORITIES)[number];

// The signed-in user is "Me"; the "Mine" tab and "Assign to me" action key off this exact label.
export const CURRENT_USER = 'Me';
export const ASSIGNEES = [CURRENT_USER, 'Ana', 'Bo', 'Mia'] as const;
export type Assignee = (typeof ASSIGNEES)[number];

export interface Ticket {
  readonly id: number;
  readonly title: string;
  /** `null` means unassigned. */
  readonly assignee: Assignee | null;
  readonly status: Status;
  readonly priority: Priority;
  /** Due date as a `yyyy-mm-dd` calendar date (no time / timezone). */
  readonly due: string;
  readonly labels: readonly string[];
  readonly watching: boolean;
  /** Id of the queue (tree leaf) this ticket belongs to. */
  readonly queueId: string;
}

// The editable subset of a ticket, as the editor dialog reads/writes it.
export interface TicketEdit {
  readonly title: string;
  readonly status: Status;
  readonly priority: Priority;
  readonly assignee: Assignee | null;
  readonly due: string;
  readonly labels: readonly string[];
  readonly watching: boolean;
}

export function toEdit(ticket: Ticket): TicketEdit {
  const { title, status, priority, assignee, due, labels, watching } = ticket;
  return { title, status, priority, assignee, due, labels, watching };
}
