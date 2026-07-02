import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React, { type JSX, type KeyboardEvent, useCallback, useMemo, useState } from 'react';

import styles from './styles.module.css';

/**
 * The one canonical architecture diagram for Atomic Testing.
 *
 * Embedded in both `docs/core-concepts.mdx` (primary) and
 * `docs/advanced-concepts/architecture.mdx` (same component, no drift) — see #941.
 *
 * Nodes are real HTML <button>s (focusable, keyboard-operable) absolutely
 * positioned over an inline SVG that draws only the connecting edges. Hovering,
 * focusing or pressing a node highlights its edges/neighbors and shows a
 * description + doc link in the side panel.
 */

type NodeKind = 'blueprint' | 'interface' | 'concrete' | 'target';
type Accent = 'blue' | 'blueDeep' | 'sky' | 'teal' | 'indigo' | 'mint' | 'neutral';

type DiagramNode = {
  id: string;
  label: string;
  sublabel?: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  kind: NodeKind;
  accent: Accent;
  description: string;
  docHref?: string;
  docLabel?: string;
};

type DiagramEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
};

type BranchGroup = {
  id: string;
  label: string;
  nodeIds: readonly string[];
  description: string;
};

const VIEW_WIDTH = 880;
const VIEW_HEIGHT = 730;

const ANNOTATIONS: readonly { x: number; label: string }[] = [
  { x: 150, label: 'You declare' },
  { x: 470, label: 'Engine builds & runs' },
];

// Real hierarchy verified against packages/core/src/interactor/Interactor.ts,
// packages/dom-core/src/DOMInteractor.ts, packages/react-core/src/ReactInteractor.ts,
// packages/vue-3/src/VueInteractor.ts and packages/playwright/src/PlaywrightInteractor.ts.
const NODES: readonly DiagramNode[] = [
  {
    id: 'scenePart',
    label: 'ScenePart',
    sublabel: 'blueprint',
    cx: 150,
    cy: 70,
    w: 220,
    h: 68,
    kind: 'blueprint',
    accent: 'neutral',
    description:
      'A declarative blueprint — a plain object pairing each part name with a PartLocator and a driver class. Nothing runs a ScenePart at test time; the TestEngine is built from it.',
    docHref: '/docs/core-concepts#scenepart',
    docLabel: 'ScenePart in Core Concepts',
  },
  {
    id: 'locator',
    label: 'Locator',
    sublabel: 'PartLocator',
    cx: 150,
    cy: 196,
    w: 200,
    h: 64,
    kind: 'concrete',
    accent: 'mint',
    description:
      "Finds a component on the page — e.g. byDataTestId('submit'). ScenePart pairs a locator with a driver class, and the driver carries that locator down to the Interactor.",
    docHref: '/docs/core-concepts#locator',
    docLabel: 'Locator in Core Concepts',
  },
  {
    id: 'testEngine',
    label: 'TestEngine',
    cx: 470,
    cy: 70,
    w: 220,
    h: 68,
    kind: 'concrete',
    accent: 'blue',
    description:
      "Renders the scene and builds one ComponentDriver per ScenePart entry. Each package's createTestEngine (react-18, react-19, vue-3, playwright, dom-core) constructs the matching Interactor subclass and injects it into every driver.",
    docHref: '/docs/core-concepts#test-engine',
    docLabel: 'Test Engine in Core Concepts',
  },
  {
    id: 'componentDriver',
    label: 'ComponentDriver',
    cx: 470,
    cy: 196,
    w: 220,
    h: 68,
    kind: 'concrete',
    accent: 'sky',
    description:
      'The semantic API a test calls — click(), setValue(), getText(). Holds the locator and interactor it was built with, and may nest child drivers to compose complex widgets from simpler ones.',
    docHref: '/docs/core-concepts#component-driver',
    docLabel: 'Component Driver in Core Concepts',
  },
  {
    id: 'interactor',
    label: 'Interactor',
    sublabel: 'interface',
    cx: 470,
    cy: 322,
    w: 220,
    h: 64,
    kind: 'interface',
    accent: 'neutral',
    description:
      'The low-level contract every driver method delegates to — click, enterText, getText, and more. Swapping the implementation is what lets the same driver code run against jsdom or a real browser.',
    docHref: '/docs/advanced-concepts/interactor',
    docLabel: 'Interactor guide',
  },
  {
    id: 'domInteractor',
    label: 'DOMInteractor',
    cx: 300,
    cy: 444,
    w: 210,
    h: 64,
    kind: 'concrete',
    accent: 'blueDeep',
    description:
      'Implements Interactor with @testing-library utilities. Used directly for framework-agnostic DOM tests, and extended by ReactInteractor and VueInteractor.',
    docHref: '/docs/advanced-concepts/interactor#available-interactors',
    docLabel: 'Available interactors',
  },
  {
    id: 'playwrightInteractor',
    label: 'PlaywrightInteractor',
    sublabel: '@atomic-testing/playwright',
    cx: 660,
    cy: 444,
    w: 220,
    h: 64,
    kind: 'concrete',
    accent: 'indigo',
    description:
      'Implements Interactor directly against a Playwright Page, driving a real browser instead of jsdom. createTestEngine from @atomic-testing/playwright constructs it.',
    docHref: '/docs/advanced-concepts/interactor#available-interactors',
    docLabel: 'Available interactors',
  },
  {
    id: 'reactInteractor',
    label: 'ReactInteractor',
    sublabel: '@atomic-testing/react-core',
    cx: 180,
    cy: 566,
    w: 190,
    h: 64,
    kind: 'concrete',
    accent: 'sky',
    description:
      "Extends DOMInteractor and wraps every interaction in React's act(), so state updates flush before the next assertion. createTestEngine from @atomic-testing/react-18 and @atomic-testing/react-19 construct it.",
    docHref: '/docs/advanced-concepts/interactor#available-interactors',
    docLabel: 'Available interactors',
  },
  {
    id: 'vueInteractor',
    label: 'VueInteractor',
    sublabel: '@atomic-testing/vue-3',
    cx: 410,
    cy: 566,
    w: 190,
    h: 64,
    kind: 'concrete',
    accent: 'teal',
    description:
      "Extends DOMInteractor and calls Vue's nextTick() after every interaction, so reactive updates settle before the next assertion. createTestEngine from @atomic-testing/vue-3 constructs it.",
    docHref: '/docs/advanced-concepts/interactor#available-interactors',
    docLabel: 'Available interactors',
  },
  {
    id: 'domTarget',
    label: 'DOM (jsdom)',
    sublabel: 'unit / DOM tests',
    cx: 300,
    cy: 688,
    w: 240,
    h: 56,
    kind: 'target',
    accent: 'neutral',
    description:
      'Where DOMInteractor, ReactInteractor and VueInteractor resolve locators — a jsdom document with no real layout or paint. Exercised by pnpm test:dom.',
  },
  {
    id: 'browserTarget',
    label: 'Browser',
    sublabel: 'end-to-end tests',
    cx: 660,
    cy: 566,
    w: 220,
    h: 56,
    kind: 'target',
    accent: 'neutral',
    description:
      'Where PlaywrightInteractor resolves locators — a real Chromium, Firefox or WebKit instance with full layout and paint. Exercised by pnpm test:e2e.',
  },
];

// Every edge reads as "[source] [verb phrase] [target]" — one consistent
// delegation/dataflow semantic throughout (see #941, finding D1-07). None of
// them conflate an interactor with a test type ("runs tests in ...").
const EDGES: readonly DiagramEdge[] = [
  { id: 'e-scene-engine', from: 'scenePart', to: 'testEngine', label: 'feeds' },
  { id: 'e-scene-locator', from: 'scenePart', to: 'locator', label: 'pairs with' },
  { id: 'e-locator-driver', from: 'locator', to: 'componentDriver', label: 'passed to' },
  { id: 'e-engine-driver', from: 'testEngine', to: 'componentDriver', label: 'instantiates' },
  { id: 'e-driver-interactor', from: 'componentDriver', to: 'interactor', label: 'delegates to' },
  { id: 'e-interactor-dom', from: 'interactor', to: 'domInteractor', label: 'implemented by' },
  { id: 'e-interactor-pw', from: 'interactor', to: 'playwrightInteractor', label: 'implemented by' },
  { id: 'e-dom-react', from: 'domInteractor', to: 'reactInteractor', label: 'extended by' },
  { id: 'e-dom-vue', from: 'domInteractor', to: 'vueInteractor', label: 'extended by' },
  { id: 'e-dom-target', from: 'domInteractor', to: 'domTarget', label: 'resolves against' },
  { id: 'e-react-target', from: 'reactInteractor', to: 'domTarget', label: 'resolves against' },
  { id: 'e-vue-target', from: 'vueInteractor', to: 'domTarget', label: 'resolves against' },
  { id: 'e-pw-target', from: 'playwrightInteractor', to: 'browserTarget', label: 'resolves against' },
];

const BRANCH_GROUPS: readonly BranchGroup[] = [
  {
    id: 'branch:dom',
    label: 'Unit / DOM tests',
    nodeIds: ['interactor', 'domInteractor', 'reactInteractor', 'vueInteractor', 'domTarget'],
    description:
      'Unit and DOM tests run through DOMInteractor — directly, or extended by ReactInteractor (act()) and VueInteractor (nextTick()) — against jsdom. No real browser is involved.',
  },
  {
    id: 'branch:e2e',
    label: 'End-to-end tests',
    nodeIds: ['interactor', 'playwrightInteractor', 'browserTarget'],
    description:
      'End-to-end tests run through PlaywrightInteractor, which drives a real Chromium, Firefox or WebKit browser instead of jsdom.',
  },
];

const KIND_LABEL: Record<NodeKind, string> = {
  blueprint: 'declarative blueprint',
  interface: 'interface',
  concrete: 'runtime class',
  target: 'test environment',
};

const KIND_CLASS: Record<NodeKind, string> = {
  blueprint: styles.nodeBlueprint,
  interface: styles.nodeInterface,
  concrete: styles.nodeConcrete,
  target: styles.nodeTarget,
};

const ACCENT_CLASS: Record<Accent, string> = {
  blue: styles.accentBlue,
  blueDeep: styles.accentBlueDeep,
  sky: styles.accentSky,
  teal: styles.accentTeal,
  indigo: styles.accentIndigo,
  mint: styles.accentMint,
  neutral: styles.accentNeutral,
};

const NODE_BY_ID = new Map(NODES.map(node => [node.id, node]));
const BRANCH_BY_ID = new Map(BRANCH_GROUPS.map(group => [group.id, group]));

const EDGE_GAP = 6;

type Rect = { cx: number; cy: number; w: number; h: number };
type EdgeGeometry = { x1: number; y1: number; x2: number; y2: number; midX: number; midY: number };

/** Point on `from`'s border, in the direction of (toX, toY) — for clean arrow starts/ends. */
function pointTowards(from: Rect, toX: number, toY: number): { x: number; y: number } {
  const dx = toX - from.cx;
  const dy = toY - from.cy;
  if (dx === 0 && dy === 0) return { x: from.cx, y: from.cy };
  const scaleX = dx !== 0 ? from.w / 2 / Math.abs(dx) : Number.POSITIVE_INFINITY;
  const scaleY = dy !== 0 ? from.h / 2 / Math.abs(dy) : Number.POSITIVE_INFINITY;
  const scale = Math.min(scaleX, scaleY);
  return { x: from.cx + dx * scale, y: from.cy + dy * scale };
}

function edgeGeometry(edge: DiagramEdge): EdgeGeometry | null {
  const source = NODE_BY_ID.get(edge.from);
  const target = NODE_BY_ID.get(edge.to);
  if (!source || !target) return null;
  const start = pointTowards(source, target.cx, target.cy);
  const end = pointTowards(target, source.cx, source.cy);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  return {
    x1: start.x + ux * EDGE_GAP,
    y1: start.y + uy * EDGE_GAP,
    x2: end.x - ux * EDGE_GAP,
    y2: end.y - uy * EDGE_GAP,
    midX: (start.x + end.x) / 2,
    midY: (start.y + end.y) / 2,
  };
}

type Highlight = { nodes: ReadonlySet<string>; edges: ReadonlySet<string> };
const EMPTY_HIGHLIGHT: Highlight = { nodes: new Set(), edges: new Set() };

function computeHighlight(activeId: string | null): Highlight {
  if (!activeId) return EMPTY_HIGHLIGHT;

  const group = BRANCH_BY_ID.get(activeId);
  if (group) {
    const nodes = new Set<string>(group.nodeIds);
    const edges = new Set(EDGES.filter(edge => nodes.has(edge.from) && nodes.has(edge.to)).map(edge => edge.id));
    return { nodes, edges };
  }

  if (!NODE_BY_ID.has(activeId)) return EMPTY_HIGHLIGHT;
  const nodes = new Set<string>([activeId]);
  const edges = new Set<string>();
  for (const edge of EDGES) {
    if (edge.from === activeId || edge.to === activeId) {
      edges.add(edge.id);
      nodes.add(edge.from);
      nodes.add(edge.to);
    }
  }
  return { nodes, edges };
}

type PanelContent = {
  kindLabel: string;
  title: string;
  sublabel?: string;
  description: string;
  docHref?: string;
  docLabel?: string;
};

function resolveActiveContent(activeId: string | null): PanelContent | null {
  if (!activeId) return null;

  const group = BRANCH_BY_ID.get(activeId);
  if (group) {
    return { kindLabel: 'test runner', title: group.label, description: group.description };
  }

  const node = NODE_BY_ID.get(activeId);
  if (!node) return null;
  return {
    kindLabel: KIND_LABEL[node.kind],
    title: node.label,
    sublabel: node.sublabel,
    description: node.description,
    docHref: node.docHref,
    docLabel: node.docLabel,
  };
}

/** Hover, keyboard focus, and click-to-pin all drive the same highlight state. */
function useHighlightState() {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const activeId = hoverId ?? pinnedId;

  const preview = useCallback((id: string) => setHoverId(id), []);
  const endPreview = useCallback(() => setHoverId(null), []);
  const togglePin = useCallback((id: string) => setPinnedId(current => (current === id ? null : id)), []);
  const clear = useCallback(() => {
    setPinnedId(null);
    setHoverId(null);
  }, []);

  return { activeId, preview, endPreview, togglePin, clear };
}

function DiagramNodeButton({
  node,
  isActive,
  isDimmed,
  isPinned,
  onPreview,
  onEndPreview,
  onTogglePin,
}: {
  node: DiagramNode;
  isActive: boolean;
  isDimmed: boolean;
  isPinned: boolean;
  onPreview: () => void;
  onEndPreview: () => void;
  onTogglePin: () => void;
}): JSX.Element {
  return (
    <button
      type='button'
      className={clsx(
        styles.node,
        KIND_CLASS[node.kind],
        ACCENT_CLASS[node.accent],
        isActive && styles.nodeActive,
        isDimmed && styles.nodeDimmed,
      )}
      style={{ left: node.cx - node.w / 2, top: node.cy - node.h / 2, width: node.w, height: node.h }}
      aria-pressed={isPinned}
      onMouseEnter={onPreview}
      onMouseLeave={onEndPreview}
      onFocus={onPreview}
      onBlur={onEndPreview}
      onClick={onTogglePin}>
      <span className={styles.nodeLabel}>{node.label}</span>
      {node.sublabel ? <span className={styles.nodeSublabel}>{node.sublabel}</span> : null}
    </button>
  );
}

function DiagramEdgeLine({ edge, isActive, isDimmed }: { edge: DiagramEdge; isActive: boolean; isDimmed: boolean }): JSX.Element | null {
  const geometry = useMemo(() => edgeGeometry(edge), [edge]);
  if (!geometry) return null;
  const { x1, y1, x2, y2, midX, midY } = geometry;
  const labelWidth = Math.max(58, edge.label.length * 6.4 + 16);

  return (
    <g className={clsx(styles.edge, isActive && styles.edgeActive, isDimmed && styles.edgeDimmed)}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={isActive ? 'url(#at-arrow-active)' : 'url(#at-arrow-muted)'} />
      <g transform={`translate(${midX - labelWidth / 2}, ${midY - 10})`}>
        <rect width={labelWidth} height={20} rx={10} className={styles.edgeLabelBg} />
        <text x={labelWidth / 2} y={14} textAnchor='middle' className={styles.edgeLabelText}>
          {edge.label}
        </text>
      </g>
    </g>
  );
}

export default function ArchitectureDiagram(): JSX.Element {
  const { activeId, preview, endPreview, togglePin, clear } = useHighlightState();
  const highlight = useMemo(() => computeHighlight(activeId), [activeId]);
  const content = resolveActiveContent(activeId);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') clear();
    },
    [clear],
  );

  return (
    <div className={styles.wrapper} onKeyDown={handleKeyDown}>
      <div className={styles.toolbar} role='group' aria-label='Highlight a test runner branch'>
        <span className={styles.toolbarLabel}>Which branch actually runs?</span>
        {BRANCH_GROUPS.map(group => (
          <button
            key={group.id}
            type='button'
            className={clsx(styles.branchButton, activeId === group.id && styles.branchButtonActive)}
            aria-pressed={activeId === group.id}
            onMouseEnter={() => preview(group.id)}
            onMouseLeave={endPreview}
            onFocus={() => preview(group.id)}
            onBlur={endPreview}
            onClick={() => togglePin(group.id)}>
            {group.label}
          </button>
        ))}
        {activeId ? (
          <button type='button' className={styles.clearButton} onClick={clear}>
            Clear
          </button>
        ) : null}
      </div>

      <div className={styles.stage}>
        <div className={styles.diagramScroll}>
          <div className={styles.diagramPane} style={{ width: VIEW_WIDTH, height: VIEW_HEIGHT }}>
            <svg
              className={styles.edgesLayer}
              viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
              width={VIEW_WIDTH}
              height={VIEW_HEIGHT}
              aria-hidden='true'>
              <defs>
                <marker id='at-arrow-muted' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                  <path d='M0,0 L10,5 L0,10 z' className={styles.arrowMuted} />
                </marker>
                <marker id='at-arrow-active' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
                  <path d='M0,0 L10,5 L0,10 z' className={styles.arrowActive} />
                </marker>
              </defs>
              {ANNOTATIONS.map(annotation => (
                <text key={annotation.x} x={annotation.x} y={20} textAnchor='middle' className={styles.annotationText}>
                  {annotation.label}
                </text>
              ))}
              {EDGES.map(edge => (
                <DiagramEdgeLine
                  key={edge.id}
                  edge={edge}
                  isActive={highlight.edges.has(edge.id)}
                  isDimmed={activeId !== null && !highlight.edges.has(edge.id)}
                />
              ))}
            </svg>
            <div className={styles.nodesLayer}>
              {NODES.map(node => (
                <DiagramNodeButton
                  key={node.id}
                  node={node}
                  isActive={highlight.nodes.has(node.id)}
                  isDimmed={activeId !== null && !highlight.nodes.has(node.id)}
                  isPinned={activeId === node.id}
                  onPreview={() => preview(node.id)}
                  onEndPreview={endPreview}
                  onTogglePin={() => togglePin(node.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <aside className={styles.panel} aria-live='polite'>
          {content ? (
            <>
              <div className={styles.panelKind}>{content.kindLabel}</div>
              <h3 className={styles.panelTitle}>
                {content.title}
                {content.sublabel ? <span className={styles.panelSublabel}> · {content.sublabel}</span> : null}
              </h3>
              <p className={styles.panelBody}>{content.description}</p>
              {content.docHref ? (
                <Link className={styles.panelLink} to={content.docHref}>
                  {content.docLabel ?? 'Read more'} →
                </Link>
              ) : null}
            </>
          ) : (
            <>
              <div className={styles.panelKind}>Overview</div>
              <h3 className={styles.panelTitle}>Explore the architecture</h3>
              <p className={styles.panelBody}>
                Hover, focus, or press a node to see what it does and how it connects. Try the buttons above to see
                which Interactor subclass actually runs for unit/DOM tests versus end-to-end tests.
              </p>
            </>
          )}
        </aside>
      </div>

      <p className={styles.legend}>
        <span className={clsx(styles.legendSwatch, styles.legendSwatchDashed)} aria-hidden='true' /> declarative /
        interface — not a runtime instance
        <span className={clsx(styles.legendSwatch, styles.legendSwatchDotted)} aria-hidden='true' /> test environment
        <span className={clsx(styles.legendSwatch, styles.legendSwatchSolid)} aria-hidden='true' /> concrete class
        that runs
      </p>
    </div>
  );
}
