# AI Dev Pipeline Skills

A set of five agent skills that run an autonomous, evidence-first development
pipeline on GitHub Issues and Pull Requests. Works with any coding agent that
supports SKILL.md files — Claude Code, Codex, Gemini CLI, OpenCode, Cursor,
Hermes Agent and more.

## The problem they solve

AI agents that "fix" tickets without reproducing them, claim success without proof,
over-deliver beyond the spec, and merge their own work. These skills enforce the
opposite: every step produces verifiable evidence, and **a human always merges**.

## Pipeline

```
Issue → triage → feature-spec → (human approves: spec:approved) → implement → PR
     ↘ triage → bug-agent (reproduce → failing test → fix → prove) → PR
                                                PR → pr-review → (human merges)
```

| Skill | Job | Trigger |
|---|---|---|
| [`triage`](skills/triage/SKILL.md) | Classify the ticket, fill information gaps with proposals (not questions), find duplicates, label | ticket without `ai:triaged` |
| [`feature-spec`](skills/feature-spec/SKILL.md) | Research the code, write a spec with acceptance criteria and an honest browser-overlay mockup, ask for human review | `type:feature` + `ai:triaged` |
| [`implement`](skills/implement/SKILL.md) | Implement an approved spec, tests first, screenshots included, open a draft PR | `spec:approved` (set by a human) |
| [`bug-agent`](skills/bug-agent/SKILL.md) | Reproduce in a real browser, pin with a failing test, fix only when confidence is high, prove with before/after screenshots | `type:bug` + `ai:triaged` |
| [`pr-review`](skills/pr-review/SKILL.md) | Check spec compliance, evidence, regressions, conventions; review comment + `ai:reviewed` label | PR opened or updated |
| [`_shared/`](skills/_shared/) | Evidence rules and GitHub workflow reference shared by all skills | — |

## Core rules enforced across the pipeline

- **No fix without reproduction.** A failing test that turns green is the only proof of a fix.
- **Evidence is public.** "Before" screenshots land in the ticket *before* any fix;
  "after" screenshots after. Actions artifacts don't count — raw branch links only.
- **Proposals over questions.** Triage fills gaps with one concrete, code-grounded option
  a human can approve silently — questions only where different answers mean different products.
- **Humans gate everything.** `spec:approved` is set by a human; merges are done by a human;
  agents never approve their own PRs.
- **Idempotency and loop protection.** No duplicate comments, no agent-triggering-agent loops,
  `ai:in-progress` is always cleaned up.

## Install

Pick your agent's skills directory and copy the folders there:

| Agent | Destination |
|---|---|
| Claude Code | `.claude/skills/` |
| Codex | `.codex/skills/` |
| Gemini CLI | `.gemini/skills/` |
| Cursor | `.cursor/skills/` |
| Hermes Agent | `hermes skills install <raw-SKILL.md-URL> --name <skill> --yes` |

```bash
cp -r skills/* /path/to/your-repo/.claude/skills/    # or your agent's dir from the table
```

Single-skill install for Hermes Agent:

```bash
hermes skills install https://raw.githubusercontent.com/ruslanlap/ai-dev-pipeline-skills/main/skills/triage/SKILL.md --name triage --yes
```

### Adapting to your repo

The skills are written against a vanilla JS + Playwright demo project
(`scripts/evidence.mjs`, no build step).
Search-and-replace the repo slug and adapt the project-specific checks
(`TESTS` structure, 360px, `AGENTS.md` conventions) to your codebase.

The label vocabulary the pipeline expects: `ai:triaged`, `ai:in-progress`, `ai:reviewed`,
`type:bug`, `type:feature`, `spec:ready`, `spec:approved`, `needs-info`, `needs-human`,
`bug:reproduced`, `bug:not-reproducible`.

## License

[MIT](LICENSE) © 2026 ruslanlap
