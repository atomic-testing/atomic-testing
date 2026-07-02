export const meta = {
  name: 'atomic-testing-docs-audit',
  description:
    'Audit Atomic Testing Docusaurus docs: market research + 5-dimension evaluation, each finding adversarially verified against source files',
  phases: [
    {
      title: 'Market',
      detail: 'research how leading testing/docs sites organize content, pitch, present architecture',
    },
    { title: 'Evaluate', detail: 'one agent per audit dimension, grounded in actual files + package source' },
    { title: 'Verify', detail: 'adversarially re-check each finding against the cited file/source' },
    { title: 'Synthesize', detail: 'cross-cutting prioritization' },
  ],
};

// Repo root the audit reads from. Defaults to the current working directory so the
// harness is portable across machines; override by passing { repoRoot } as the
// workflow's args. DOCS/PKGS derive from it.
const REPO = (typeof args === 'object' && args?.repoRoot) || '.';
const DOCS = `${REPO}/docs`;
const PKGS = `${REPO}/packages`;

const FILE_INVENTORY = `
Hand-authored narrative docs (under ${DOCS}/docs):
  intro.mdx (id=intro), quick-start.mdx, framework-guide.mdx, why-atomic-testing.mdx,
  getting-started-tutorial.mdx (id=tutorial), core-concepts.mdx (id=concepts), setup.mdx,
  best-practices.mdx, cheat-sheets.mdx, faq.mdx, api-overview.mdx,
  advanced-concepts/architecture.mdx, advanced-concepts/interactor.mdx,
  advanced-concepts/build-component-driver.mdx, advanced-concepts/atomic-testing-vs-rtl.mdx,
  guides/portal-and-overlays.md
  snippets/: logging-interactor.ts, login-form-driver.ts, login-screen-scene-part.ts, signup-form-e2e.spec.ts
Homepage source: ${DOCS}/src/pages/index.tsx, ${DOCS}/src/components/HomepageFeatures/index.tsx
Config: ${DOCS}/docusaurus.config.ts (tagline), ${DOCS}/sidebars.ts (nav)
Static diagram: ${DOCS}/static/img/diagram-core-concept-simplified.png (referenced where?)
Auto-generated TypeDoc API lives under ${DOCS}/docs/api/** (huge; ~300 files).
Source packages (ground truth for accuracy): ${PKGS}/core, ${PKGS}/dom-core, ${PKGS}/react-core,
  ${PKGS}/react-18, ${PKGS}/react-19, ${PKGS}/vue-3, ${PKGS}/playwright, ${PKGS}/component-driver-html,
  ${PKGS}/component-driver-mui-v9, etc.
Canonical intended architecture is described in ${REPO}/CLAUDE.md (Layer Stack, Interactor Hierarchy, Driver Types).
`;

const FINDINGS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    dimension: { type: 'string' },
    summary: { type: 'string', description: 'overall assessment of this dimension, 3-6 sentences' },
    grade: { type: 'string', description: 'letter grade A/B/C/D/F with +/- allowed' },
    strengths: { type: 'array', items: { type: 'string' } },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string', description: 'short stable id e.g. D1-01' },
          title: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'nit'] },
          category: {
            type: 'string',
            enum: ['accuracy', 'clarity', 'completeness', 'structure', 'pitch', 'consistency', 'accessibility'],
          },
          evidence: { type: 'string', description: 'exact file path + line(s) + short quote proving the issue' },
          why: { type: 'string', description: 'why it matters to a reader/adopter' },
          recommendation: { type: 'string', description: 'concrete, specific fix' },
          confidence: { type: 'number', description: '0..1' },
        },
        required: ['id', 'title', 'severity', 'category', 'evidence', 'why', 'recommendation', 'confidence'],
      },
    },
  },
  required: ['dimension', 'summary', 'grade', 'strengths', 'findings'],
};

const MARKET_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    target: { type: 'string' },
    url: { type: 'string' },
    organization: { type: 'string', description: 'how top-level content is organized (sections, Diataxis adherence)' },
    homepagePitch: { type: 'string', description: 'the elevator pitch / how the landing page sells it' },
    architecturePresentation: {
      type: 'string',
      description: 'how they teach core concepts / architecture, diagrams used',
    },
    tutorialApproach: { type: 'string', description: 'how they get a newcomer to a first passing test' },
    takeaways: {
      type: 'array',
      items: { type: 'string' },
      description: 'specific, transferable lessons for Atomic Testing docs',
    },
  },
  required: ['target', 'organization', 'homepagePitch', 'architecturePresentation', 'tutorialApproach', 'takeaways'],
};

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    findingId: { type: 'string' },
    verdict: { type: 'string', enum: ['confirmed', 'partially-confirmed', 'refuted', 'unverifiable'] },
    adjustedSeverity: { type: 'string', enum: ['critical', 'high', 'medium', 'low', 'nit'] },
    correctedEvidence: {
      type: 'string',
      description: 'what the file actually says (quote), or "" if evidence stands as-is',
    },
    note: { type: 'string', description: 'why confirmed/refuted; flag any overstatement' },
  },
  required: ['findingId', 'verdict', 'note'],
};

// ---------- Phase 1: Market research ----------
const MARKET_TARGETS = [
  {
    key: 'testing-library',
    prompt: `Research the Testing Library docs (testing-library.com — Guiding Principles, intro, React Testing Library docs). It is the closest philosophical sibling/foil to Atomic Testing (Atomic Testing has a page "atomic-testing-vs-rtl"). Focus on: how they articulate their guiding philosophy ("test like a user", avoid implementation details) as a PITCH, how the docs are organized, and how they onboard a newcomer to a first test.`,
  },
  {
    key: 'playwright',
    prompt: `Research the Playwright docs (playwright.dev): the "Why Playwright"/intro, Getting Started, "Writing tests", the Page Object Model guide, and how Core Concepts/architecture are presented. Note their information architecture (Docs vs API split), use of diagrams, and the first-test onboarding flow.`,
  },
  {
    key: 'cypress',
    prompt: `Research Cypress docs (docs.cypress.io): "Why Cypress", the Component Testing section, and "Writing Your First Test". Note how they pitch, how they organize end-to-end vs component testing, and how they teach core concepts.`,
  },
  {
    key: 'storybook',
    prompt: `Research Storybook docs (storybook.js.org/docs) and component-driven.org. Storybook centers a "component-driven" methodology (atoms->molecules->organisms, which Atomic Testing's homepage echoes). Note how they present that methodology, interaction/play-function testing, the "Why Storybook" pitch, and doc organization.`,
  },
  {
    key: 'diataxis-docusaurus',
    prompt: `Research the Diataxis documentation framework (diataxis.fr) — the canonical model splitting docs into Tutorials, How-to guides, Reference, and Explanation. Also note Docusaurus's own recommended docs structure. Explain the model precisely and how a developer-tool library should map its content onto it. "homepagePitch" can describe how Diataxis says to think about audience/intent.`,
  },
  {
    key: 'pom-and-arch-diagrams',
    prompt: `Research how libraries that use a Driver/Adapter/Page-Object architecture present that architecture with DIAGRAMS and concept pages. Look at: Playwright's Page Object Model page, Martin Fowler's PageObject article (martinfowler.com), WebdriverIO PageObjects, and any exemplary layered-architecture concept docs you can find. Atomic Testing's component-driver pattern IS a page-object-for-components. Focus "architecturePresentation" on what makes a layered-architecture diagram clear and where these do it well or poorly. tutorialApproach/homepagePitch can be brief.`,
  },
];

phase('Market');
const market = await parallel(
  MARKET_TARGETS.map(
    (t, i) => () =>
      agent(
        `You are auditing the documentation market to extract transferable lessons for the "Atomic Testing" library — a portable UI testing library using the "component driver" pattern (compose tiny reusable component drivers into test "scenes" that run identically across React, Vue, Playwright, and the DOM). Its core nouns are: Driver (semantic API like .click()/.getText()), Interactor (environment adapter), ScenePart (declares which components a test cares about), Locator (finds elements), TestEngine (orchestrator).

TASK: ${t.prompt}

Use WebSearch and WebFetch. Cite concrete URLs. Be specific and concrete — name actual page titles, section structures, and phrasings. Then give transferable, actionable takeaways for Atomic Testing's docs. Return the structured object.`,
        { label: `market:${t.key}`, phase: 'Market', schema: MARKET_SCHEMA, effort: 'medium' }
      )
  )
);

// ---------- Phase 2+3: Dimension evaluation, each pipelined into adversarial verification ----------
const GROUND = `You are a senior docs reviewer + staff engineer auditing the Atomic Testing documentation in this repo. ALWAYS read the actual files before judging — do not assume. Cite exact file paths and line numbers with short quotes as evidence. Prefer fewer, substantive findings (aim 6-12) over nitpicks; include a "nit" only if genuinely worth fixing. For each finding give a concrete, specific recommendation. Be skeptical and precise.

${FILE_INVENTORY}`;

const DIMENSIONS = [
  {
    key: 'D1-architecture',
    prompt: `${GROUND}

DIMENSION 1 — ARCHITECTURAL CORRECTNESS & CLARITY.
Question to answer: Does the documentation contain a good architectural diagram (or set of diagrams) that clearly illustrates how Driver, Interactor, and ScenePart play together — and where they map to (e.g. which layer adapts to React/Vue/Playwright/DOM)?

Steps:
1. Read ${DOCS}/docs/advanced-concepts/architecture.mdx, ${DOCS}/docs/core-concepts.mdx, ${DOCS}/docs/advanced-concepts/interactor.mdx, ${DOCS}/docs/advanced-concepts/build-component-driver.mdx, and ${DOCS}/docs/intro.mdx.
2. Inventory every diagram (mermaid blocks, the static PNG ${DOCS}/static/img/diagram-core-concept-simplified.png and where/if it is referenced). For mermaid, judge whether the diagram actually shows the relationships among Driver / Interactor / ScenePart / Locator / TestEngine and the environment mapping.
3. Cross-check the docs' architectural claims against the SOURCE of truth: ${REPO}/CLAUDE.md (Layer Stack & Interactor Hierarchy) AND the real code in ${PKGS}/core/src (ComponentDriver, interactor/Interactor.ts, partTypes.ts), ${PKGS}/dom-core/src/DOMInteractor.ts, ${PKGS}/react-core, ${PKGS}/vue-3, ${PKGS}/playwright. Flag any place the docs are WRONG, oversimplified to the point of being misleading, or contradict the code.
4. Assess: is there ONE canonical "big picture" diagram a newcomer can anchor on, or is the mental model scattered/missing? Is the relationship "ScenePart maps locator+driver; Interactor is chosen per environment; TestEngine wires them" made explicit and correct?
Report findings (category usually accuracy/clarity/completeness/structure) + strengths + grade.`,
  },
  {
    key: 'D2-tutorial',
    prompt: `${GROUND}

DIMENSION 2 — WALKTHROUGH / TUTORIAL QUALITY (can a newcomer actually build a unit test?).
Steps:
1. Read ${DOCS}/docs/quick-start.mdx, ${DOCS}/docs/getting-started-tutorial.mdx, ${DOCS}/docs/setup.mdx, ${DOCS}/docs/framework-guide.mdx, ${DOCS}/docs/best-practices.mdx, ${DOCS}/docs/cheat-sheets.mdx, and the snippets in ${DOCS}/docs/snippets/.
2. Walk the newcomer path end-to-end as if you knew nothing: install -> configure (jest/vite/playwright) -> render a component -> define a ScenePart -> write assertions -> clean up. Identify EVERY gap, missing prerequisite, unexplained import, jump in difficulty, or place where copy-paste would fail. Is there a complete, runnable first unit test with the component source shown (not just the test)? Is jest/vitest config addressed? Is the difference between a DOM unit test and an E2E test clear?
3. Check progressive disclosure: does quick-start get to a passing test fast, and does the tutorial build a realistic example? Are there exercises/next-steps?
4. Note redundancy/overlap or contradictions between quick-start, tutorial, and setup.
Report findings + strengths + grade.`,
  },
  {
    key: 'D3-homepage-pitch',
    prompt: `${GROUND}

DIMENSION 3 — HOMEPAGE / ELEVATOR PITCH (does the landing page explain WHY adopt Atomic Testing, and let a reader imagine the gains?).
Steps:
1. Read the homepage source ${DOCS}/src/pages/index.tsx and ${DOCS}/src/components/HomepageFeatures/index.tsx in full, plus the tagline in ${DOCS}/docusaurus.config.ts, and the supporting pages ${DOCS}/docs/why-atomic-testing.mdx, ${DOCS}/docs/intro.mdx, and ${DOCS}/docs/advanced-concepts/atomic-testing-vs-rtl.mdx.
2. Evaluate the pitch as a skeptical engineer landing cold: Is the PROBLEM named before the solution (pain of brittle/duplicated tests across frameworks)? Is the unique value ("write once, run on React/Vue/Playwright/DOM") concrete and credible? Does it help them imagine gains (migration safety, knowledge transfer, less brittleness)? Is there proof/credibility (examples, comparisons, social proof, maturity signals)? What objections go unanswered (perf, lock-in, learning curve, who it's NOT for)?
3. Judge whether the homepage code samples are honest and self-consistent (e.g. the hero install command vs the imports used in the hero code sample; do the sample driver names match real exports?). Flag any mismatch as an accuracy finding (verifier will check against ${PKGS}/component-driver-html source).
4. Assess narrative flow, redundancy between homepage sections and why-atomic-testing.mdx, and any accessibility/clarity issues in the copy.
Report findings (category often pitch/accuracy/clarity) + strengths + grade.`,
  },
  {
    key: 'D4-information-architecture',
    prompt: `${GROUND}

DIMENSION 4 — INFORMATION ARCHITECTURE, NAVIGATION & DISCOVERABILITY.
Steps:
1. Read ${DOCS}/sidebars.ts and ${DOCS}/docusaurus.config.ts (navbar/footer if present). Map the full nav tree.
2. Evaluate against the Diataxis model (Tutorials / How-to / Reference / Explanation): is the structure coherent, or are categories overlapping/miscategorized (e.g. "architecture" and "interactor" under "Advanced Guides" vs core concepts; "atomic-testing-vs-rtl" placement)? Is the user journey logical (Getting Started -> Concepts -> Guides -> Advanced -> API)?
3. Assess the giant auto-generated TypeDoc API section (${DOCS}/docs/api/**, ~300 pages, 3 MUI versions x ~50 drivers each): does it overwhelm the hand-written content? Is there guidance bridging narrative docs to API reference? Duplication across mui-v6/v7/v9 versions?
4. Discoverability: are there cross-links between related pages (concepts<->architecture<->build-a-driver)? Dead ends? Is there search? A "next steps" path? Note the editUrl points to github.com/atomic-testing/atomic-testing/tree/main/docs/docs/ — sanity check it matches the actual content path.
5. Check sidebar/doc id wiring: sidebar references ids 'tutorial' and 'concepts' which resolve via frontmatter id in getting-started-tutorial.mdx / core-concepts.mdx — confirm no dangling references and that filename!=id won't confuse contributors.
Report findings + strengths + grade.`,
  },
  {
    key: 'D5-technical-accuracy',
    prompt: `${GROUND}

DIMENSION 5 — TECHNICAL ACCURACY & DRIFT (do the docs match the real, current code?).
This is the most important dimension — be exhaustive and literal.
Steps:
1. Extract EVERY code snippet / API name / import path / function signature that appears in: the homepage (${DOCS}/src/pages/index.tsx, HomepageFeatures), quick-start.mdx, getting-started-tutorial.mdx, setup.mdx, core-concepts.mdx, framework-guide.mdx, build-component-driver.mdx, interactor.mdx, cheat-sheets.mdx, best-practices.mdx, api-overview.mdx, and the snippets/ files.
2. Verify each against the ACTUAL exports/signatures in the source packages. Critical checks (read the real source to confirm):
   - Does 'HTMLComponentDriver' exist in ${PKGS}/component-driver-html/src? (The homepage hero imports it. The TypeDoc class list shows HTMLElementDriver, HTMLButtonDriver, HTMLTextInputDriver... but NOT HTMLComponentDriver.) Confirm by reading the package index/exports.
   - Does the hero install command 'pnpm add @atomic-testing/core @atomic-testing/react-19' include everything the hero code imports (it also imports from @atomic-testing/component-driver-html)? Flag missing install dep.
   - Signature of createTestEngine in react-19 / vue-3 / playwright and dom-core — do the doc examples call it correctly (React: createTestEngine(<JSX/>, scene); Vue: createTestEngine(Welcome, scene); Playwright: createTestEngine(page, scene))?
   - Locator builders (byDataTestId, byRole, byValue, byChecked, byAttribute, locatorUtil.append) — names/paths correct vs ${PKGS}/core/src/locators?
   - Does the driver/element method used (.getText(), .click(), .setValue(), select.selectByLabel from HomepageFeatures) exist on the cited driver type?
   - engine.parts.X / engine.cleanUp() shape correct vs TestEngine source?
   - Package version references (react-18/19/legacy, mui v6/v7/v9, "v3 · stable" badge) — internally consistent and matching what's published/built (note ADR-005 dropped MUI 5)?
3. Also check prose technical claims (e.g. "wraps in act()", "calls nextTick()") against react-core / vue-3 source.
Report each mismatch as a finding with category 'accuracy', exact evidence (doc file:line quote + the contradicting source file:line). This is the dimension where confidence and exact citations matter most.`,
  },
];

phase('Evaluate');
const evaluated = await pipeline(
  DIMENSIONS,
  d => agent(d.prompt, { label: `eval:${d.key}`, phase: 'Evaluate', schema: FINDINGS_SCHEMA, effort: 'high' }),
  (res, d) => {
    if (!res || !res.findings || res.findings.length === 0) return res;
    return parallel(
      res.findings.map(
        f => () =>
          agent(
            `Adversarially verify a single documentation-audit finding by re-reading the ACTUAL files. Do not trust the finding — try to refute it. If it overstates severity or misquotes, say so and correct it. If the cited file/line does not support the claim, mark refuted. If the underlying code contradicts the claim, mark refuted.

FINDING (dimension ${d.key}):
${JSON.stringify(f, null, 2)}

Re-read the cited evidence path(s) under ${REPO} and any source package needed to confirm/deny. Return the verdict object. Set verdict='confirmed' only if the evidence genuinely supports the finding as stated; 'partially-confirmed' if the core point holds but it is overstated or the evidence is imprecise (give correctedEvidence); 'refuted' if wrong; 'unverifiable' only if the file truly cannot be checked.`,
            { label: `verify:${d.key}:${f.id}`, phase: 'Verify', schema: VERDICT_SCHEMA, effort: 'medium' }
          ).then(v => ({ ...f, verdict: v }))
      )
    ).then(verified => ({ ...res, findings: verified.filter(Boolean) }));
  }
);

// ---------- Phase 4: Synthesis ----------
phase('Synthesize');
const dimsForSynth = evaluated.filter(Boolean).map(d => ({
  dimension: d.dimension,
  grade: d.grade,
  summary: d.summary,
  strengths: d.strengths,
  findings: (d.findings || [])
    .filter(f => !f.verdict || f.verdict.verdict !== 'refuted')
    .map(f => ({
      id: f.id,
      title: f.title,
      severity: (f.verdict && f.verdict.adjustedSeverity) || f.severity,
      category: f.category,
      verdict: f.verdict && f.verdict.verdict,
      evidence: (f.verdict && f.verdict.correctedEvidence) || f.evidence,
      why: f.why,
      recommendation: f.recommendation,
    })),
}));

const synthesis = await agent(
  `You are the lead reviewer synthesizing a documentation audit of the Atomic Testing library docs. Below is (A) market research on leading docs sites and (B) per-dimension findings that have each already been adversarially verified (refuted ones removed).

Produce a tight executive synthesis:
1. An overall verdict on the docs (2-4 sentences).
2. The single biggest gap for EACH of the user's three priority questions: (a) is there a good architecture diagram showing Driver/Interactor/ScenePart and where they map; (b) is there a good walkthrough to build a unit test; (c) does the homepage explain WHY adopt + let readers imagine the gains.
3. A prioritized "Top 10 actions" list (each: action, why, rough effort S/M/L), ordered by impact, drawing on the market takeaways.
4. Cross-cutting themes that span multiple dimensions.
Be concrete and cite finding ids where relevant. Plain prose + lists; this becomes the spine of the final report.

(A) MARKET RESEARCH:
${JSON.stringify(market.filter(Boolean), null, 2)}

(B) VERIFIED DIMENSION FINDINGS:
${JSON.stringify(dimsForSynth, null, 2)}`,
  { label: 'synthesize', phase: 'Synthesize', effort: 'high' }
);

return {
  market: market.filter(Boolean),
  dimensions: evaluated.filter(Boolean),
  synthesis,
};
