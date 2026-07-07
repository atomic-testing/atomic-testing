// TypeDoc markdown theme that partitions each class/interface API page's members
// into "own" (expanded), "inherited" (collapsed), and "protected" (collapsed)
// sections, using TypeDoc's own reflection flags.
//
// WHY: the stock theme lists every member — a class's own methods, everything it
// inherits from base drivers like ComponentDriver/ContainerDriver/ListComponentDriver,
// and protected internals — interleaved alphabetically and undistinguished. On a
// leaf driver that buries the ~10 methods a reader actually calls under ~35
// inherited/protected ones. This theme surfaces the own API and folds the rest away.
//
// It plugs into typedoc-plugin-markdown's documented customization surface: subclass
// MarkdownTheme to swap the render context (getRenderContext), and reassign the
// context's `partials.groups` resolver. Classification reads `child.flags.isProtected`
// and `child.flags.isInherited` only — never comment tags, never parsed text.
//
// Classification precedence: protected > inherited > own. In this codebase every
// protected member on a leaf driver also happens to be inherited (e.g.
// enforcePartExistence/getMissingPartNames on ComponentDriver), so the two buckets
// would otherwise be ambiguous. Protected wins because the point of isolating
// "protected" is to flag non-public-API surface regardless of where it was declared.

import { ReflectionKind } from 'typedoc';
import { MarkdownTheme, MarkdownThemeContext } from 'typedoc-plugin-markdown';

// Only class/interface pages have the Properties/Accessors/Methods groups worth
// partitioning. Everything else (modules, project index, enums, ...) falls through
// to the library's original `groups` partial untouched.
const PARTITIONABLE_KINDS = new Set([ReflectionKind.Class, ReflectionKind.Interface]);

function classify(child) {
  if (child.flags?.isProtected) return 'protected';
  if (child.flags?.isInherited) return 'inherited';
  return 'own';
}

function heading(level, text) {
  return `${'#'.repeat(level)} ${text}`;
}

function renderPartitionedGroups(model, options, originalGroups) {
  const md = [];
  const inheritedByGroup = new Map();
  const protectedByGroup = new Map();

  const groups = model.groups ?? [];

  // Bail out to stock behaviour if any group renders its children as standalone
  // pages (outputFileStrategy: 'members') -- that branch handles index-listing
  // logic unrelated to inherited/protected partitioning, and this repo doesn't
  // use that router mode anyway.
  const hasOwnDocumentGroups = groups.some(group => group.children.every(child => this.router.hasOwnDocument(child)));
  if (hasOwnDocumentGroups) {
    return originalGroups(model, options);
  }

  groups.forEach(group => {
    const declarations = group.children.filter(child => child.isDeclaration());
    const own = [];

    for (const child of declarations) {
      const bucket = classify(child);
      if (bucket === 'own') {
        own.push(child);
      } else if (bucket === 'protected') {
        protectedByGroup.set(group.title, [...(protectedByGroup.get(group.title) ?? []), child]);
      } else {
        inheritedByGroup.set(group.title, [...(inheritedByGroup.get(group.title) ?? []), child]);
      }
    }

    if (own.length) {
      md.push(heading(options.headingLevel, group.title));
      md.push(
        this.partials.members(own, {
          headingLevel: options.headingLevel + 1,
          groupTitle: group.title,
        })
      );
    }
  });

  const renderCollapsedSection = (label, byGroup) => {
    if (byGroup.size === 0) return '';
    const inner = [];
    let count = 0;
    for (const [groupTitle, children] of byGroup) {
      inner.push(heading(options.headingLevel + 1, groupTitle));
      inner.push(
        this.partials.members(children, {
          headingLevel: options.headingLevel + 2,
          groupTitle,
        })
      );
      count += children.length;
    }
    return [`<details>`, `<summary>${label} (${count})</summary>`, '', inner.join('\n\n'), '', `</details>`].join('\n');
  };

  const inheritedSection = renderCollapsedSection('Inherited members', inheritedByGroup);
  const protectedSection = renderCollapsedSection('Protected members', protectedByGroup);
  if (inheritedSection) md.push(inheritedSection);
  if (protectedSection) md.push(protectedSection);

  return md.join('\n\n');
}

class PartitionedMarkdownThemeContext extends MarkdownThemeContext {
  constructor(theme, page, options) {
    super(theme, page, options);

    // Capture the library's original bound `groups` resolver before replacing it,
    // so non-class/interface pages (and the "own document" fallback) keep the stock
    // behaviour with zero re-implementation.
    const originalGroups = this.partials.groups;

    this.partials.groups = (model, groupOptions) => {
      if (!PARTITIONABLE_KINDS.has(groupOptions.kind)) {
        return originalGroups(model, groupOptions);
      }
      return renderPartitionedGroups.call(this, model, groupOptions, originalGroups);
    };
  }
}

class PartitionedMarkdownTheme extends MarkdownTheme {
  getRenderContext(page) {
    return new PartitionedMarkdownThemeContext(this, page, this.application.options);
  }
}

/**
 * TypeDoc plugin entry point. Registers the partitioning theme under the name the
 * docusaurus-plugin-typedoc `theme` option selects.
 */
export function load(app) {
  app.renderer.defineTheme('markdown-partitioned', PartitionedMarkdownTheme);
}
