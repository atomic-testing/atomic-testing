import type { Ticket } from '../models/Ticket';

// The team -> queue sidebar tree. `itemId`s are stable handles the TeamNav driver targets.
export interface Queue {
  readonly id: string;
  readonly label: string;
}
export interface Team {
  readonly id: string;
  readonly label: string;
  readonly queues: readonly Queue[];
}

export const TEAMS: readonly Team[] = [
  {
    id: 'web',
    label: 'Web',
    queues: [
      { id: 'web-bugs', label: 'Bugs' },
      { id: 'web-features', label: 'Features' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    queues: [
      { id: 'mobile-crashes', label: 'Crashes' },
      // Intentionally empty, to exercise the grid's no-rows empty state.
      { id: 'mobile-triage', label: 'Triage' },
    ],
  },
];

// Deterministic ticket fixture. Due dates are positioned relative to TODAY (2026-06-15, a Monday):
// some inside that week, some overdue, some in the future — so the "Due this week" and "Overdue"
// views have a known, stable membership.
export const TICKETS: readonly Ticket[] = [
  {
    id: 12,
    title: 'Login fails on Safari',
    assignee: 'Ana',
    status: 'Open',
    priority: 'High',
    due: '2026-06-16',
    labels: ['auth'],
    watching: false,
    queueId: 'web-bugs',
  },
  {
    id: 13,
    title: 'Crash on file upload',
    assignee: 'Bo',
    status: 'Open',
    priority: 'Urgent',
    due: '2026-06-18',
    labels: ['crash'],
    watching: true,
    queueId: 'web-bugs',
  },
  {
    id: 14,
    title: 'Slow dashboard load',
    assignee: null,
    status: 'In Progress',
    priority: 'Medium',
    due: '2026-06-17',
    labels: ['perf'],
    watching: false,
    queueId: 'web-bugs',
  },
  {
    id: 15,
    title: 'Typo in footer',
    assignee: 'Mia',
    status: 'Open',
    priority: 'Low',
    due: '2026-06-10',
    labels: ['ui'],
    watching: false,
    queueId: 'web-bugs',
  },
  {
    id: 16,
    title: 'Broken pricing link',
    assignee: 'Ana',
    status: 'Closed',
    priority: 'Low',
    due: '2026-06-05',
    labels: [],
    watching: false,
    queueId: 'web-bugs',
  },
  {
    id: 17,
    title: 'Dark mode toggle',
    assignee: 'Bo',
    status: 'Open',
    priority: 'Medium',
    due: '2026-06-20',
    labels: ['ui'],
    watching: false,
    queueId: 'web-features',
  },
  {
    id: 18,
    title: 'Export to CSV',
    assignee: 'Me',
    status: 'In Progress',
    priority: 'High',
    due: '2026-06-25',
    labels: ['export'],
    watching: true,
    queueId: 'web-features',
  },
  {
    id: 19,
    title: 'Bulk edit tickets',
    assignee: 'Me',
    status: 'Open',
    priority: 'Medium',
    due: '2026-06-12',
    labels: [],
    watching: false,
    queueId: 'web-features',
  },
  {
    id: 20,
    title: 'ANR on cold start',
    assignee: 'Ana',
    status: 'Blocked',
    priority: 'Urgent',
    due: '2026-06-19',
    labels: ['crash'],
    watching: false,
    queueId: 'mobile-crashes',
  },
  {
    id: 21,
    title: 'Memory leak in feed',
    assignee: null,
    status: 'Open',
    priority: 'High',
    due: '2026-06-30',
    labels: ['perf'],
    watching: false,
    queueId: 'mobile-crashes',
  },
  {
    id: 22,
    title: 'Push token refresh error',
    assignee: 'Me',
    status: 'Open',
    priority: 'Medium',
    due: '2026-06-14',
    labels: ['push'],
    watching: false,
    queueId: 'mobile-crashes',
  },
];
