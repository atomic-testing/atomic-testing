import { THIRD_PARTY } from '../constants';
import type { DependencySpec, DesignSystemId } from '../types';
import type { DesignSystemPlugin, GenerationContext } from './pluginTypes';

/** Snap a major to the driver's supported set, falling back to the latest. */
const clampMajor = (supported: readonly number[], major: number | null, fallback: number): number =>
  major != null && supported.includes(major) ? major : fallback;

// Supported driver majors per design system (no component-driver-mui-v8 exists).
const MUI_MAJORS = [6, 7, 9];
const MUI_X_MAJORS = [6, 7, 8, 9];
const NG_MATERIAL_MAJORS = [20, 21, 22];

const muiMajor = (major: number | null): number => clampMajor(MUI_MAJORS, major, 9);
const muiXMajor = (major: number | null): number => clampMajor(MUI_X_MAJORS, major, 9);

const emotion: DependencySpec[] = [THIRD_PARTY.emotionReact, THIRD_PARTY.emotionStyled];

const html: DesignSystemPlugin = {
  id: 'html',
  displayName: 'Plain HTML elements',
  compatibleFrameworks: ['react', 'vue', 'angular', 'none'],
  driverPackage() {
    return null; // component-driver-html is always installed by the resolver
  },
  defaultMajor: frameworkMajor => frameworkMajor,
  deps() {
    return [];
  },
};

const mui: DesignSystemPlugin = {
  id: 'mui',
  displayName: 'Material UI (MUI)',
  compatibleFrameworks: ['react'],
  driverPackage(major) {
    return `component-driver-mui-v${muiMajor(major)}`;
  },
  defaultMajor: () => 9,
  deps(ctx) {
    const m = muiMajor(ctx.selection.designSystemMajor);
    return [{ name: '@mui/material', range: `^${m}.0.0` }, ...emotion];
  },
  usageNote:
    'Your MUI drivers are installed. Swap the HTML driver in scenePart for the MUI-specific drivers (e.g. MuiTextFieldDriver) to test MUI components directly.',
};

const muiX: DesignSystemPlugin = {
  id: 'mui-x',
  displayName: 'MUI X',
  compatibleFrameworks: ['react'],
  driverPackage(major) {
    return `component-driver-mui-x-v${muiXMajor(major)}`;
  },
  defaultMajor: () => 9,
  deps(ctx) {
    const m = muiXMajor(ctx.selection.designSystemMajor);
    // @mui/material comes transitively from the driver at the matching major, so
    // we don't pin it directly — a mismatched direct pin would fight the driver.
    return [{ name: '@mui/x-data-grid', range: `^${m}.0.0` }, ...emotion];
  },
  usageNote: 'Your MUI X drivers are installed. Point the scene part at the MUI X drivers to test MUI X components.',
};

const angularMaterial: DesignSystemPlugin = {
  id: 'angular-material',
  displayName: 'Angular Material',
  compatibleFrameworks: ['angular'],
  driverPackage(major) {
    return `component-driver-angular-material-v${clampMajor(NG_MATERIAL_MAJORS, major, 22)}`;
  },
  defaultMajor: frameworkMajor => frameworkMajor, // Angular Material tracks the Angular major
  deps(ctx) {
    const m = ctx.selection.designSystemMajor ?? ctx.selection.frameworkMajor;
    return [
      { name: '@angular/material', range: `^${m}.0.0` },
      { name: '@angular/cdk', range: `^${m}.0.0` },
      { name: '@angular/forms', range: `^${m}.0.0` },
    ];
  },
  usageNote:
    'Your Angular Material drivers are installed. Use them in the scene part to test Angular Material components.',
};

const primevue: DesignSystemPlugin = {
  id: 'primevue',
  displayName: 'PrimeVue',
  compatibleFrameworks: ['vue'],
  driverPackage() {
    return 'component-driver-primevue-v4';
  },
  defaultMajor: () => 4,
  deps() {
    return [THIRD_PARTY.primevue, THIRD_PARTY.primeuixThemes];
  },
  usageNote: 'Your PrimeVue drivers are installed. Use them in the scene part to test PrimeVue components.',
};

const radix: DesignSystemPlugin = {
  id: 'radix',
  displayName: 'Radix UI',
  compatibleFrameworks: ['react'],
  driverPackage() {
    return 'component-driver-radix-v1';
  },
  defaultMajor: () => 1,
  deps() {
    return [THIRD_PARTY.radixUi, THIRD_PARTY.cmdk];
  },
  usageNote: 'Your Radix drivers are installed. Use them in the scene part to test Radix components.',
};

const reka: DesignSystemPlugin = {
  id: 'reka',
  displayName: 'Reka UI',
  compatibleFrameworks: ['vue'],
  driverPackage() {
    return 'component-driver-reka-ui-v2';
  },
  defaultMajor: () => 2,
  deps() {
    return [THIRD_PARTY.rekaUi];
  },
  usageNote: 'Your Reka UI drivers are installed. Use them in the scene part to test Reka UI components.',
};

const shadcn: DesignSystemPlugin = {
  id: 'shadcn',
  displayName: 'shadcn/ui',
  compatibleFrameworks: ['react'],
  driverPackage() {
    return 'component-driver-shadcn-v1';
  },
  defaultMajor: () => 1,
  deps() {
    // A shadcn project vendors its own Radix components — nothing extra to add.
    return [];
  },
  usageNote: 'Your shadcn drivers are installed. Use them in the scene part to test shadcn/ui components.',
};

const astryx: DesignSystemPlugin = {
  id: 'astryx',
  displayName: 'Astryx',
  compatibleFrameworks: ['react'],
  driverPackage() {
    return 'component-driver-astryx';
  },
  defaultMajor: () => 1,
  deps() {
    return [THIRD_PARTY.astryxCore];
  },
  usageNote: 'Your Astryx drivers are installed. Use them in the scene part to test Astryx components.',
};

const fluent: DesignSystemPlugin = {
  id: 'fluent',
  displayName: 'Fluent UI v9 (Fluent 2)',
  compatibleFrameworks: ['react'],
  driverPackage() {
    return 'component-driver-fluent-v9';
  },
  defaultMajor: () => 9,
  deps() {
    return [THIRD_PARTY.fluentReactComponents];
  },
  usageNote:
    'Your Fluent UI drivers are installed. Swap the HTML driver in scenePart for the Fluent-specific drivers (e.g. ButtonDriver) to test Fluent UI v9 components directly.',
};

export const DESIGN_SYSTEMS: Readonly<Record<DesignSystemId, DesignSystemPlugin>> = {
  html,
  mui,
  'mui-x': muiX,
  'angular-material': angularMaterial,
  primevue,
  radix,
  reka,
  shadcn,
  astryx,
  fluent,
};

export function getDesignSystem(id: DesignSystemId): DesignSystemPlugin {
  return DESIGN_SYSTEMS[id];
}

/** Design systems compatible with a framework — html first, for prompts. */
export function designSystemsForFramework(framework: string): DesignSystemPlugin[] {
  return (Object.values(DESIGN_SYSTEMS) as DesignSystemPlugin[])
    .filter(ds => ds.compatibleFrameworks.includes(framework as never))
    .sort((a, b) => (a.id === 'html' ? -1 : b.id === 'html' ? 1 : 0));
}

export type { GenerationContext };
