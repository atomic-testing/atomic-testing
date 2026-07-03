import { IExampleUIUnit } from '@atomic-testing/core';
import { Accordion } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix Accordion scene: a `type="single" collapsible` accordion with an open
 * item, a closed item, and a disabled item — covering the per-item
 * expanded/disabled reads `AccordionDriver` exposes (it models one
 * `Accordion.Item`, not the whole list, per the MUI `AccordionDriver` shape).
 */
export const AccordionExample = () => (
  <Accordion.Root type='single' collapsible defaultValue='item-a'>
    <Accordion.Item value='item-a' data-testid='accordion-item-a'>
      <Accordion.Header>
        <Accordion.Trigger>Section A</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>Content A</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value='item-b' data-testid='accordion-item-b'>
      <Accordion.Header>
        <Accordion.Trigger>Section B</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>Content B</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value='item-c' disabled data-testid='accordion-item-c'>
      <Accordion.Header>
        <Accordion.Trigger>Section C</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content>Content C</Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);

export const accordionUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix Accordion',
  ui: <AccordionExample />,
};
