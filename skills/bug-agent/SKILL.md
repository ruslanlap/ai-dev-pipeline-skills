---
name: bug-agent
description: Reproduces a bug in a real browser, pins it with a failing test and fixes it if confidence is high. Use for tickets labeled type:bug after triage.
---

# Working on a Bug

The order is immutable: **reproduce → pin with a test → fix → prove**.
A fix without reproduction is forbidden: you do not know what exactly you are repairing.

The ticket number is in `$ISSUE`. Repository `vidprog/coffee-ground-tests`.

## Step 0. Check the state

Work only if there is `type:bug` + `ai:triaged`, and no `ai:in-progress`, `needs-info`, `needs-human`.
Set `ai:in-progress`, remove it at the end under any outcome.

## Step 1. Reproduce

```bash
npm install && npx playwright install --with-deps chromium
```

Perform the steps from the ticket **literally**, in the browser via Playwright. Do not retell them — execute them.

If steps are missing or contradictory — do not invent. Set `needs-info`,
write which exact step could not be performed and why.

**Did not reproduce?** Set `bug:not-reproducible`, write a comment with:
what exactly you did (list of commands and actions), what you saw instead, a screenshot of the current behavior,
and 2–3 clarifying questions for the author. Do not close the ticket.

**Reproduced?** Set `bug:reproduced`, take a "before" screenshot and **publish it in the ticket immediately**:

```bash
node scripts/evidence.mjs before-$ISSUE --test <id>          # add --focus if the bug is invisible
git checkout -b ai/$ISSUE-<description> origin/main                 # the branch is needed right here
git add docs/evidence/before-$ISSUE-*.png && git commit -m "docs: reproduction evidence #$ISSUE"
git push -u origin ai/$ISSUE-<description>
```

The comment on the ticket — **before you start fixing**:

```markdown
## 🔁 Bug reproduced

**How I reproduced:** what exactly I did, step by step.
**What I saw:** the actual behavior.

![before](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/ai/$ISSUE-<description>/docs/evidence/before-$ISSUE-result.png)

**Next:** pinning it with a test and fixing / handing over to a human (if confidence is low).
```

This is the proof the bug exists. It must appear in the ticket **earlier** than any fix —
so the author sees confirmation, even if the work later stalls in `needs-human`.

## Step 2. Pin with a test

Write a Playwright test in `tests/` that **fails because of this bug**. Run it, make sure it is red,
copy the failure output — it goes into the comment. A test that did not fail before the fix proves nothing.

## Step 3. Assess confidence

Fix it yourself **only if all** conditions hold:

- the cause is localized to a specific function or line (not "somewhere in app.js");
- there is a failing test from step 2;
- the fix touches ≤ 2 files and does not change the structure of `TESTS`;
- there is no product choice between several behavior variants.

**Any one not met** → set `needs-human`, remove `ai:in-progress` and write a comment:
the reproduction, the failing test, 2–3 hypotheses about the cause with links to lines, what exactly blocked you.
This is a normal and expected outcome, not a defeat.

## Step 4. Fix

Branch: `ai/$ISSUE-<short-description>` from fresh `main`. Never commit to `main`.

The minimal change that makes the test green. No refactoring on the side, no "improving" neighboring code,
no new dependencies. Follow the conventions from `AGENTS.md`.

## Step 5. Prove

```bash
npm test                                   # the whole suite green, not only the new test
node scripts/evidence.mjs after-$ISSUE --test <id>    # "before" is already done in step 1
```

If the bug is invisible on a regular screenshot (focus, aria, in-memory state) — add `--focus`
or another state highlight, as described in `_shared/evidence.md`. Two identical pictures are
not evidence; either make the difference visible or say honestly that the screenshot is irrelevant here.

Commit both screenshots (`before-*`, `after-*`) to the branch together with the fix.

## Step 6. Create the PR

```bash
git push -u origin ai/$ISSUE-<description>
gh pr create --draft --title "fix: <description> (#$ISSUE)" --body "<body>"
```

PR body:

```markdown
Fixes #$ISSUE

## Cause
What exactly was broken and why, with a link to `file.js:line`.

## The fix
What changed and why exactly this way.

## Evidence
The test `tests/<name>.spec.js` failed before the fix:
```
<failure output>
```
After the fix the whole suite is green: N passed.

| Before | After |
|---|---|
| ![before](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/ai/$ISSUE-<description>/docs/evidence/before-$ISSUE-result.png) | ![after](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/ai/$ISSUE-<description>/docs/evidence/after-$ISSUE-result.png) |

## Risks
What could have been affected and why you believe it was not.

<sub>🤖 Automated fix · the merge is done by a human</sub>
```

When the tests are green — remove the draft: `gh pr ready <number>`.

## Step 7. Close the loop

A second comment **on the ticket** — with the "after" screenshot. Together with the "before" comment from step 1
they form a pair the bug author sees without opening the PR:

```markdown
## ✅ Fixed, awaiting review

**What it was:** one sentence about the cause.
**What was done:** one sentence about the fix.

![after](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/<branch>/docs/evidence/after-$ISSUE-result.png)

The test `tests/<name>.spec.js` failed before the fix, now green. The whole suite: N passed.
PR: #<number> — the merge is done by a human.
```

Then remove `ai:in-progress`.
**Do not close the ticket** — it closes itself when the PR is merged by a human.

## Forbidden

Merging PRs, pushing to `main`, editing `.github/`, `AGENTS.md` or agent skill directories,
claiming "fixed" without a green run, deleting someone else's tests to make things green.
