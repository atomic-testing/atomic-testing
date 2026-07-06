import {
  ChatComposer,
  ChatLayout,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageList,
  ChatSystemMessage,
  ChatToolCalls,
} from '@astryxdesign/core/Chat';
import { Selector } from '@astryxdesign/core/Selector';
import { Stack } from '@astryxdesign/core/Stack';

import { AppDataTestId } from '../../AppDataTestId';
import { useChatSession } from '../../hooks/ChatSessionProvider';
import { MODEL_OPTIONS } from '../../models/SettingsModel';
import { ChatPanelDataTestId } from './ChatPanelDataTestId';

/**
 * The chat section: a header with the model picker, then the Astryx ChatLayout — a
 * scrolling message log with a docked composer. Sending routes through the shared
 * chat session, which appends the user's message plus a deterministic assistant reply
 * carrying a tool-call group.
 */
export function ChatPanel() {
  const { messages, model, send, selectModel } = useChatSession();
  const lastIndex = messages.length - 1;

  return (
    <Stack as='section' data-testid={AppDataTestId.chatSection} gap={3} height='100%'>
      <header data-testid={ChatPanelDataTestId.header}>
        <Selector
          data-testid={ChatPanelDataTestId.modelSelector}
          label='Model'
          value={model}
          onChange={selectModel}
          options={[...MODEL_OPTIONS]}
          width={240}
        />
      </header>
      <ChatLayout
        data-testid={ChatPanelDataTestId.layout}
        density='balanced'
        composer={
          <ChatComposer data-testid={ChatPanelDataTestId.composer} placeholder='Type a message…' onSubmit={send} />
        }>
        <ChatMessageList
          data-testid={ChatPanelDataTestId.messageList}
          density='balanced'
          emptyState={<div data-testid={ChatPanelDataTestId.listEmptyState}>No messages yet — say hello 👋</div>}>
          {messages.length > 0 && <ChatSystemMessage variant='divider'>Today</ChatSystemMessage>}
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              sender={message.sender}
              name={message.sender === 'user' ? 'You' : 'Assistant'}>
              <ChatMessageBubble>{message.text}</ChatMessageBubble>
              {message.toolCalls != null && (
                <ChatToolCalls
                  data-testid={index === lastIndex ? ChatPanelDataTestId.toolCalls : undefined}
                  calls={message.toolCalls}
                />
              )}
            </ChatMessage>
          ))}
        </ChatMessageList>
      </ChatLayout>
    </Stack>
  );
}
