import matrixData from '@site/src/generated/supportMatrix.json';
import clsx from 'clsx';
import React, { type JSX } from 'react';

import { BrandIcon } from './icons';
import {
  buildAtomicTable,
  buildTierMatrix,
  type CellTier,
  type MatrixCell,
  type SupportMatrixData,
  type Tile,
} from './model';

import styles from './index.module.css';

// The generated matrix is produced by docs/scripts/genSupportMatrix.mjs from the CLI's
// own compatibility registry, so it always matches what `create atomic-testing` offers.
// The docs tsconfig enables neither `resolveJsonModule` nor a `*.json` ambient module,
// so we describe the file's shape here and cast the import to it — tsc consults this
// exact-match ambient declaration before resolving the path. The full shape lives in
// model.ts (SupportMatrixData); that generator script is the source of truth for it.
declare module '@site/src/generated/supportMatrix.json' {
  const value: unknown;
  export default value;
}

const matrix = matrixData as SupportMatrixData;
const tileGroups = buildAtomicTable(matrix);
const tierMatrix = buildTierMatrix(matrix);

const TIER_LABEL: Record<Exclude<CellTier, 'contribute'>, string> = {
  verified: 'Verified',
  experimental: 'Experimental',
  disabled: 'Disabled',
};

function TileCard({ tile }: { tile: Tile }): JSX.Element {
  return (
    <li className={clsx(styles.tile, tile.unclaimed && styles.tileUnclaimed)}>
      <span className={styles.tileGlyph} aria-hidden='true'>
        {tile.icon ? <BrandIcon name={tile.icon} className={styles.tileIcon} /> : tile.glyph}
      </span>
      <span className={styles.tileMark}>{tile.mark}</span>
      <span className={styles.tileLabel}>{tile.label}</span>
      <span className={styles.tileSub}>{tile.sub}</span>
    </li>
  );
}

function TierCell({ cell }: { cell: MatrixCell }): JSX.Element {
  if (cell.tier === 'contribute') {
    return (
      <td className={clsx(styles.cell, styles.cellContribute)}>
        <span className={styles.cellInner}>
          <span className={styles.contribute}>your PR →</span>
        </span>
      </td>
    );
  }
  if (cell.tier === 'disabled') {
    return (
      <td className={clsx(styles.cell, styles.cellDisabled)} title={cell.note}>
        <span className={styles.cellInner}>
          <span className={styles.cellBadge}>
            <span className={styles.cellSymbol} aria-hidden='true'>
              ⊘
            </span>
            {TIER_LABEL.disabled}
          </span>
        </span>
      </td>
    );
  }
  return (
    <td className={clsx(styles.cell, styles[cell.tier])}>
      <span className={styles.cellInner}>
        <span className={styles.cellBadge}>
          <span className={styles.cellDot} aria-hidden='true' />
          {TIER_LABEL[cell.tier]}
        </span>
        {cell.sub && <span className={styles.cellSub}>{cell.sub}</span>}
      </span>
    </td>
  );
}

export default function SupportMatrix(): JSX.Element {
  return (
    <div className={styles.root}>
      <section className={clsx(styles.section, styles.inventory)}>
        <header className={styles.sectionHead}>
          <p className={clsx(styles.eyebrow, styles.eyebrowGreen)}>What&apos;s supported</p>
          <h2 className={styles.title}>The Atomic Table.</h2>
          <p className={styles.lede}>
            Every runtime, runner and design system is one small npm package with the same contract. New elements arrive
            without touching your tests.
          </p>
        </header>

        {tileGroups.map(group => (
          <div key={group.key} className={clsx(styles.group, styles[`group-${group.key}`])}>
            <div className={styles.groupLabel}>
              <span className={styles.groupLabelText}>{group.title}</span>
              <span className={styles.rule} aria-hidden='true' />
            </div>
            <ul className={styles.tiles}>
              {group.tiles.map(tile => (
                <TileCard key={tile.label} tile={tile} />
              ))}
            </ul>
          </div>
        ))}

        <p className={styles.banner}>
          <span className={styles.bannerChip}>✓ every tile is an npm package</span>
          <span className={styles.bannerText}>a new design system is a driver file — the table just grows.</span>
        </p>
      </section>

      <section className={clsx(styles.section, styles.tiers)}>
        <header className={styles.sectionHead}>
          <p className={clsx(styles.eyebrow, styles.eyebrowBlue)}>How strongly</p>
          <h2 className={styles.title}>Tiers, not promises.</h2>
          <p className={styles.lede}>
            Framework × runner, generated from the compatibility data behind{' '}
            <code className={styles.code}>create atomic-testing</code> — it can&apos;t drift from what the CLI
            scaffolds.
          </p>
        </header>

        <div className={styles.scroll}>
          <table className={styles.matrix}>
            <caption className={styles.srOnly}>Framework by runner support tiers</caption>
            <thead>
              <tr>
                <td className={styles.matrixCorner} />
                {tierMatrix.columns.map(column => (
                  <th key={column.key} scope='col' className={styles.colHead}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tierMatrix.rows.map(row => (
                <tr key={row.id}>
                  <th scope='row' className={clsx(styles.rowHead, styles[`row-${row.id}`])}>
                    <span className={styles.rowHeadInner}>
                      {row.icon && <BrandIcon name={row.icon} className={styles.rowIcon} />}
                      <span>{row.label}</span>
                    </span>
                  </th>
                  {row.cells.map((cell, index) => (
                    <TierCell key={tierMatrix.columns[index].key} cell={cell} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className={styles.legend}>
          <li>
            <span className={clsx(styles.legendDot, styles.dotVerified)} /> Verified — green fixture in the monorepo
          </li>
          <li>
            <span className={clsx(styles.legendDot, styles.dotExperimental)} /> Experimental — CLI warns before writing
          </li>
          <li>
            <span className={styles.legendSymbol} aria-hidden='true'>
              ⊘
            </span>{' '}
            Disabled — refused with a reason
          </li>
          <li>
            <span className={styles.legendDash} aria-hidden='true' /> Waiting for a PR
          </li>
        </ul>
      </section>
    </div>
  );
}
