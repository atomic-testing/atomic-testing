import { Pagination } from '@astryxdesign/core/Pagination';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx Pagination scene.
 *
 * Pagination self-emits `data-testid` on a `<nav>`; controls are addressed by
 * their accessible names ("Go to page N", "Go to previous/next page"). Two
 * instances cover the default `pages` variant and the `count` text variant.
 */
export const PaginationExample = () => {
  const [page, setPage] = useState(2);
  const [countPage, setCountPage] = useState(2);

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
    </div>
  );
};

export const paginationUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Pagination',
  ui: <PaginationExample />,
};
