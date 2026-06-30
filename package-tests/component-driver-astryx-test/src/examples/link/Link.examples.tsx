import { Link } from '@astryxdesign/core/Link';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx Link scene.
 *
 * Link renders an `<a>` when `href` is set and a `<button>` (link-styled) when it
 * is not, forwarding `data-testid` onto whichever element it renders. The three
 * instances cover an internal link, an external link (target/rel), and the
 * button fallback whose click is recorded.
 */
export const LinkExample = () => {
  const [actions, setActions] = useState(0);

  return (
    <div>
      <Link href='/docs' data-testid='docs-link'>
        Documentation
      </Link>
      <Link href='https://example.com' isExternalLink data-testid='external-link'>
        Example
      </Link>
      <Link onClick={() => setActions(a => a + 1)} data-testid='action-link'>
        Run action
      </Link>
      <span data-testid='action-count'>{actions}</span>
    </div>
  );
};

export const linkUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Link',
  ui: <LinkExample />,
};
