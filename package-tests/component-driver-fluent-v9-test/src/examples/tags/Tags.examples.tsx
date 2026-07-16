import { IExampleUIUnit } from '@atomic-testing/core';
import {
  FluentProvider,
  InteractionTag,
  InteractionTagPrimary,
  InteractionTagSecondary,
  Tag,
  TagGroup,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX, useState } from 'react';

/**
 * Group A/B each mix plain `Tag`s with dismissible `InteractionTag`s and hold
 * their own dismissed-value state — `TagGroup` itself never removes a tag from
 * the DOM on dismiss (that's the consumer's job via `onDismiss`), so exercising
 * `InteractionTagDriver.dismiss()` end-to-end requires this example to actually
 * filter its rendered children, mirroring how a real consumer would wire it up.
 * Group A and Group B carry deliberately different counts/labels so a
 * too-broadly-scoped locator in `TagGroupDriver` (e.g. one that queried the
 * whole document instead of `this.locator`) would be caught immediately.
 */
export const TagsExample = () => {
  const [groupAInteractionValues, setGroupAInteractionValues] = useState(['gamma', 'delta']);
  const [groupBInteractionValues, setGroupBInteractionValues] = useState(['two']);

  return (
    <FluentProvider theme={webLightTheme}>
      <Tag data-testid='tag-labeled'>Labeled Tag</Tag>
      <Tag data-testid='tag-empty' />

      <InteractionTag data-testid='interaction-tag'>
        <InteractionTagPrimary>Interactive Tag</InteractionTagPrimary>
        <InteractionTagSecondary aria-label='Remove Interactive Tag' />
      </InteractionTag>
      <InteractionTag data-testid='interaction-tag-disabled' disabled>
        <InteractionTagPrimary>Disabled Interactive Tag</InteractionTagPrimary>
        <InteractionTagSecondary aria-label='Remove Disabled Interactive Tag' />
      </InteractionTag>

      <TagGroup
        data-testid='group-a'
        onDismiss={(_event, data) => setGroupAInteractionValues(prev => prev.filter(value => value !== data.value))}>
        <Tag value='alpha'>Alpha</Tag>
        <Tag value='beta'>Beta</Tag>
        {groupAInteractionValues.includes('gamma') && (
          <InteractionTag value='gamma'>
            <InteractionTagPrimary>Gamma</InteractionTagPrimary>
            <InteractionTagSecondary aria-label='Remove Gamma' />
          </InteractionTag>
        )}
        {groupAInteractionValues.includes('delta') && (
          <InteractionTag value='delta'>
            <InteractionTagPrimary>Delta</InteractionTagPrimary>
            <InteractionTagSecondary aria-label='Remove Delta' />
          </InteractionTag>
        )}
      </TagGroup>

      <TagGroup
        data-testid='group-b'
        onDismiss={(_event, data) => setGroupBInteractionValues(prev => prev.filter(value => value !== data.value))}>
        <Tag value='one'>One</Tag>
        {groupBInteractionValues.includes('two') && (
          <InteractionTag value='two'>
            <InteractionTagPrimary>Two</InteractionTagPrimary>
            <InteractionTagSecondary aria-label='Remove Two' />
          </InteractionTag>
        )}
      </TagGroup>

      <TagGroup data-testid='group-empty' />
    </FluentProvider>
  );
};

export const tagsUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Tags',
  ui: <TagsExample />,
};
