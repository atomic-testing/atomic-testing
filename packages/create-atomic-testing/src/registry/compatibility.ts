import type { DesignSystemId, FrameworkId, RunnerId, SupportTier } from '../types';
import { getDesignSystem } from './designSystems';
import { RUNNERS } from './runners';

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  THE EXTENSION POINT
 * ───────────────────────────────────────────────────────────────────────────
 * Every offered combination is one row here. A row pairs a framework + runner
 * (+ optional specific design system) with a support tier and an `enabled` flag.
 *
 * To add a brand-new combination — e.g. Angular + Jest — you add ONE row and,
 * if the combo needs bespoke config, tweak the relevant runner/framework plugin.
 * No resolution code changes. The `angular + jest` row below is exactly that:
 * registered (so the tooling knows it is a real, intended future combo) but
 * `enabled: false` (so it is refused with a helpful message until a fixture
 * proves it green and someone flips the flag).
 *
 * `designSystem: '*'` matches any design system the framework is compatible
 * with; a specific id takes precedence over `'*'`.
 */
export interface CompatRule {
  readonly framework: FrameworkId;
  readonly runner: RunnerId;
  readonly designSystem?: DesignSystemId | '*';
  readonly tier: SupportTier;
  readonly enabled: boolean;
  readonly note?: string;
}

export const COMPATIBILITY: readonly CompatRule[] = [
  // ── React — Jest is the paved, fixture-backed path ──────────────────────
  { framework: 'react', runner: 'jest', designSystem: '*', tier: 'verified', enabled: true },
  { framework: 'react', runner: 'vitest', designSystem: '*', tier: 'experimental', enabled: true },
  { framework: 'react', runner: 'vitest-browser', designSystem: '*', tier: 'experimental', enabled: true },
  { framework: 'react', runner: 'playwright', designSystem: '*', tier: 'experimental', enabled: true },

  // ── Vue 3 — Jest (+ @testing-library/vue) is the fixture-backed path ─────
  { framework: 'vue', runner: 'jest', designSystem: '*', tier: 'verified', enabled: true },
  { framework: 'vue', runner: 'vitest', designSystem: '*', tier: 'experimental', enabled: true },
  { framework: 'vue', runner: 'playwright', designSystem: '*', tier: 'experimental', enabled: true },

  // ── Angular — Vitest browser mode is the real path; generation is still
  //    best-effort, so it ships experimental (warns before writing) ─────────
  { framework: 'angular', runner: 'vitest-browser', designSystem: '*', tier: 'experimental', enabled: true },
  { framework: 'angular', runner: 'playwright', designSystem: '*', tier: 'experimental', enabled: true },
  // Registered-but-disabled: the canonical example of a future plug-in. Angular
  // has no Jest path in atomic-testing yet. Flip `enabled` once a green fixture
  // exists and (if needed) add an Angular-Jest config specialization.
  {
    framework: 'angular',
    runner: 'jest',
    designSystem: '*',
    tier: 'experimental',
    enabled: false,
    note: 'Angular + Jest is not supported yet (Angular runs under Vitest browser mode in atomic-testing). This combination is registered to show how a new recipe plugs in — enable it in registry/compatibility.ts once a fixture proves it.',
  },
  {
    framework: 'angular',
    runner: 'vitest',
    designSystem: '*',
    tier: 'experimental',
    enabled: false,
    note: 'Angular under jsdom Vitest is not supported; use the Vitest browser-mode recipe instead.',
  },

  // ── Vanilla DOM — no per-framework TestEngine ships yet ──────────────────
  {
    framework: 'none',
    runner: 'jest',
    designSystem: 'html',
    tier: 'experimental',
    enabled: false,
    note: 'Vanilla-DOM scaffolding needs a TestEngine that does not ship yet. Pick React, Vue or Angular for now.',
  },
];

export interface CompatResult {
  /** True when a plan can be generated (registered AND enabled AND DS-compatible). */
  readonly allowed: boolean;
  readonly registered: boolean;
  readonly enabled: boolean;
  readonly tier: SupportTier;
  readonly note?: string;
  /** Set when `allowed` is false. */
  readonly code?: string;
  readonly message?: string;
}

function findRule(framework: FrameworkId, runner: RunnerId, designSystem: DesignSystemId): CompatRule | undefined {
  const candidates = COMPATIBILITY.filter(r => r.framework === framework && r.runner === runner);
  return (
    candidates.find(r => r.designSystem === designSystem) ??
    candidates.find(r => r.designSystem === '*' || r.designSystem == null)
  );
}

/**
 * Decide whether a (framework, runner, designSystem) triple is a valid,
 * offered combination — and at what support tier. Pure and total.
 */
export function resolveCompatibility(
  framework: FrameworkId,
  runner: RunnerId,
  designSystem: DesignSystemId
): CompatResult {
  // Hard gate: a design system binds to specific frameworks (MUI→React etc.).
  if (!getDesignSystem(designSystem).compatibleFrameworks.includes(framework)) {
    return {
      allowed: false,
      registered: false,
      enabled: false,
      tier: 'experimental',
      code: 'E_IMPOSSIBLE_COMBO',
      message: `${designSystem} does not support ${framework}. These design systems are incompatible with the chosen framework.`,
    };
  }

  const rule = findRule(framework, runner, designSystem);
  if (!rule) {
    return {
      allowed: false,
      registered: false,
      enabled: false,
      tier: 'experimental',
      code: 'E_COMBO_NOT_REGISTERED',
      message: `${framework} + ${runner} is not a registered combination.`,
    };
  }
  if (!rule.enabled) {
    return {
      allowed: false,
      registered: true,
      enabled: false,
      tier: rule.tier,
      note: rule.note,
      code: 'E_COMBO_DISABLED',
      message: rule.note ?? `${framework} + ${runner} is registered but not enabled yet.`,
    };
  }
  return { allowed: true, registered: true, enabled: true, tier: rule.tier, note: rule.note };
}

/** Runners offered for a framework+designSystem, for prompts and validation. */
export function offeredRunners(
  framework: FrameworkId,
  designSystem: DesignSystemId
): Array<{ runner: RunnerId; tier: SupportTier }> {
  return (Object.keys(RUNNERS) as RunnerId[])
    .map(runner => ({ runner, compat: resolveCompatibility(framework, runner, designSystem) }))
    .filter(x => x.compat.allowed)
    .map(x => ({ runner: x.runner, tier: x.compat.tier }));
}
