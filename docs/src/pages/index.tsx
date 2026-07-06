import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import CodeBlock from '@theme/CodeBlock';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React, { type JSX, type ReactNode, useCallback, useRef, useState } from 'react';

import styles from './index.module.css';

const GITHUB_URL = 'https://github.com/atomic-testing/atomic-testing';
const COPY_FEEDBACK_MS = 1600;

const reactCode = `import { createTestEngine } from '@atomic-testing/react-19';
import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId } from '@atomic-testing/core';

// One scene definition — reused on every runtime
const scene = {
  greeting: { locator: byDataTestId('greeting'),   driver: HTMLElementDriver },
  button:   { locator: byDataTestId('welcome-btn'), driver: HTMLButtonDriver },
};

it('welcomes the user on click', async () => {
  const engine = createTestEngine(<Welcome name="Alice" />, scene);

  expect(await engine.parts.greeting.getText()).toBe('Hello Alice!');
  await engine.parts.button.click();
  expect(await engine.parts.button.getText()).toBe('Welcome!');

  await engine.cleanUp();
});`;

const vueCode = `import { createTestEngine } from '@atomic-testing/vue-3';
import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId } from '@atomic-testing/core';
import Welcome from './Welcome.vue';

// Same scene definition — nothing changes
const scene = {
  greeting: { locator: byDataTestId('greeting'),   driver: HTMLElementDriver },
  button:   { locator: byDataTestId('welcome-btn'), driver: HTMLButtonDriver },
};

it('welcomes the user on click', async () => {
  const engine = createTestEngine(Welcome, scene);

  expect(await engine.parts.greeting.getText()).toBe('Hello Alice!');
  await engine.parts.button.click();
  expect(await engine.parts.button.getText()).toBe('Welcome!');

  await engine.cleanUp();
});`;

const playCode = `import { createTestEngine } from '@atomic-testing/playwright';
import { HTMLButtonDriver, HTMLElementDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId } from '@atomic-testing/core';
import { test, expect } from '@playwright/test';

// Same scene definition — nothing changes
const scene = {
  greeting: { locator: byDataTestId('greeting'),   driver: HTMLElementDriver },
  button:   { locator: byDataTestId('welcome-btn'), driver: HTMLButtonDriver },
};

test('welcomes the user on click', async ({ page }) => {
  await page.goto('/welcome');
  const engine = createTestEngine(page, scene);

  expect(await engine.parts.greeting.getText()).toBe('Hello Alice!');
  await engine.parts.button.click();
  expect(await engine.parts.button.getText()).toBe('Welcome!');

  await engine.cleanUp();
});`;

type FrameworkId = 'react' | 'vue' | 'playwright';

type Framework = {
  id: FrameworkId;
  label: string;
  accent: string;
  code: string;
};

const frameworks: Framework[] = [
  { id: 'react', label: '⚛ React', accent: '#38bdf8', code: reactCode },
  { id: 'vue', label: '💚 Vue 3', accent: '#14b8b0', code: vueCode },
  { id: 'playwright', label: '🎭 Playwright', accent: '#6366f1', code: playCode },
];

// Keyed to the active framework tab so the hero install command always matches
// the code sample the reader is currently looking at.
const FRAMEWORK_INSTALLS: Record<FrameworkId, string> = {
  react: 'pnpm add @atomic-testing/core @atomic-testing/react-19 @atomic-testing/component-driver-html',
  vue: 'pnpm add @atomic-testing/core @atomic-testing/vue-3 @atomic-testing/component-driver-html',
  playwright: 'pnpm add @atomic-testing/core @atomic-testing/playwright @atomic-testing/component-driver-html',
};

type AnimationId = 'orbit' | 'compose';

function GitHubIcon({ size = 18 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox='0 0 16 16' fill='currentColor' aria-hidden='true'>
      <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z' />
    </svg>
  );
}

function useCopy(): { copied: boolean; copy: (text: string) => void } {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  }, []);

  return { copied, copy };
}

function InstallBox({ framework }: { framework: FrameworkId }): JSX.Element {
  const { copied, copy } = useCopy();
  const installCommand = FRAMEWORK_INSTALLS[framework];
  return (
    <div className={styles.installBox}>
      <span className={styles.installPrompt}>$</span>
      <code className={styles.installCmd}>{installCommand}</code>
      <button
        type='button'
        className={styles.installCopy}
        onClick={() => copy(installCommand)}
        aria-label='Copy install command'>
        {copied ? <span className={styles.copied}>✓ copied</span> : <span>copy</span>}
      </button>
    </div>
  );
}

function OrbitVisual(): JSX.Element {
  return (
    <div className={styles.orbit}>
      <div className={styles.nucleus} />
      <div className={styles.nucleusGlow} />

      <div className={styles.ringWrap} style={{ transform: 'rotate(0deg)' }}>
        <div className={clsx(styles.ringSpin, styles.ringSpin1)}>
          <div className={styles.ring} style={{ borderColor: 'rgba(45,107,230,.40)' }} />
          <div
            className={styles.electron}
            style={{ background: '#2d6be3', boxShadow: '0 0 14px rgba(45,107,230,.7)' }}
          />
        </div>
      </div>

      <div className={styles.ringWrap} style={{ transform: 'rotate(60deg)' }}>
        <div className={clsx(styles.ringSpin, styles.ringSpin2)}>
          <div className={styles.ring} style={{ borderColor: 'rgba(20,184,176,.40)' }} />
          <div
            className={styles.electron}
            style={{ background: '#14b8b0', boxShadow: '0 0 14px rgba(20,184,176,.7)' }}
          />
        </div>
      </div>

      <div className={styles.ringWrap} style={{ transform: 'rotate(120deg)' }}>
        <div className={clsx(styles.ringSpin, styles.ringSpin3)}>
          <div className={styles.ring} style={{ borderColor: 'rgba(56,189,248,.42)' }} />
          <div
            className={styles.electron}
            style={{ background: '#38bdf8', boxShadow: '0 0 14px rgba(56,189,248,.7)' }}
          />
        </div>
      </div>

      <span className={clsx(styles.chip, styles.chipBlue, styles.chipTopLeft)}>byDataTestId()</span>
      <span className={clsx(styles.chip, styles.chipTeal, styles.chipTopRight)}>HTMLButtonDriver</span>
      <span className={clsx(styles.chip, styles.chipInk, styles.chipBottomLeft)}>engine.parts</span>
    </div>
  );
}

function ComposeVisual(): JSX.Element {
  const tiers: { title: string; subtitle: string; accent: string }[] = [
    { title: 'Atoms', subtitle: 'Button · Input · Select', accent: '#2d6be3' },
    { title: 'Molecules', subtitle: 'SearchField · FormRow', accent: '#14b8b0' },
    { title: 'Organism', subtitle: 'LoginForm → Page', accent: '#38bdf8' },
  ];
  return (
    <div className={styles.compose}>
      {tiers.map((tier, index) => (
        <React.Fragment key={tier.title}>
          <div className={styles.composeCard} style={{ borderColor: tier.accent }}>
            <span className={styles.composeBadge} style={{ background: tier.accent }} aria-hidden='true' />
            <div>
              <div className={styles.composeTitle}>{tier.title}</div>
              <div className={styles.composeSub}>{tier.subtitle}</div>
            </div>
          </div>
          {index < tiers.length - 1 ? <div className={styles.composeConnector} aria-hidden='true' /> : null}
        </React.Fragment>
      ))}
      <div className={styles.composeResult}>✓ composed test · runs anywhere</div>
    </div>
  );
}

function AnimationToggle({
  active,
  onSelect,
}: {
  active: AnimationId;
  onSelect: (id: AnimationId) => void;
}): JSX.Element {
  return (
    <div className={styles.animToggle} role='tablist' aria-label='Hero visual'>
      <button
        type='button'
        role='tab'
        aria-selected={active === 'orbit'}
        className={clsx(styles.animTab, active === 'orbit' && styles.animTabActive)}
        onClick={() => onSelect('orbit')}>
        ⚛ Orbit
      </button>
      <button
        type='button'
        role='tab'
        aria-selected={active === 'compose'}
        className={clsx(styles.animTab, active === 'compose' && styles.animTabActive)}
        onClick={() => onSelect('compose')}>
        🧩 Assemble
      </button>
    </div>
  );
}

function HeroSection({ activeFramework }: { activeFramework: FrameworkId }): JSX.Element {
  const [animation, setAnimation] = useState<AnimationId>('orbit');
  return (
    <section className={styles.hero}>
      <div className={styles.heroTint} aria-hidden='true' />
      <div className={styles.heroGrid} aria-hidden='true' />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <div className={styles.badge}>
            <span className={styles.badgeChip}>Pre-1.0</span>
            Portable UI testing for React · Vue · Angular · Playwright
          </div>

          <h1 className={styles.heroTitle}>
            Write your UI tests
            <br />
            <span className={styles.gradientWord}>once.</span> Run them anywhere.
          </h1>

          <p className={styles.heroSubtitle}>
            Stop rewriting your test suite every time you switch UI frameworks or upgrade a component library. Atomic
            Testing composes tiny, reusable <strong>component drivers</strong> into portable test scenes — so the
            same semantic test runs across frameworks, libraries, and environments. Learn once, test any UI.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.btnPrimary} to='/docs/quick-start'>
              Get started →
            </Link>
            <a className={styles.btnSecondary} href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>
              <GitHubIcon />
              Star on GitHub
            </a>
          </div>

          <InstallBox framework={activeFramework} />

          <Link className={styles.heroWhyLink} to='/docs/why-atomic-testing'>
            Why Atomic Testing — and when NOT to use it →
          </Link>
        </div>

        <div className={styles.heroVisual}>
          <AnimationToggle active={animation} onSelect={setAnimation} />
          {animation === 'orbit' ? <OrbitVisual /> : <ComposeVisual />}
        </div>
      </div>
    </section>
  );
}

function MagicSection({
  active,
  onSelect,
}: {
  active: FrameworkId;
  onSelect: (id: FrameworkId) => void;
}): JSX.Element {
  const { copied, copy } = useCopy();
  const activeFramework = frameworks.find(framework => framework.id === active) ?? frameworks[0];

  return (
    <section className={styles.magic}>
      <header className={styles.sectionHead}>
        <div className={clsx(styles.eyebrow, styles.eyebrowBlue)}>The magic</div>
        <h2 className={styles.sectionTitle}>One test. Every framework.</h2>
        <p className={styles.sectionSubtitle}>
          Switch the runtime tab — notice the scene definition and the test body never change. Only the import and mount
          line differ.
        </p>
      </header>

      <div className={styles.terminal}>
        <div className={styles.terminalBar}>
          <span className={styles.trafficLights} aria-hidden='true'>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </span>
          {frameworks.map(framework => (
            <button
              type='button'
              key={framework.id}
              className={clsx(styles.fwTab, active === framework.id && styles.fwTabActive)}
              style={active === framework.id ? { boxShadow: `inset 0 -2px 0 ${framework.accent}` } : undefined}
              onClick={() => onSelect(framework.id)}
              aria-pressed={active === framework.id}>
              {framework.label}
            </button>
          ))}
          <span className={styles.fileName}>welcome.test.ts</span>
          <button
            type='button'
            className={styles.terminalCopy}
            onClick={() => copy(activeFramework.code)}
            aria-label='Copy test code'>
            {copied ? <span className={styles.copied}>✓ copied</span> : <span>copy</span>}
          </button>
        </div>
        <div className={styles.terminalBody}>
          <CodeBlock language='tsx'>{activeFramework.code}</CodeBlock>
        </div>
      </div>

      <div className={styles.magicCaption}>
        <span className={styles.tealPill}>✓ identical scene &amp; assertions</span>
        <span>— your testing knowledge transfers completely.</span>
      </div>
    </section>
  );
}

type ComposeStep = {
  eyebrow: string;
  eyebrowColor: string;
  code?: string;
  text: ReactNode;
  caption: ReactNode;
  variant?: 'result';
};

const composeSteps: ComposeStep[] = [
  {
    eyebrow: 'Locator',
    eyebrowColor: '#5fe3c8',
    code: "byDataTestId('btn')",
    text: 'Finds the element — by test id, role, attribute or CSS.',
    caption: '',
  },
  {
    eyebrow: 'Driver',
    eyebrowColor: '#38bdf8',
    code: 'HTMLButtonDriver',
    text: (
      <>
        Semantic API — <span className={styles.bandHint}>.click()</span>,{' '}
        <span className={styles.bandHint}>.getText()</span>.
      </>
    ),
    caption: '',
  },
  {
    eyebrow: 'Scene → Engine',
    eyebrowColor: '#2d6be3',
    code: 'engine.parts.btn',
    text: 'Orchestrates the whole test, any runtime.',
    caption: '',
  },
  {
    eyebrow: 'Result',
    eyebrowColor: '#5fe3c8',
    text: '✓ Passing everywhere',
    caption: 'React · Vue · Angular · Playwright.',
    variant: 'result',
  },
];

function ComposableSection(): JSX.Element {
  const connectors = ['+', '→', '='];
  return (
    <section className={styles.band}>
      <div className={styles.bandGrid} aria-hidden='true' />
      <div className={styles.bandInner}>
        <header className={styles.bandHead}>
          <div className={clsx(styles.eyebrow, styles.eyebrowTeal)}>Composable by design</div>
          <h2 className={styles.bandTitle}>Small atoms. Infinite tests.</h2>
          <p className={styles.bandSubtitle}>
            Each primitive is tiny and replaceable: locators and drivers snap into scenes, scenes into engines,
            engines into suites that outlive any framework.
          </p>
        </header>
        <div className={styles.bandRow}>
          {composeSteps.map((step, index) => (
            <React.Fragment key={step.eyebrow}>
              <div className={clsx(styles.bandCard, step.variant === 'result' && styles.bandCardResult)}>
                <div className={styles.bandEyebrow} style={{ color: step.eyebrowColor }}>
                  {step.eyebrow}
                </div>
                {step.variant === 'result' ? (
                  <div className={styles.bandResultValue}>{step.text}</div>
                ) : (
                  <div className={styles.bandCode}>{step.code}</div>
                )}
                <div className={step.variant === 'result' ? styles.bandResultCaption : styles.bandText}>
                  {step.variant === 'result' ? step.caption : step.text}
                </div>
              </div>
              {index < connectors.length ? (
                <div className={styles.bandConnector} aria-hidden='true'>
                  {connectors[index]}
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function TradeoffsSection(): JSX.Element {
  return (
    <section className={styles.tradeoffs}>
      <div className={styles.tradeoffsInner}>
        <div className={clsx(styles.eyebrow, styles.eyebrowBlue)}>Is it for you?</div>
        <h2 className={styles.tradeoffsTitle}>Honest tradeoffs</h2>
        <p className={styles.tradeoffsSubtitle}>
          Atomic Testing adds a driver layer on top of Testing Library and Playwright — that&apos;s a learning curve
          and a dependency, not a free lunch. It&apos;s a poor fit for a single throwaway component, a prototype
          you&apos;ll never maintain, or a team unwilling to invest in the pattern up front. Runtime overhead is
          negligible — a driver call is a thin async wrapper around the same Testing Library/Playwright call you&apos;d
          write by hand — and lock-in risk is low: every driver bottoms out in those same portable primitives, so
          dropping the abstraction later means calling them directly, not rewriting your component tree.
        </p>
        <div className={styles.tradeoffsLinks}>
          <Link className={styles.tradeoffsLink} to='/docs/why-atomic-testing'>
            When NOT to use Atomic Testing →
          </Link>
          <Link className={styles.tradeoffsLink} to='/docs/advanced-concepts/atomic-testing-vs-rtl'>
            How it compares to React Testing Library →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection(): JSX.Element {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaCard}>
        <div className={styles.ctaGrid} aria-hidden='true' />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Test once. Ship with confidence.</h2>
          <p className={styles.ctaSubtitle}>Get your first portable test running in five minutes.</p>
          <div className={styles.ctaActions}>
            <Link className={styles.ctaPrimary} to='/docs/quick-start'>
              Read the Quick Start →
            </Link>
            <Link className={styles.ctaSecondary} to='/docs/api-overview'>
              Browse the API
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  // Shared with MagicSection so the hero install command always matches whichever
  // framework tab the reader has selected.
  const [activeFramework, setActiveFramework] = useState<FrameworkId>('react');
  return (
    <Layout
      title={`${siteConfig.title} — Write your UI tests once`}
      description='Portable UI testing library. Compose reusable component drivers into test scenes that run across React, Vue, Angular and Playwright.'>
      <main>
        <HeroSection activeFramework={activeFramework} />
        <MagicSection active={activeFramework} onSelect={setActiveFramework} />
        <ComposableSection />
        <HomepageFeatures />
        <TradeoffsSection />
        <FinalCtaSection />
      </main>
    </Layout>
  );
}
