---
name: pr-review
description: Reviews a PR — checks compliance with the ticket, presence of evidence, regressions and project conventions, sets the ai:reviewed label. Use when a PR is opened or updated.
---

# Code Review

You are the last automated check before a human. The PR number is in `$PR`.

**Important limitation:** GitHub does not allow the author to approve their own PR, and a formal
approval from an agent means nothing. Your output is a **review comment + the `ai:reviewed` label**.
Either way, the merge is done by a human.

## Step 1. Gather context

```bash
gh pr view $PR --json title,body,files,additions,deletions,headRefName
gh pr diff $PR
gh pr checks $PR
```

Find the related ticket (`Fixes #N`) and read it — including the specification
or the bug description. A review without understanding the requirement is a linter, not a review.

## Step 2. Check point by point

**Compliance with the requirement**
- does the PR do exactly what the ticket says;
- does it not do anything **beyond** that (the most common problem with agent PRs);
- are the "Out of scope" items from the specification not violated.

**Evidence**
- is there a test per acceptance criterion / per bug;
- would the test actually fail without the fix — check the test's logic, not just its presence;
- are all checks green (`gh pr checks`);
- do the screenshots actually show what is claimed, or is it just the home page.

**Regressions** — targeted at this project:
- the `TESTS` structure is not broken (4 options, the `r` keys exist, all result fields);
- `shuffle` is not broken by assumptions about option order;
- no horizontal scroll appeared at 360px;
- `prefers-reduced-motion` is respected by new animations;
- no console errors.

**Conventions** (`AGENTS.md`)
- vanilla JS, no new dependencies and no build;
- colors from CSS variables;
- Ukrainian in the UI and comments;
- `.github/`, `AGENTS.md`, agent config dirs, repo settings untouched.

**Scope**
- is the change minimal; side refactoring is a remark, not praise.

## Step 3. Write the review

```markdown
## 🤖 Code review

**Verdict:** ✅ can merge / ⚠️ has remarks / ❌ must not merge
**Ticket:** #N — matches / deviates in such-and-such
**Scope:** N files, +X/−Y

### Evidence
| What was checked | Result |
|---|---|
| Tests for acceptance criteria | ✅ 3 of 3 |
| The whole suite | ✅ 12 passed |
| Screenshots show what is claimed | ✅ |

### Remarks
1. **`app.js:142` — blocking.** Problem description, a concrete scenario where it breaks.
2. **`styles.css:88` — minor.** Description.

No remarks — write exactly that, do not invent them for looks.

### For a human to look at
Places where a product decision is needed, not a technical assessment.

<sub>🤖 Automated review · does not replace a human approval</sub>
```

Set the label on the PR:

```bash
gh pr edit $PR -R vidprog/coffee-ground-tests --add-label "ai:reviewed"
```

## Review rules

- Every remark with a file and line. "Could be better" without an address is garbage.
- Separate blocking from minor. If everything is minor — the verdict is ✅ with a note.
- Do not rewrite the PR yourself. Your job is to assess, not to fix.
- No politeness praise. Empty praise devalues real remarks.
- Noticed the PR does more than asked — that is always a remark.

## Forbidden

Merging, approving via `gh pr review --approve`, closing PRs, pushing to someone else's branch.
