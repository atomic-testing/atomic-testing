/**
 * Type-level regression lock for the composite-driver constructor contract.
 *
 * A driver that declares non-empty `parts` can only be placed in a parent
 * `ScenePart` if its constructor widens the option parameter to
 * `Partial<IComponentDriverOption>` (the empty `<{}>` default) and hardcodes its
 * own parts in the body. The "natural" `Partial<IComponentDriverOption<typeof
 * parts>>` signature does NOT satisfy `ScenePartDefinition['driver']` because
 * constructor parameters are checked contravariantly, so a driver written that
 * way cannot be placed in a scene.
 *
 * `component-driver-html` ships no composite drivers of its own, so without this
 * fixture the contract would be unexercised. This file is type-checked by the
 * package's `check:type` but is not part of the published bundle (nothing in
 * `index.ts` imports it). If the contract regresses, `pnpm check:type` fails here.
 *
 * @see ComponentDriver — the constructor whose authoring rule this locks in.
 * @see AssertScenePlaceableDriver — the reusable one-line lock a package can use
 *   instead of copying this whole fixture.
 */
import {
  AssertScenePlaceableDriver,
  byDataTestId,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { HTMLButtonDriver } from '../components/HTMLButtonDriver';

const innerParts = {
  submit: { locator: byDataTestId('submit'), driver: HTMLButtonDriver },
} satisfies ScenePart;

/**
 * The canonical composite-driver shape: non-empty `parts`, a constructor that
 * widens the option to `Partial<IComponentDriverOption>` and hardcodes its parts.
 * This is the only form that can be placed in a parent `ScenePart`.
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
 * Positive lock, reusable form: the one-line {@link AssertScenePlaceableDriver}
 * lock a package can drop in for its own composite drivers instead of a full
 * placement fixture. Must type-check.
 */
export type _CompositePlaceable = AssertScenePlaceableDriver<typeof CompositeFixtureDriver>;

/**
 * Positive lock: a non-empty-parts driver must remain placeable in a scene.
 * This must type-check.
 */
export const compositePlacement = {
  dialog: { locator: byDataTestId('dialog'), driver: CompositeFixtureDriver },
} satisfies ScenePart;

/**
 * The same driver written the "natural" way — option typed to its own parts —
 * which must NOT type-check when placed in a scene (constructor parameters are
 * contravariant). This locks the trap: if the `@ts-expect-error` below becomes
 * unused, the contract has changed and the rule on {@link ComponentDriver} needs
 * revisiting.
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

export const naturalPlacementShouldNotCompile = {
  dialog: {
    locator: byDataTestId('dialog'),
    // @ts-expect-error a composite driver with a `<typeof parts>` constructor cannot be placed in a ScenePart
    driver: NaturalSignatureDriver,
  },
} satisfies ScenePart;
