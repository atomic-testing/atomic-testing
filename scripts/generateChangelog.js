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

// The release tag being published already exists by the time this script
// runs (the `release: published` event fires after GitHub creates the tag),
// so the *previous* release is the second-most-recent tag, not the first.
function resolvePreviousReleaseRef(sinceOption) {
  if (sinceOption) {
    return sinceOption;
  }

  const tags = git(['for-each-ref', 'refs/tags', '--sort=-creatordate', '--format=%(refname:short)'])
    .split('\n')
    .filter(Boolean);
  if (tags.length >= 2) {
    return tags[1];
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

  const previousReleaseRef = resolvePreviousReleaseRef(sinceOption);
  const subjects = collectCommitSubjectsSince(previousReleaseRef);
  const groups = groupCommitsBySection(subjects);
  const section = buildChangelogSection(version, groups);

  prependSectionToChangelog(path.join(process.cwd(), 'CHANGELOG.md'), section);

  // So the section can be pasted straight into the GitHub Release notes.
  process.stdout.write(`${section}\n`);
}

main();
