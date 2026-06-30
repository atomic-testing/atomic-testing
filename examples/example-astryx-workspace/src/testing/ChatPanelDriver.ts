import {
  ChatComposerDriver,
  ChatLayoutDriver,
  ChatMessageListDriver,
  ChatToolCallsDriver,
  SelectorDriver,
} from '@atomic-testing/component-driver-astryx';
import {
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { ChatPanelDataTestId } from '../components/chatPanel/ChatPanelDataTestId';

export interface ChatMessageView {
  sender: Optional<string>;
  text: Optional<string>;
}

/**
 * Composes the shipped chat drivers (layout, message list, composer, model selector,
 * tool-call group) into a single conversational page object, so a test reads like a
 * person using the chat: `send('…')`, `getLastAssistantText()`, `selectModel('…')`.
 */
const parts = {
  modelSelector: { locator: byDataTestId(ChatPanelDataTestId.modelSelector), driver: SelectorDriver },
  layout: { locator: byDataTestId(ChatPanelDataTestId.layout), driver: ChatLayoutDriver },
  messageList: { locator: byDataTestId(ChatPanelDataTestId.messageList), driver: ChatMessageListDriver },
  composer: { locator: byDataTestId(ChatPanelDataTestId.composer), driver: ChatComposerDriver },
  toolCalls: { locator: byDataTestId(ChatPanelDataTestId.toolCalls), driver: ChatToolCallsDriver },
} satisfies ScenePart;

export class ChatPanelDriver extends ComponentDriver<typeof parts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts });
  }

  /** Whether the composer's send button is enabled (false when the input is empty). */
  async canSend(): Promise<boolean> {
    return this.parts.composer.canSend();
  }

  /** Type a message and send it. */
  async send(text: string): Promise<void> {
    await this.parts.composer.appendValue(text);
    await this.parts.composer.submit();
  }

  async getMessageCount(): Promise<number> {
    return this.parts.messageList.getMessageCount();
  }

  /** Every message as `{ sender, text }`, read through the shipped `ChatMessageDriver`. */
  async getMessages(): Promise<ChatMessageView[]> {
    const count = await this.parts.messageList.getMessageCount();
    const views: ChatMessageView[] = [];
    for (let index = 0; index < count; index++) {
      const message = await this.parts.messageList.getItemByIndex(index);
      if (message == null) {
        continue;
      }
      views.push({ sender: await message.getSender(), text: await message.getBubbleText() });
    }
    return views;
  }

  async getLastAssistantText(): Promise<Optional<string>> {
    const count = await this.parts.messageList.getMessageCount();
    if (count === 0) {
      return undefined;
    }
    const last = await this.parts.messageList.getItemByIndex(count - 1);
    return last?.getBubbleText();
  }

  /** Number of tool calls in the latest assistant reply (0 when none is rendered). */
  async getToolCallCount(): Promise<number> {
    if (!(await this.interactor.exists(this.parts.toolCalls.locator))) {
      return 0;
    }
    return this.parts.toolCalls.getCallCount();
  }

  async selectModel(label: string): Promise<boolean> {
    return this.parts.modelSelector.selectByLabel(label);
  }

  async getSelectedModel(): Promise<Optional<string>> {
    return this.parts.modelSelector.getSelectedLabel();
  }

  get driverName(): string {
    return 'ChatPanelDriver';
  }
}
