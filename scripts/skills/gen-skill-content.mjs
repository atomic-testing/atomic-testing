#!/usr/bin/env node
// Regenerate create-atomic-testing's embedded skill copy from the canonical
// `.claude/skills/*/SKILL.md`. Run after editing any skill, then commit the
// result:  pnpm gen:skill-content
//
// `check:skill-sync` fails CI if the committed module drifts from the source
// skills, so this is a "run-me-when-you-touch-a-skill" codegen, not a build step.
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GENERATED_MODULE_REL, renderSkillContentModule } from './skillEmbed.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const skillsDir = resolve(repoRoot, '.claude/skills');
const target = resolve(repoRoot, GENERATED_MODULE_REL);

writeFileSync(target, renderSkillContentModule(skillsDir), 'utf8');
process.stdout.write(`[gen-skill-content] Wrote ${GENERATED_MODULE_REL} from .claude/skills/.\n`);
