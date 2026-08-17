import { Pagination } from '@astryxdesign/core/Pagination';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx Pagination scene.
 *
 * Pagination self-emits `data-testid` on a `<nav>`; controls are addressed by
 * their accessible names ("Go to page N", "Go to previous/next page"). Two
 * instances cover the default `pages` variant, the `count` text variant, and
 * Astryx 0.3.0's `input` variant — an editable page box with no numbered
 * controls at all, so the current page has to be read from the spinbutton
 * instead of from an `aria-current` button.
 */
export const PaginationExample = () => {
  const [page, setPage] = useState(2);
  const [countPage, setCountPage] = useState(2);
  const [inputPage, setInputPage] = useState(3);

  return (
    <div>
      <Pagination page={page} onChange={setPage} totalItems={200} pageSize={20} data-testid='pager' />
      <Pagination
        page={countPage}
        onChange={setCountPage}
        totalItems={200}
        pageSize={20}
        variant='count'
        data-testid='count-pager'
      />
      <Pagination
        page={inputPage}
        onChange={setInputPage}
        totalItems={200}
        pageSize={20}
        variant='input'
        data-testid='input-pager'
      />
    </div>
  );
};

export const paginationUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Pagination',
  ui: <PaginationExample />,
};
