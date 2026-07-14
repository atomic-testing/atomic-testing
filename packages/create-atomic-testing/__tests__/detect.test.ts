import { detect, detectFramework, detectPackageManager, resolveMajor } from '../src/detect';
import { detectDesignSystem } from '../src/detect/detectDesignSystem';
import { detectMonorepo, detectTypeScript } from '../src/detect/detectEnvironment';
import { detectRunner } from '../src/detect/detectRunner';
import type { PackageJsonLike, ProjectSnapshot } from '../src/types';

function snapshot(overrides: Partial<ProjectSnapshot> = {}): ProjectSnapshot {
  return {
    root: '/tmp/x',
    packageJson: null,
    packageJsonMalformed: false,
    lockfiles: [],
    configFiles: [],
    hasTsConfig: false,
    hasComponentsJson: false,
    workspaceMarkers: [],
    ...overrides,
  };
}

const pkg = (p: PackageJsonLike): PackageJsonLike => p;

describe('resolveMajor', () => {
  it('resolves a single major from caret/tilde/exact ranges', () => {
    expect(resolveMajor('^18.3.1').major).toBe(18);
    expect(resolveMajor('~19.2.0').major).toBe(19);
    expect(resolveMajor('17.0.2').major).toBe(17);
  });

  it('resolves an open lower bound to its minimum major (not ambiguous)', () => {
    const r = resolveMajor('>=19.0.0-rc.0');
    expect(r.major).toBe(19);
    expect(r.ambiguous).toBe(false);
  });

  it('flags a genuinely multi-major range as ambiguous', () => {
    const r = resolveMajor('18 || 19');
    expect(r.major).toBeNull();
    expect(r.ambiguous).toBe(true);
  });

  it('marks non-semver specifiers unresolvable', () => {
    for (const spec of ['workspace:*', 'latest', 'next', '*', 'catalog:', 'file:../x']) {
      expect(resolveMajor(spec).unresolvable).toBe(true);
    }
    expect(resolveMajor(undefined).unresolvable).toBe(true);
  });
});

describe('detectFramework', () => {
  it('detects React and its major', () => {
    expect(detectFramework(pkg({ dependencies: { react: '^19.2.0', 'react-dom': '^19.2.0' } })).framework).toEqual({
      id: 'react',
      major: 19,
    });
    expect(detectFramework(pkg({ dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' } })).framework?.major).toBe(
      18
    );
  });

  it('anchors Angular on @angular/core', () => {
    expect(detectFramework(pkg({ dependencies: { '@angular/core': '^22.1.0' } })).framework).toEqual({
      id: 'angular',
      major: 22,
    });
  });

  it('returns none when no framework is present', () => {
    expect(detectFramework(pkg({ dependencies: { lodash: '^4' } })).framework).toEqual({ id: 'none', major: null });
  });

  it('never silently picks one when two frameworks are present', () => {
    const r = detectFramework(pkg({ dependencies: { react: '^19', vue: '^3.5' } }));
    expect(r.framework).toBeNull();
    expect(r.ambiguities).toContain('framework');
  });

  it('flags an ambiguous major and reports react/react-dom skew', () => {
    expect(detectFramework(pkg({ dependencies: { react: '18 || 19' } })).ambiguities).toContain('framework-major');
    const skew = detectFramework(pkg({ dependencies: { react: '^18.3.1', 'react-dom': '^17.0.2' } }));
    expect(skew.diagnostics.some(d => d.code === 'E_REACT_DOM_MISMATCH')).toBe(true);
  });
});

describe('detectPackageManager', () => {
  it('prefers a lockfile', () => {
    expect(detectPackageManager(snapshot({ lockfiles: ['pnpm-lock.yaml'] })).packageManager).toBe('pnpm');
    expect(detectPackageManager(snapshot({ lockfiles: ['yarn.lock'] })).packageManager).toBe('yarn');
    expect(detectPackageManager(snapshot({ lockfiles: ['bun.lock'] })).packageManager).toBe('bun');
  });

  it('lockfile beats the packageManager field, and flags multiple lockfiles', () => {
    const both = detectPackageManager(
      snapshot({ lockfiles: ['pnpm-lock.yaml'], packageJson: { packageManager: 'yarn@4.0.0' } })
    );
    expect(both.packageManager).toBe('pnpm');

    const two = detectPackageManager(snapshot({ lockfiles: ['pnpm-lock.yaml', 'package-lock.json'] }));
    expect(two.packageManager).toBe('pnpm');
    expect(two.ambiguities).toContain('package-manager');
  });

  it('falls back to field, then user-agent, then npm', () => {
    expect(detectPackageManager(snapshot({ packageJson: { packageManager: 'yarn@4' } })).packageManager).toBe('yarn');
    expect(detectPackageManager(snapshot({ userAgent: 'bun/1.1.0 npm/? node/v22' })).packageManager).toBe('bun');
    expect(detectPackageManager(snapshot()).packageManager).toBe('npm');
  });
});

describe('detectDesignSystem', () => {
  it('treats components.json as canonical shadcn', () => {
    expect(
      detectDesignSystem(snapshot({ hasComponentsJson: true, packageJson: { dependencies: { 'radix-ui': '^1' } } }))
    ).toEqual({
      id: 'shadcn',
      major: 1,
    });
  });

  it('detects MUI-X, MUI, PrimeVue, Radix, Astryx, Fluent', () => {
    expect(detectDesignSystem(snapshot({ packageJson: { dependencies: { '@mui/x-data-grid': '^7.0.0' } } }))?.id).toBe(
      'mui-x'
    );
    expect(detectDesignSystem(snapshot({ packageJson: { dependencies: { '@mui/material': '^7.1.0' } } }))).toEqual({
      id: 'mui',
      major: 7,
    });
    expect(detectDesignSystem(snapshot({ packageJson: { dependencies: { primevue: '^4.0.0' } } }))?.id).toBe(
      'primevue'
    );
    expect(detectDesignSystem(snapshot({ packageJson: { dependencies: { 'radix-ui': '^1.0.0' } } }))?.id).toBe('radix');
    expect(
      detectDesignSystem(snapshot({ packageJson: { dependencies: { '@astryxdesign/core': '^0.1.3' } } }))?.id
    ).toBe('astryx');
    expect(
      detectDesignSystem(snapshot({ packageJson: { dependencies: { '@fluentui/react-components': '^9.0.0' } } }))?.id
    ).toBe('fluent');
  });

  it('returns null when there is no design system', () => {
    expect(detectDesignSystem(snapshot({ packageJson: { dependencies: { react: '^19' } } }))).toBeNull();
  });
});

describe('detectRunner + environment', () => {
  it('detects the runner from deps', () => {
    expect(detectRunner(snapshot({ packageJson: { devDependencies: { jest: '^29' } } }))).toBe('jest');
    expect(
      detectRunner(snapshot({ packageJson: { devDependencies: { vitest: '^4', '@vitest/browser-playwright': '^4' } } }))
    ).toBe('vitest-browser');
    expect(detectRunner(snapshot({ packageJson: { devDependencies: { vitest: '^4' } } }))).toBe('vitest');
    expect(detectRunner(snapshot({ packageJson: { devDependencies: { '@playwright/test': '^1.61' } } }))).toBe(
      'playwright'
    );
    expect(detectRunner(snapshot())).toBeNull();
  });

  it('detects TypeScript by dep or tsconfig, and monorepo by markers', () => {
    expect(detectTypeScript(snapshot({ packageJson: { devDependencies: { typescript: '^5' } } }))).toBe(true);
    expect(detectTypeScript(snapshot({ hasTsConfig: true }))).toBe(true);
    expect(detectTypeScript(snapshot())).toBe(false);
    expect(detectMonorepo(snapshot({ workspaceMarkers: ['pnpm-workspace.yaml'] }))).toBe(true);
    expect(detectMonorepo(snapshot({ packageJson: { workspaces: ['packages/*'] } }))).toBe(true);
    expect(detectMonorepo(snapshot())).toBe(false);
  });
});

describe('detect (orchestrator)', () => {
  it('reports missing and malformed package.json', () => {
    expect(detect(snapshot()).diagnostics.some(d => d.code === 'E_NO_PACKAGE_JSON')).toBe(true);
    expect(
      detect(snapshot({ packageJsonMalformed: true })).diagnostics.some(d => d.code === 'E_MALFORMED_PACKAGE_JSON')
    ).toBe(true);
  });
});
