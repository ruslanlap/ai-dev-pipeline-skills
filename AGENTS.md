# Repository Guidelines

## Project Structure & Module Organization

The portable Agent Skill lives in `skills/ai-dev-pipeline/`, with its entry point in `SKILL.md` and stage-specific guidance in `references/`. Project discovery links point to it from `.agents/skills/` and `.claude/skills/`; keep only one canonical copy. Its keyless Copilot CLI automation uses a Codex model and lives in `.github/workflows/ai-pipeline.yml` and `.github/codex/automation.md`; `tests/workflow.test.mjs` checks comment handling. Five earlier, demo-specific skills remain in `skills/triage/`, `feature-spec/`, `implement/`, `bug-agent/`, and `pr-review/`; their common instructions are in `skills/_shared/`. `README.md` explains installation; `LICENSE` contains the project license. There is no application source or asset bundle here.

## Development & Validation Commands

There is no build step or package manager configuration here. Use `git diff --check` to catch whitespace errors and `git diff -- skills/ README.md AGENTS.md` to review documentation changes. Use `rg 'phrase' skills/` to find instructions that may need the same update across skills. Commands such as `npm test` and `node scripts/evidence.mjs` appear in the skills for the *target application*; they cannot run in this repository.

## Writing Style & Naming Conventions

Keep instructions in Markdown with descriptive headings, short steps, and fenced `bash` examples. Preserve each `SKILL.md` file's YAML front matter. Use lowercase kebab-case skill directories and skill names, matching `skills/bug-agent/SKILL.md`. Keep shared rules in `skills/_shared/` when multiple skills depend on them, and check references after moving or renaming a file. Make commands and GitHub label names exact and copyable.

## Testing Guidelines

Validate the Codex skill with `python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" skills/ai-dev-pipeline`; run `node --test tests/workflow.test.mjs` for workflow changes, then `git diff --check`. Check links and command examples. For workflow changes, trace the affected stage and verify that its evidence guidance agrees with the entry point. The Playwright tests and screenshots described in the older skills belong to repositories that install them.

## Commits & Pull Requests

The available history contains one `feat:` commit; follow that concise, imperative style without assuming a broader established convention. In pull requests, explain which skill behavior changed, why, and which instructions or examples you checked. Link the relevant issue when one exists. Include screenshots only when a visible artifact is part of the change. The pipeline described here leaves approval and merging to a human.
