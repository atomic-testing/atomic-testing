// Generates a CHANGELOG.md section from commit subjects since the previous
// release tag, and prepends it to the repo-root CHANGELOG.md.
//
// Usage: node scripts/generateChangelog.js <version> [--since <tag>]
//
// The commit-subject convention (type(scope): summary, breaking-change `!`,
// type→section mapping) is documented in CONTRIBUTING.md — this script is the
// mechanical half of that convention, so keep the two in sync if either changes.

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_URL = 'https://github.com/atomic-testing/atomic-testing';
const CHANGELOG_HEADER = '# Changelog';

// Ordered so the generated section's sections always appear in this sequence.
const TYPE_SECTIONS = [
  ['feat', 'Features'],
  ['fix', 'Fixes'],
  ['perf', 'Performance'],
  ['refactor', 'Refactoring'],
  ['docs', 'Documentation'],
  ['build', 'Build & Tooling'],
];

// Internal-only types: real history, but not release-notes material.
const EXCLUDED_TYPES = new Set(['chore', 'style', 'test']);

const COMMIT_SUBJECT_PATTERN = /^(\w+)(\(([^)]+)\))?(!)?:\s*(.+)$/;
const BUMP_COMMIT_PATTERN = /^chore: bump version to /;
const ISSUE_REFERENCE_PATTERN = /#(\d+)/g;

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

// Which tag is "the previous release" depends on whether the one being released
// exists yet. The changelog is now generated in a release PR, BEFORE the tag is
// cut, so the newest tag is the previous release; when this runs after a tag
// exists (a re-fire, or `--since` omitted on an already-tagged commit) the
// newest tag is the release itself and the previous one is second. Deciding by
// looking for the target version rather than assuming either shape is what keeps
// both paths correct — assuming "always second" duplicated an entire release
// section when run pre-tag.
//
// Only `v*` tags are considered, so a stray non-release tag can never become the
// baseline, and they are ordered by version rather than by creation date:
// re-firing a release deletes and recreates its tag, which moves it to the front
// of a date ordering while leaving the version ordering correct.
/**
 * Whether a `vX.Y.Z` tag names a tree that was actually bumped to X.Y.Z — i.e. a
 * real release rather than an abandoned one.
 *
 * A tag created on an un-bumped commit (the v0.101.0 and v0.102.0 failures: a
 * GitHub Release cut straight on main without its release commit) is refused by
 * publish.yml's preflight and never publishes, but it stays in the tag list. As
 * the newest `v*` tag it would then silently become the NEXT release's baseline,
 * and every commit before it — the whole of the release it failed to ship —
 * would vanish from the changelog and, via `--generate-notes`, from the GitHub
 * Release notes too. Two breaking changes disappeared this way in rehearsal.
 *
 * Checking the tagged tree rather than trusting the tag name makes an orphaned
 * tag structurally incapable of becoming the baseline, so cleaning one up stays
 * good hygiene instead of being load-bearing.
 *
 * Note this is only true of tags cut under the CURRENT model. Before #1375 the
 * bump was pushed to main *after* publishing, so every tag up to v0.100.0
 * legitimately names the previous version's tree and fails this test — which is
 * precisely the reproducibility hole #1375 closed. That is why the caller falls
 * back loudly to the newest candidate rather than continuing to walk: on a
 * repository whose recent tags all predate the change, "keep looking" would
 * reach the root commit and emit the entire history as one release section.
 */
function namesAReleasedTree(tag) {
  try {
    const manifest = git(['show', `${tag}:packages/core/package.json`]);
    return JSON.parse(manifest).version === tag.replace(/^v/, '');
  } catch {
    // No such path at that tag (or unreadable JSON): far too old to be this
    // release's baseline, or not a release tag at all.
    return false;
  }
}

function resolvePreviousReleaseRef(sinceOption, version) {
  if (sinceOption) {
    return sinceOption;
  }

  const tags = git(['for-each-ref', 'refs/tags/v*', '--sort=-v:refname', '--format=%(refname:short)'])
    .split('\n')
    .filter(Boolean);
  const releaseTagIndex = tags.indexOf(`v${version}`);
  const candidates = releaseTagIndex === -1 ? tags : tags.slice(releaseTagIndex + 1);
  const previous = candidates.find(namesAReleasedTree);
  if (previous) {
    return previous;
  }
  if (candidates.length > 0) {
    // No candidate names a bumped tree. Bounded fallback: take the newest one
    // anyway and say so, because the alternative — falling through to the root
    // commit below — would silently emit every commit in the repository's
    // history as this release's section. A too-narrow range is a visible
    // omission; a too-wide one looks plausible and is far harder to notice.
    console.warn(
      `[changelog] warning: no tag names a tree bumped to its own version, so the baseline falls back ` +
        `to ${candidates[0]}. Check the generated section covers what you expect.`
    );
    return candidates[0];
  }

  // Fewer than two tags (first-ever or second-ever release): there's no prior
  // release to diff against, so start from the beginning of history.
  return git(['rev-list', '--max-parents=0', 'HEAD']).split('\n')[0];
}

function collectCommitSubjectsSince(previousReleaseRef) {
  const log = git(['log', `${previousReleaseRef}..HEAD`, '--no-merges', '--pretty=format:%s']);
  if (!log) {
    return [];
  }

  const seen = new Set();
  const subjects = [];
  for (const subject of log.split('\n')) {
    if (BUMP_COMMIT_PATTERN.test(subject) || seen.has(subject)) {
      continue;
    }
    seen.add(subject);
    subjects.push(subject);
  }
  return subjects;
}

function linkIssueReferences(text) {
  return text.replace(ISSUE_REFERENCE_PATTERN, (reference, number) => `[${reference}](${REPO_URL}/issues/${number})`);
}

function formatEntry(scope, description) {
  const linkedDescription = linkIssueReferences(description);
  return scope ? `- **${scope}:** ${linkedDescription}` : `- ${linkedDescription}`;
}

// Returns null for subjects that don't follow the `type(scope): summary`
// convention at all — callers must preserve those verbatim rather than
// force-fitting them into a section.
function parseCommitSubject(subject) {
  const match = subject.match(COMMIT_SUBJECT_PATTERN);
  if (!match) {
    return null;
  }

  const [, type, , scope, breakingMarker, description] = match;
  return { type, scope, isBreaking: Boolean(breakingMarker), description };
}

function groupCommitsBySection(subjects) {
  const breaking = [];
  const other = [];
  const byType = new Map(TYPE_SECTIONS.map(([type]) => [type, []]));

  for (const subject of subjects) {
    const parsed = parseCommitSubject(subject);
    if (!parsed) {
      other.push(formatEntry(null, subject));
      continue;
    }

    const entry = formatEntry(parsed.scope, parsed.description);
    if (parsed.isBreaking) {
      breaking.push(entry);
    } else if (EXCLUDED_TYPES.has(parsed.type)) {
      // Deliberately excluded from every section, including "Other".
    } else if (byType.has(parsed.type)) {
      byType.get(parsed.type).push(entry);
    } else {
      // Well-formed subject, but a type outside the known map (e.g. `ci:`) —
      // still real history, so it belongs in "Other" rather than vanishing.
      other.push(entry);
    }
  }

  return { breaking, byType, other };
}

function buildChangelogSection(version, groups) {
  const date = new Date().toISOString().slice(0, 10);
  const lines = [`## [${version}] - ${date}`];

  const appendSection = (title, entries) => {
    if (entries.length === 0) {
      return;
    }
    lines.push('', `### ${title}`, '', ...entries);
  };

  appendSection('Breaking Changes', groups.breaking);
  for (const [type, title] of TYPE_SECTIONS) {
    appendSection(title, groups.byType.get(type));
  }
  appendSection('Other', groups.other);

  return lines.join('\n');
}

function prependSectionToChangelog(changelogPath, section) {
  const existing = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8').trimEnd() : CHANGELOG_HEADER;
  const priorReleases =
    existing === CHANGELOG_HEADER ? '' : existing.slice(CHANGELOG_HEADER.length).replace(/^\n+/, '');

  const parts = [CHANGELOG_HEADER, '', section];
  if (priorReleases) {
    parts.push('', priorReleases);
  }
  fs.writeFileSync(changelogPath, `${parts.join('\n')}\n`);
}

function parseArgs(argv) {
  const [version, ...rest] = argv;
  if (!version) {
    throw new Error('Usage: node scripts/generateChangelog.js <version> [--since <tag>]');
  }

  const sinceIndex = rest.indexOf('--since');
  const sinceOption = sinceIndex === -1 ? null : rest[sinceIndex + 1];
  return { version, sinceOption };
}

function main() {
  const { version, sinceOption } = parseArgs(process.argv.slice(2));

  const previousReleaseRef = resolvePreviousReleaseRef(sinceOption, version);
  const subjects = collectCommitSubjectsSince(previousReleaseRef);
  const groups = groupCommitsBySection(subjects);
  const section = buildChangelogSection(version, groups);

  prependSectionToChangelog(path.join(process.cwd(), 'CHANGELOG.md'), section);

  // So the section can be pasted straight into the GitHub Release notes.
  process.stdout.write(`${section}\n`);
}

main();
