# AI Dev Pipeline

A portable [Agent Skill](https://agentskills.io/specification) for moving a software issue or pull request to a reviewable result. The same `SKILL.md` and references support issue triage, feature specification, bug fixes, feature implementation, and PR review in agents that implement the standard. The skill follows the target repository's stack, tests, and conventions.

## Use in this repository

The canonical skill is [`skills/ai-dev-pipeline/`](skills/ai-dev-pipeline/SKILL.md). Project links expose that one copy in the discovery paths below:

| Agent | Project skill path |
| --- | --- |
| [Codex](https://learn.chatgpt.com/docs/build-skills), [Gemini CLI](https://geminicli.com/docs/cli/using-agent-skills/), [GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills), [Cursor](https://prod.cursor.com/docs/skills), [OpenCode](https://opencode.ai/docs/skills) | `.agents/skills/ai-dev-pipeline/` |
| [Claude Code](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | `.claude/skills/ai-dev-pipeline/` |

These paths are symbolic links to the canonical folder, so edits stay in one place. If your checkout does not support symbolic links, copy the whole canonical folder into your agent's documented project skills directory.

For use across your own projects, copy the skill to a personal skills directory. Codex, Gemini CLI, Copilot, Cursor, and OpenCode support `~/.agents/skills/`; Claude Code uses `~/.claude/skills/`:

```bash
mkdir -p ~/.agents/skills
cp -R skills/ai-dev-pipeline ~/.agents/skills/
# For Claude Code instead:
mkdir -p ~/.claude/skills
cp -R skills/ai-dev-pipeline ~/.claude/skills/
```

In Codex, invoke it with `$ai-dev-pipeline`; in Claude Code, use `/ai-dev-pipeline`. Agents can also select it when a request matches its description. For other agents, use their normal skill picker or ask to apply `ai-dev-pipeline`.

## What it does

| Stage | Result |
| --- | --- |
| Triage | Classification, code-grounded gaps and proposals, next action |
| Feature spec | Observable acceptance criteria and scoped implementation plan |
| Bug fix | Reproduction, regression check, root-cause change, verification |
| Feature implementation | Change against approved scope with relevant checks |
| PR review | Prioritized findings tied to files and behavior |

The skill selects only the requested stage. It follows the target repository's `AGENTS.md`, test commands, and approval gates. Screenshots are used for visual claims when useful; tests and repeatable observations support behavior claims. It does not assume Node, Playwright, a branch name, or permission to merge.

## GitHub Actions automation

The [workflow](.github/workflows/ai-pipeline.yml) runs the `gpt-5.3-codex` model through GitHub Copilot CLI for three events; the skill itself is agent-independent:

- Add `ai:triage` to an issue for code-grounded triage.
- Add `ai:spec` to an issue for a feature specification.
- Open or update a non-draft PR from a branch in the same repository for review feedback.

Create the two labels and ensure the repository owner has GitHub Copilot access. No API key or repository secret is needed: Actions supplies `GITHUB_TOKEN` with `copilot-requests: write`. Usage counts against the owner's Copilot entitlement; organizations must enable the Copilot CLI billing policy. The AI job has read-only repository permissions and no GitHub write permission; a separate job creates or updates one bot comment per stage. PR review uses the base commit's instructions and inspects the proposed commit through Git, without running PR code. The workflow does not implement code, approve specs, or merge PRs. To use it in another repository, copy `.github/workflows/ai-pipeline.yml`, `.github/codex/automation.md`, `skills/ai-dev-pipeline/`, and the discovery links under `.agents/skills/` and `.claude/skills/`.

The workflow follows [GitHub's keyless Copilot CLI guidance](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli-in-actions). The model is Codex, but the Actions billing and authentication are provided by GitHub Copilot.

## Earlier skills

The original five Claude Code skills remain under `skills/triage/`, `skills/feature-spec/`, `skills/bug-agent/`, `skills/implement/`, and `skills/pr-review/`. They describe a specific demo project (`vidprog/coffee-ground-tests`) and need adaptation before use elsewhere. Use the shared [`ai-dev-pipeline`](skills/ai-dev-pipeline/SKILL.md) skill for new work in any supported agent.

## Validate

```bash
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" skills/ai-dev-pipeline
git diff --check
node --test tests/workflow.test.mjs
```

The first command uses the local Codex skill-creator validator; its path may differ on another machine. The Node test checks that feedback is updated on rerun instead of duplicated. This repository has no application build.

## License

[MIT](LICENSE) © 2026 ruslanlap
