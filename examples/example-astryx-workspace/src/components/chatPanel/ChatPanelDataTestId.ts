export const ChatPanelDataTestId = {
  header: 'chat-header',
  modelSelector: 'chat-model-selector',
  layout: 'chat-layout',
  messageList: 'chat-message-list',
  listEmptyState: 'chat-empty-state',
  composer: 'chat-composer',
  /** Carried only by the latest assistant reply's tool-call group, so the anchor is unique. */
  toolCalls: 'chat-tool-calls',
} as const;
