---
name: implement
description: Implements an approved specification, covers acceptance criteria with tests, takes screenshots and opens a PR. Use only for tickets with the spec:approved label.
---

# Implementing an Approved Feature

You work **only** from an approved specification. The ticket number is in `$ISSUE`.

## Step 0. Check the mandate

There must be a `spec:approved` label, set by a **human**. Check who set it:

```bash
gh issue view $ISSUE --json timelineItems -q '.' 2>/dev/null || gh issue view $ISSUE --comments
```

No `spec:approved` — stop, do nothing, write why. Do not approve it yourself.

Set `ai:in-progress`, remove it at the end.

## Step 1. Re-read the specification

Find the latest comment with the specification and **all** human remarks after it.
If a human clarified something in comments after the specification — that is part of the task.

The specification is the boundary of work. Everything in "Out of scope" is not done, no matter how itchy the hands.

## Step 2. Tests first

One separate Playwright test in `tests/` per acceptance-criteria item.
Run them before implementing: they must fail. That is how you know they actually check something.

## Step 3. Implement

Branch `ai/$ISSUE-<short-description>` from fresh `main`.

Follow the conventions from `AGENTS.md`: vanilla JS, CSS variables, responsive from 360px,
`prefers-reduced-motion`, Ukrainian in the UI, comments in Ukrainian.
Add no new dependencies.

If during the work it turns out the specification is impossible or wrong — **stop**,
set `needs-human`, explain in a comment what exactly does not add up. Do not rewrite the task on the fly.

## Step 4. Prove

```bash
npm test                                    # the whole suite
node scripts/evidence.mjs feature-$ISSUE
node scripts/evidence.mjs feature-$ISSUE --mobile
```

Screenshots are committed to the branch. A feature requires the desktop **and** the mobile view.

## Step 5. PR

```markdown
Fixes #$ISSUE

## What was done
Briefly, per the specification from #$ISSUE.

## Acceptance criteria
| Criterion | Test | Status |
|---|---|---|
| After clicking "Share" a system dialog opens | `tests/share.spec.js:12` | ✅ |

## Evidence
| Desktop | Mobile |
|---|---|
| ![desktop](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/<branch>/docs/evidence/feature-$ISSUE-result.png) | ![mobile](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/<branch>/docs/evidence/feature-$ISSUE-result-mobile.png) |

The whole suite: N passed.

## Out of scope
List what you deliberately did not do (from the specification).

<sub>🤖 Automated implementation · the merge is done by a human</sub>
```

Draft → `gh pr ready` when green. Comment on the ticket with the link, remove `ai:in-progress`.

## Forbidden

Starting without `spec:approved`, going beyond the specification, merging,
pushing to `main`, changing `.github/`, `AGENTS.md` or agent skill directories.
