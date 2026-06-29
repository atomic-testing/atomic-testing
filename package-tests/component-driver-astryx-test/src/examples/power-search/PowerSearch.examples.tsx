import { createPowerSearchConfig, PowerSearch } from '@astryxdesign/core/PowerSearch';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

const { config } = createPowerSearchConfig([
  {
    key: 'status',
    type: 'enum',
    label: 'Status',
    enumValues: [
      { value: 'open', label: 'Open' },
      { value: 'closed', label: 'Closed' },
    ],
  },
  {
    key: 'priority',
    type: 'enum',
    label: 'Priority',
    enumValues: [
      { value: 'high', label: 'High' },
      { value: 'low', label: 'Low' },
    ],
  },
  { key: 'title', type: 'string', label: 'Title' },
] as never);

type Filter = { field: string; operator: string; value: { type: string; value: string } };

const FilterBar = () => {
  const [filters, setFilters] = useState<Filter[]>([
    { field: 'status', operator: 'is', value: { type: 'enum', value: 'open' } },
    { field: 'priority', operator: 'is', value: { type: 'enum', value: 'high' } },
  ]);
  return (
    <PowerSearch
      data-testid='search'
      label='Filters'
      config={config}
      filters={filters as never}
      onChange={f => setFilters(f as never)}
      resultCount={42}
    />
  );
};

const EmptyBar = () => {
  const [filters, setFilters] = useState<Filter[]>([]);
  return (
    <PowerSearch
      data-testid='empty-search'
      label='Empty filters'
      config={config}
      filters={filters as never}
      onChange={f => setFilters(f as never)}
      resultCount={0}
    />
  );
};

/**
 * Astryx PowerSearch scene.
 *
 * PowerSearch reuses the Tokenizer shell (root `role="group"`, self-emitting
 * `data-testid`); filter chips are `span.astryx-token` keyed by their
 * field/operator label, with a `role="combobox"` query input and a trailing
 * "N results" count. The pre-populated and empty bars verify enumeration, removal,
 * and scoping.
 */
export const PowerSearchExample = () => (
  <>
    <FilterBar />
    <EmptyBar />
  </>
);

export const powerSearchUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx PowerSearch',
  ui: <PowerSearchExample />,
};
