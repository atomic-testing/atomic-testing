import { TestSuiteInfo } from '@atomic-testing/internal-test-runner';
import { useTestEngine } from '@atomic-testing/internal-test-runner';

import { chartsExample } from './Charts.suite';

// Tooltips render asynchronously after the hover (popper mount + positioning), so poll briefly
// instead of asserting on the first read.
async function waitForTooltip(
  getText: () => Promise<string | undefined>,
  timeoutMs: number = 5000
): Promise<string | undefined> {
  const startedAt = Date.now();
  let text = await getText();
  while (text == null && Date.now() - startedAt < timeoutMs) {
    await new Promise(resolve => setTimeout(resolve, 100));
    text = await getText();
  }
  return text;
}

/**
 * The geometry-dependent chart interactions: hovering a data point and reading the tooltip.
 * E2E-ONLY — jsdom has no layout engine, so pointer coordinates never resolve to a chart item
 * there; this suite deliberately has no `.dom.test.ts` adapter (the documented exception for
 * the e2e-primary chart family, #904).
 */
export const chartInteractionTestSuite: TestSuiteInfo<typeof chartsExample.scene> = {
  title: 'Chart interactions',
  url: '/charts',
  tests: (getTestEngine, { test, beforeEach, afterEach, assertTrue, assertEqual }) => {
    const engine = useTestEngine(chartsExample.scene, getTestEngine, { beforeEach, afterEach });

    test('hovering a bar raises the axis tooltip for its category', async () => {
      await engine().parts.barChart.hoverDataPoint(1);
      const text = await waitForTooltip(() => engine().parts.barChart.getTooltipText());
      assertTrue(text != null);
      assertTrue(text!.includes('Q2'));
      assertTrue(text!.includes('Series A'));
    });

    test('hovering a pie slice raises the item tooltip with its label and value', async () => {
      await engine().parts.pieChart.hoverDataPoint(1);
      const text = await waitForTooltip(() => engine().parts.pieChart.getTooltipText());
      assertTrue(text != null);
      assertTrue(text!.includes('Beta'));
      assertTrue(text!.includes('20'));
    });

    test('hovering a scatter marker raises the item tooltip for its series', async () => {
      await engine().parts.scatterChart.hoverDataPoint(1, 0);
      const text = await waitForTooltip(() => engine().parts.scatterChart.getTooltipText());
      assertTrue(text != null);
      assertTrue(text!.includes('Group A'));
    });

    // The tooltip is a single portaled element shared by every chart on the page, so "cleared"
    // cannot be asserted per-chart; asserting that its content follows the hovered slice pins
    // the same pointer-tracking behavior without that ambiguity.
    test('tooltip follows the hovered data point', async () => {
      await engine().parts.pieChart.hoverDataPoint(0);
      const first = await waitForTooltip(() => engine().parts.pieChart.getTooltipText());
      assertTrue(first != null);
      assertTrue(first!.includes('Alpha'));
      await engine().parts.pieChart.hoverDataPoint(2);
      const second = await waitForTooltip(async () => {
        const text = await engine().parts.pieChart.getTooltipText();
        return text != null && text.includes('Gamma') ? text : undefined;
      });
      assertEqual(second != null && second.includes('Gamma'), true);
    });
  },
};
