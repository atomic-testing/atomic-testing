import type { BrandIconName } from './icons';

/**
 * View-model for the Support Matrix (design "Coverage Explorations / 3a").
 *
 * The page has two halves with two different jobs:
 *   1. The Atomic Table — the *inventory*: what runtimes, runners and design-system
 *      drivers exist, plus what is deliberately still unclaimed. No tiers here.
 *   2. Tiers, not promises — the *honesty layer*: how strongly each framework × runner
 *      combination is supported.
 *
 * Everything real is DERIVED from `supportMatrix.json`, which CI regenerates from the
 * create-atomic-testing compatibility registry (docs/scripts/genSupportMatrix.mjs) and
 * guards against drift — so this component can never claim support the CLI won't
 * scaffold. Editorial extras that are *not* registry rows (unclaimed runtimes/runners,
 * the "your driver" slot, the Storybook column) are layered on top here and clearly
 * labelled as such; they carry the extensibility story, not a support guarantee.
 */

/** Cell tiers as emitted by the generator (see genSupportMatrix.mjs `cellTier`). */
type RegistryTier = 'verified' | 'experimental' | 'disabled' | 'unavailable';

interface RawFramework {
  readonly id: string;
  readonly displayName: string;
  readonly majors: readonly number[];
}
interface RawRunner {
  readonly id: string;
  readonly displayName: string;
}
interface RawCell {
  readonly framework: string;
  readonly runner: string;
  readonly tier: RegistryTier;
  readonly note?: string;
}
interface RawDesignSystemGroup {
  readonly framework: string;
  readonly systems: readonly { readonly id: string; readonly displayName: string }[];
}
export interface SupportMatrixData {
  readonly generatedFrom: string;
  readonly frameworks: readonly RawFramework[];
  readonly runners: readonly RawRunner[];
  readonly cells: readonly RawCell[];
  readonly designSystems: readonly RawDesignSystemGroup[];
}

// ── The Atomic Table (inventory) ───────────────────────────────────────────────

export type TileGroupKey = 'runtimes' | 'runners' | 'drivers';

export interface Tile {
  /** Two-letter word-mark shown large on the tile (e.g. "Re", "Sb"). */
  readonly mark: string;
  readonly label: string;
  readonly sub: string;
  /** Inlined brand glyph, when Simple Icons has one. */
  readonly icon?: BrandIconName;
  /** Fallback glyph (emoji / symbol) when no brand icon exists. */
  readonly glyph?: string;
  /** Renders dashed + muted: a slot that exists in the design's story but not in code yet. */
  readonly unclaimed?: boolean;
}

export interface TileGroup {
  readonly key: TileGroupKey;
  readonly title: string;
  readonly tiles: readonly Tile[];
}

/** Runtime presentation, keyed by the registry framework id. */
const RUNTIME_META: Record<string, { mark: string; label: string; icon: BrandIconName }> = {
  react: { mark: 'Re', label: 'React', icon: 'react' },
  vue: { mark: 'Vu', label: 'Vue', icon: 'vue' },
  angular: { mark: 'An', label: 'Angular', icon: 'angular' },
};

/** Design-system driver presentation, keyed by the registry design-system id. */
const DRIVER_META: Record<string, { mark: string; label: string; sub: string; icon?: BrandIconName; glyph?: string }> =
  {
    html: { mark: 'Ht', label: 'Plain HTML', sub: 'all frameworks', icon: 'html5' },
    mui: { mark: 'Mu', label: 'Material UI', sub: 'react · v5–7', icon: 'mui' },
    'mui-x': { mark: 'Mx', label: 'MUI X', sub: 'react', icon: 'mui' },
    radix: { mark: 'Rx', label: 'Radix UI', sub: 'react', icon: 'radix' },
    shadcn: { mark: 'Sh', label: 'shadcn/ui', sub: 'react', icon: 'shadcn' },
    astryx: { mark: 'As', label: 'Astryx', sub: 'react · meta', glyph: '✳' },
    primevue: { mark: 'Pv', label: 'PrimeVue', sub: 'vue 3', icon: 'vue' },
    'angular-material': { mark: 'Am', label: 'Ng Material', sub: 'angular', icon: 'angular' },
  };

/** Format a contiguous major-version list as the design's compact range, e.g. "v16–19". */
function formatMajors(majors: readonly number[]): string {
  if (majors.length === 0) return '';
  const min = Math.min(...majors);
  const max = Math.max(...majors);
  return min === max ? `v${min}` : `v${min}–${max}`;
}

/** First two characters of a name, capitalised — the mark fallback for unmapped ids. */
function fallbackMark(name: string): string {
  const letters = name.replace(/[^a-z]/gi, '');
  return (letters.slice(0, 2) || '??').replace(/^./, c => c.toUpperCase());
}

/**
 * Runner tiles are an editorial regrouping of the registry runners, not a 1:1 mirror:
 * the two Vitest runners (jsdom + browser mode) collapse into one Vitest tile, and
 * Storybook (a real @atomic-testing package that runs under Vitest browser mode) and
 * an unclaimed Cypress slot round out the row. The `registry` note records which
 * registry runner id(s) each real tile stands for, so a future runner added to the
 * registry is an obvious prompt to revisit this list.
 */
const RUNNER_TILES: readonly Tile[] = [
  { mark: 'Je', label: 'Jest', sub: 'jsdom', icon: 'jest' }, // registry: jest
  { mark: 'Vi', label: 'Vitest', sub: 'jsdom · browser', icon: 'vitest' }, // registry: vitest + vitest-browser
  { mark: 'Sb', label: 'Storybook', sub: 'portable stories', icon: 'storybook' }, // @atomic-testing/storybook
  { mark: 'Pw', label: 'Playwright', sub: 'e2e · real browser', glyph: '🎭' }, // registry: playwright (no brand icon)
  { mark: 'Cy', label: 'Cypress', sub: 'unclaimed', icon: 'cypress', unclaimed: true }, // editorial
];

/** Editorial "your driver" slot closing the drivers row — a driver is a file, not a fork. */
const YOUR_DRIVER_TILE: Tile = {
  mark: '??',
  label: 'Your driver',
  sub: 'one file, not a fork',
  unclaimed: true,
};

/** Editorial unclaimed runtime closing the runtimes row. */
const UNCLAIMED_RUNTIME: Tile = { mark: 'Sv', label: 'Svelte', sub: 'unclaimed', icon: 'svelte', unclaimed: true };

export function buildAtomicTable(matrix: SupportMatrixData): readonly TileGroup[] {
  const runtimes: Tile[] = matrix.frameworks.map(framework => {
    const meta = RUNTIME_META[framework.id];
    return {
      mark: meta?.mark ?? fallbackMark(framework.displayName),
      label: meta?.label ?? framework.displayName,
      sub: formatMajors(framework.majors),
      icon: meta?.icon,
    };
  });
  runtimes.push(UNCLAIMED_RUNTIME);

  // Flatten design systems across frameworks, de-duplicating shared drivers (Plain HTML
  // ships for every framework) while remembering which frameworks each one belongs to,
  // so an unmapped/new driver still gets an honest framework sub-label.
  const frameworksById = new Map(matrix.frameworks.map(f => [f.id, f.displayName]));
  const seen = new Map<string, { displayName: string; frameworks: string[] }>();
  for (const group of matrix.designSystems) {
    for (const system of group.systems) {
      const entry = seen.get(system.id);
      if (entry) entry.frameworks.push(group.framework);
      else seen.set(system.id, { displayName: system.displayName, frameworks: [group.framework] });
    }
  }
  const drivers: Tile[] = [...seen.entries()].map(([id, { displayName, frameworks }]) => {
    const meta = DRIVER_META[id];
    const derivedSub =
      frameworks.length === matrix.frameworks.length
        ? 'all frameworks'
        : frameworks.map(fw => frameworksById.get(fw) ?? fw).join(' · ');
    return {
      mark: meta?.mark ?? fallbackMark(displayName),
      label: meta?.label ?? displayName,
      sub: meta?.sub ?? derivedSub,
      icon: meta?.icon,
      glyph: meta?.glyph,
    };
  });
  drivers.push(YOUR_DRIVER_TILE);

  return [
    { key: 'runtimes', title: 'Runtimes', tiles: runtimes },
    { key: 'runners', title: 'Runners', tiles: RUNNER_TILES },
    { key: 'drivers', title: 'Design-system drivers', tiles: drivers },
  ];
}

// ── Tiers, not promises (the honesty matrix) ────────────────────────────────────

export type CellTier = 'verified' | 'experimental' | 'disabled' | 'contribute';

export interface MatrixCell {
  readonly tier: CellTier;
  /** Mode qualifier under the badge, e.g. "browser mode only". */
  readonly sub?: string;
  /** Hover reason, surfaced for disabled cells. */
  readonly note?: string;
}

export interface MatrixColumn {
  readonly key: string;
  readonly label: string;
}

export interface MatrixRow {
  readonly id: string;
  readonly label: string;
  readonly icon?: BrandIconName;
  readonly cells: readonly MatrixCell[];
}

export interface TierMatrix {
  readonly columns: readonly MatrixColumn[];
  readonly rows: readonly MatrixRow[];
}

/** The four columns the design shows — see RUNNER_TILES for how they map to the registry. */
const MATRIX_COLUMNS: readonly MatrixColumn[] = [
  { key: 'jest', label: 'Jest' },
  { key: 'vitest', label: 'Vitest' },
  { key: 'storybook', label: 'Storybook' },
  { key: 'playwright', label: 'Playwright' },
];

const ROW_ICON: Record<string, BrandIconName> = { react: 'react', vue: 'vue', angular: 'angular' };

/**
 * Storybook has no registry row (it is not a CLI-scaffolded runner). These tiers state
 * where a proven Storybook path exists today — React ships one; Vue and Angular are open
 * for a contribution. Any framework not listed defaults to "contribute".
 */
const STORYBOOK_TIER: Record<string, Extract<CellTier, 'experimental' | 'contribute'>> = {
  react: 'experimental',
  vue: 'contribute',
  angular: 'contribute',
};

const RANK: Record<CellTier, number> = { verified: 3, experimental: 2, disabled: 1, contribute: 0 };

function toCellTier(tier: RegistryTier): CellTier {
  return tier === 'unavailable' ? 'contribute' : tier;
}

const isUsable = (tier: CellTier): boolean => tier === 'verified' || tier === 'experimental';

export function buildTierMatrix(matrix: SupportMatrixData): TierMatrix {
  const cellFor = (framework: string, runner: string): RawCell | undefined =>
    matrix.cells.find(cell => cell.framework === framework && cell.runner === runner);

  const jestOrPlaywright = (framework: string, runner: string): MatrixCell => {
    const raw = cellFor(framework, runner);
    if (!raw) return { tier: 'contribute' };
    const cell: MatrixCell = { tier: toCellTier(raw.tier) };
    return raw.note ? { ...cell, note: raw.note } : cell;
  };

  // Collapse the two Vitest runners into one cell: strongest tier wins, and the sub-note
  // reports which modes actually run (both / jsdom only / browser mode only).
  const vitestCell = (framework: string): MatrixCell => {
    const jsdom = toCellTier(cellFor(framework, 'vitest')?.tier ?? 'unavailable');
    const browser = toCellTier(cellFor(framework, 'vitest-browser')?.tier ?? 'unavailable');
    const tier = RANK[jsdom] >= RANK[browser] ? jsdom : browser;
    const jsdomOk = isUsable(jsdom);
    const browserOk = isUsable(browser);
    const sub =
      jsdomOk && browserOk ? 'jsdom · browser' : jsdomOk ? 'jsdom only' : browserOk ? 'browser mode only' : undefined;
    return sub ? { tier, sub } : { tier };
  };

  const storybookCell = (framework: string): MatrixCell => ({ tier: STORYBOOK_TIER[framework] ?? 'contribute' });

  const rows: MatrixRow[] = matrix.frameworks.map(framework => ({
    id: framework.id,
    label: framework.displayName,
    icon: ROW_ICON[framework.id],
    cells: [
      jestOrPlaywright(framework.id, 'jest'),
      vitestCell(framework.id),
      storybookCell(framework.id),
      jestOrPlaywright(framework.id, 'playwright'),
    ],
  }));

  return { columns: MATRIX_COLUMNS, rows };
}
