---
name: ai-dev-pipeline
description: Work through a software issue or pull request with code-grounded triage, a verifiable plan, a focused implementation, or an evidence-backed review. Use when asked to triage an issue, write a feature spec, fix a bug, implement an approved feature, or review a PR.
---

# AI Development Pipeline

Move a software change from a reported need to a reviewable result. Choose the requested stage; do not run every stage by default. Work in the current repository and follow its own `AGENTS.md`, contributing guide, tests, and conventions. Treat examples in this skill as patterns, not facts about that repository.

## Route the request

| Request | Read | Deliver |
| --- | --- | --- |
| Classify or clarify an issue | [Issue discovery](references/issue.md) | Evidence-based triage with the next action |
| Specify a feature | [Issue discovery](references/issue.md) | Observable acceptance criteria and a scoped plan |
| Fix a bug | [Implementation](references/implementation.md) | Reproduced cause, regression check, fix, verification |
| Implement a feature | [Implementation](references/implementation.md) | Change against the approved scope, verification |
| Review a PR | [Review](references/review.md) | Prioritized findings tied to files and behavior |

For any claim about a run, screenshot, GitHub state, or changed behavior, apply [Evidence](references/evidence.md). Load only the reference for the current stage and Evidence when needed.

## Ground rules

1. Inspect the actual repository, issue or PR, and relevant callers before deciding what to change. Discover test and build commands from the project; do not assume Node, Playwright, GitHub labels, or a particular branch layout.
2. Keep facts, assumptions, and proposals distinct. If essential information is missing, make the best grounded proposal that fits the existing product, or ask for the product decision when alternatives lead to different outcomes.
3. Respect the requested scope. An existing human approval gate must be checked, not self-granted. A request for triage, specification, or review does not authorize implementation or merging.
4. Prefer the smallest change that addresses the cause and can be verified. Report checks actually run and any remaining uncertainty. Never present a green test or screenshot as proof of something it did not check.
5. Use existing project workflows for branches, issues, and PRs. Prepare external comments or PR text for review unless the user has instructed you to publish them. Never merge or approve your own PR.

## GitHub, when applicable

If the task depends on live GitHub state, confirm the repository and read the relevant issue or PR using available GitHub tooling (`gh`, an integration, or the API). Check access before relying on it; if unavailable, continue with local work and state the limit. Refresh remote refs before making a claim about whether a commit is on a branch. Before posting or editing, inspect current comments and labels to avoid duplicates and stale state. When using `gh`, pass multiline text with `--body-file`. Apply workflow labels only when the repository defines them and the requested task calls for updating them. Clean up any temporary status label you set.
