# Security Policy

## Supported versions

Atomic Testing publishes one driver package per framework/library major (see
[ADR-003](agent-docs/adr/003-version-specific-packages.md)), and the stable
public API is frozen per [ADR-006](agent-docs/adr/006-1.0-api-freeze-and-evolution.md).
For which package majors currently receive fixes — including the MUI/MUI-X
driver end-of-support table — see the
[Stability & version support policy](README.md#stability--version-support-policy)
section of the README. Security fixes are only backported to supported
majors.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use GitHub's private vulnerability reporting: go to the
[Security tab](https://github.com/atomic-testing/atomic-testing/security) of
this repository and select **"Report a vulnerability"**. This opens a private
advisory visible only to the maintainer, so details can be discussed and a fix
prepared before public disclosure.

Please include as much detail as you can: affected package(s) and version(s),
a description of the issue, and reproduction steps or a minimal test case.

## What to expect

Atomic Testing is currently maintained by a single maintainer on a best-effort
basis. There's no guaranteed SLA, but reports are triaged and acknowledged
within a few business days. Once a fix is available, it will be released and
the advisory disclosed per GitHub's coordinated disclosure timeline.
