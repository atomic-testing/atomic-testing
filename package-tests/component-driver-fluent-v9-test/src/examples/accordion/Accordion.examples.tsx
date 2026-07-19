import { IExampleUIUnit } from '@atomic-testing/core';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import React, { JSX } from 'react';

/**
 * Two `Accordion`s with deliberately different item counts/labels so a
 * too-broadly-scoped locator in `AccordionDriver` would be caught
 * immediately (same disambiguation shape as the `Tags`/`Menu` examples).
 * Accordion A is `multiple` with its first item open by default and a
 * disabled third item; Accordion B is single-open (the default) and starts
 * fully collapsed — both uncontrolled via `defaultOpenItems`, so a driven
 * `expand()`/`collapse()` click is read straight back off the DOM. Both set
 * `collapsible` — verified against Fluent's own `updateOpenItems` source:
 * with the default `collapsible={false}`, clicking the ONLY open item's
 * header is a silent no-op (Fluent refuses to reach zero open items), which
 * would otherwise make `AccordionItemDriver.collapse()` look broken when the
 * component itself is simply refusing the toggle.
 */
const AccordionExample = () => (
  <FluentProvider theme={webLightTheme}>
    <Accordion data-testid='accordion-a' multiple collapsible defaultOpenItems={['one']}>
      <AccordionItem value='one'>
        <AccordionHeader>Section One</AccordionHeader>
        <AccordionPanel>Section one content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value='two'>
        <AccordionHeader>Section Two</AccordionHeader>
        <AccordionPanel>Section two content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value='three' disabled>
        <AccordionHeader>Section Three</AccordionHeader>
        <AccordionPanel>Section three content</AccordionPanel>
      </AccordionItem>
    </Accordion>

    <Accordion data-testid='accordion-b' collapsible>
      <AccordionItem value='alpha'>
        <AccordionHeader>Alpha</AccordionHeader>
        <AccordionPanel>Alpha content</AccordionPanel>
      </AccordionItem>
      <AccordionItem value='beta'>
        <AccordionHeader>Beta</AccordionHeader>
        <AccordionPanel>Beta content</AccordionPanel>
      </AccordionItem>
    </Accordion>
  </FluentProvider>
);

export const accordionUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Fluent Accordion',
  ui: <AccordionExample />,
};
