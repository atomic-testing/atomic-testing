/**
 * Central type-level regression lock for the composite-driver constructor
 * contract — the contravariant authoring rule documented on {@link ComponentDriver}.
 *
 * A driver that declares non-empty `parts` is placeable in a parent `ScenePart`
 * only if its constructor widens the option parameter to
 * `Partial<IComponentDriverOption>` (the empty `<{}>` default) and hardcodes its
 * own parts in the body. The "natural" `Partial<IComponentDriverOption<typeof
 * parts>>` signature does NOT satisfy `ScenePartDefinition['driver']` because
 * constructor parameters are checked contravariantly.
 *
 * This lock lives in `core` so the rule is enforced at its source: `pnpm check:type`
 * for `core` fails here if the rule regresses, independent of any driver package.
 * `@atomic-testing/component-driver-html` keeps a parallel fixture as a
 * consumer-facing precedent. Nothing in `index.ts` imports this file, so it is
 * type-checked but never bundled.
 *
 * @see AssertScenePlaceableDriver — the reusable one-line lock this exercises.
 */
import type { Interactor } from '../../interactor';
import type { PartLocator } from '../../locators';
import { byCssSelector } from '../../locators/byCssSelector';
import { AssertScenePlaceableDriver, IComponentDriverOption, ScenePart } from '../../partTypes';
import { ComponentDriver } from '../ComponentDriver';

/** A trivial leaf driver, only to give the composite fixtures a real part. */
class LeafDriver extends ComponentDriver {
  get driverName(): string {
    return 'LeafDriver';
  }
}

const innerParts = {
  child: { locator: byCssSelector('.child'), driver: LeafDriver },
} satisfies ScenePart;

/**
 * The canonical composite shape: non-empty `parts`, a constructor that widens the
 * option to `Partial<IComponentDriverOption>` and hardcodes its own parts. Only
 * this form is scene-placeable.
 */
export class CompositeFixtureDriver extends ComponentDriver<typeof innerParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption>) {
    super(locator, interactor, { ...option, parts: innerParts });
  }

  get driverName(): string {
    return 'CompositeFixtureDriver';
  }
}

/**
 * Positive lock via the reusable helper: the correctly-authored driver must remain
 * scene-placeable. If it regresses, `typeof CompositeFixtureDriver` stops
 * satisfying the constraint and `check:type` fails on this line.
 */
export type _CompositePlaceable = AssertScenePlaceableDriver<typeof CompositeFixtureDriver>;

/** Positive lock via real scene placement, mirroring how a driver is actually used. */
export const compositePlacement = {
  dialog: { locator: byCssSelector('.dialog'), driver: CompositeFixtureDriver },
} satisfies ScenePart;

/**
 * The same driver written the "natural" way — option typed to its own parts —
 * which must NOT satisfy the scene-placeable constructor. This locks the trap: if
 * the `@ts-expect-error` below becomes unused, the contract has changed and the
 * authoring rule on {@link ComponentDriver} needs revisiting.
 */
class NaturalSignatureDriver extends ComponentDriver<typeof innerParts> {
  constructor(
    locator: PartLocator,
    interactor: Interactor,
    option?: Partial<IComponentDriverOption<typeof innerParts>>
  ) {
    super(locator, interactor, { ...option, parts: innerParts });
  }

  get driverName(): string {
    return 'NaturalSignatureDriver';
  }
}

// @ts-expect-error a `<typeof parts>` constructor is not scene-placeable (contravariance)
export type _NaturalNotPlaceable = AssertScenePlaceableDriver<typeof NaturalSignatureDriver>;
