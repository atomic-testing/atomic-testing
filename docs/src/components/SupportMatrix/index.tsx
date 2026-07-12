import matrixData from '@site/src/generated/supportMatrix.json';
import clsx from 'clsx';
import React, { type JSX } from 'react';

import styles from './index.module.css';

// The generated matrix is produced by docs/scripts/genSupportMatrix.mjs from the CLI's
// own compatibility registry, so it always matches what `create atomic-testing` offers.
// The docs tsconfig enables neither `resolveJsonModule` nor a `*.json` ambient module,
// so we describe the file's shape here and cast the import to it — tsc consults this
// exact-match ambient declaration before resolving the path. Keep the interface in step
// with the generator's output object; that script is the source of truth for the shape.
declare module '@site/src/generated/supportMatrix.json' {
  const value: unknown;
  export default value;
}

type CellTier = 'verified' | 'experimental' | 'disabled' | 'unavailable';

interface FrameworkRow {
  readonly id: string;
  readonly displayName: string;
  readonly majors: readonly number[];
}

interface RunnerRow {
  readonly id: string;
  readonly displayName: string;
}

interface MatrixCell {
  readonly framework: string;
  readonly runner: string;
  readonly tier: CellTier;
  readonly note?: string;
}

interface DesignSystemEntry {
  readonly id: string;
  readonly displayName: string;
}

interface DesignSystemGroup {
  readonly framework: string;
  readonly systems: readonly DesignSystemEntry[];
}

interface SupportMatrixData {
  readonly generatedFrom: string;
  readonly frameworks: readonly FrameworkRow[];
  readonly runners: readonly RunnerRow[];
  readonly cells: readonly MatrixCell[];
  readonly designSystems: readonly DesignSystemGroup[];
}

const matrix = matrixData as SupportMatrixData;

const TIER_LABEL: Record<Exclude<CellTier, 'unavailable'>, string> = {
  verified: 'Verified',
  experimental: 'Experimental',
  disabled: 'Disabled',
};

const cellFor = (framework: string, runner: string): MatrixCell | undefined =>
  matrix.cells.find(cell => cell.framework === framework && cell.runner === runner);

const systemsFor = (framework: string): readonly DesignSystemEntry[] =>
  matrix.designSystems.find(group => group.framework === framework)?.systems ?? [];

function TierBadge({ cell }: { cell: MatrixCell | undefined }): JSX.Element {
  // An unregistered combination has no cell; a disabled one carries a note. Both read
  // as "not something you'd pick", so an em dash covers unavailable and no-cell alike.
  if (!cell || cell.tier === 'unavailable') {
    return (
      <span className={styles.unavailable} aria-label='Not offered'>
        —
      </span>
    );
  }
  return (
    <span className={clsx(styles.badge, styles[cell.tier])} title={cell.note}>
      {TIER_LABEL[cell.tier]}
    </span>
  );
}

export default function SupportMatrix(): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <caption className={styles.caption}>Framework × runner support</caption>
          <thead>
            <tr>
              <th scope='col' className={styles.corner}>
                Framework
              </th>
              {matrix.runners.map(runner => (
                <th key={runner.id} scope='col'>
                  {runner.displayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.frameworks.map(framework => (
              <tr key={framework.id}>
                <th scope='row' className={styles.rowHead}>
                  <span className={styles.frameworkName}>{framework.displayName}</span>
                  {framework.majors.length > 0 && <span className={styles.majors}>v{framework.majors.join(', ')}</span>}
                </th>
                {matrix.runners.map(runner => (
                  <td key={runner.id}>
                    <TierBadge cell={cellFor(framework.id, runner.id)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className={styles.legend}>
        <li>
          <span className={clsx(styles.badge, styles.verified)}>Verified</span> backed by a green fixture
        </li>
        <li>
          <span className={clsx(styles.badge, styles.experimental)}>Experimental</span> composed best-effort; warns
          before writing
        </li>
        <li>
          <span className={clsx(styles.badge, styles.disabled)}>Disabled</span> registered but refused (hover for why)
        </li>
        <li>
          <span className={styles.unavailable}>—</span> not offered
        </li>
      </ul>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <caption className={styles.caption}>Design systems per framework</caption>
          <thead>
            <tr>
              <th scope='col' className={styles.corner}>
                Framework
              </th>
              <th scope='col'>Design systems</th>
            </tr>
          </thead>
          <tbody>
            {matrix.designSystems.map(group => (
              <tr key={group.framework}>
                <th scope='row' className={styles.rowHead}>
                  {matrix.frameworks.find(framework => framework.id === group.framework)?.displayName ??
                    group.framework}
                </th>
                <td>
                  <span className={styles.systems}>
                    {systemsFor(group.framework).map(system => (
                      <span key={system.id} className={styles.systemChip}>
                        {system.displayName}
                      </span>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
