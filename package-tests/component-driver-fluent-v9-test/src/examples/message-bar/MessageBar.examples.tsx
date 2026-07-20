import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Button,
  FluentProvider,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarGroup,
  MessageBarTitle,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

export const MessageBarExample = () => (
  <FluentProvider theme={webLightTheme}>
    <MessageBarGroup>
      <MessageBar data-testid='message-bar-titled' intent='warning'>
        <MessageBarBody>
          <MessageBarTitle>Heads up</MessageBarTitle>
          This action cannot be undone.
        </MessageBarBody>
        <MessageBarActions containerAction={<Button data-testid='message-bar-dismiss'>Dismiss</Button>}>
          <Button>Undo</Button>
        </MessageBarActions>
      </MessageBar>
      <MessageBar data-testid='message-bar-untitled' intent='success'>
        <MessageBarBody>Saved successfully.</MessageBarBody>
      </MessageBar>
    </MessageBarGroup>
  </FluentProvider>
);

export const messageBarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent MessageBar',
  ui: <MessageBarExample />,
};
