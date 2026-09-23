# Evidence Rules

Shared by all agents. A claim that something "works" without evidence is not accepted.

## Evidence Hierarchy

1. **Failing → green test.** The only proof that something was actually fixed.
2. **A green suite.** Proof that nothing around it broke.
3. **A screenshot.** Proof that it looks the way you claim. Complements the test, never replaces it.

A screenshot by itself proves no fix: it shows one moment and says nothing about regressions.

## How to Take Screenshots

```bash
node scripts/evidence.mjs before-12 --test flower
node scripts/evidence.mjs after-12 --test flower
node scripts/evidence.mjs feature-12 --mobile
node scripts/evidence.mjs after-12 --focus       # highlights where keyboard focus is
```

### When the Bug Has No Visual Symptom

Focus, aria attributes, in-memory state, tab order — none of this is visible on a regular
screenshot, and "before"/"after" come out identical. Identical pictures are not evidence, they are noise.

In that case **make the state visible** instead of making excuses:

- keyboard focus → the `--focus` flag: draws a badge with `document.activeElement` and a frame around it;
- another invisible state → add a highlight of that state to the screenshot script, following the same pattern.

If visualizing the state is impossible — say plainly that the screenshot is irrelevant here,
and do not attach identical pictures "for the record".

Files land in `docs/evidence/` and **are committed to the PR branch**.

## Where Screenshots Go

| Where | When | What exactly |
|---|---|---|
| **Ticket** | immediately after reproducing, **before the fix** | the "before" screenshot — proof the bug exists |
| **Ticket** | after the fix | the "after" screenshot + a link to the PR |
| **PR** | on creation | the full "before" + "after" set and the failing test output |

Both comments on the ticket are mandatory. A bare link to the PR instead of a screenshot is not accepted.

Why "before" as a separate earlier comment: the bug author needs to see confirmation that they
were heard and the bug reproduced, even if the work later stalls in `needs-human` and no fix happens at all.

## How to Show a Screenshot in a Comment

Only via a raw link to the branch:

```markdown
![after](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/BRANCH/docs/evidence/after-12-result.png)
```

GitHub Actions artifacts **do not work** — they are not visible in a comment and must be downloaded.

## Mandatory Minimum

| Case | Evidence |
|---|---|
| Bug fixed | failing test (its output) + green suite + "before" and "after" screenshots |
| Bug not reproduced | list of performed steps + screenshot of current behavior + questions for the author |
| Feature done | a test per acceptance criterion + green suite + desktop and mobile screenshots |
| Gave up (`needs-human`) | what you tried + what you saw + 2–3 hypotheses with links to lines |

## Honesty

The test was not run — write exactly that. The screenshot failed — say why.
An invented run result gets exposed within a minute and destroys trust in the entire pipeline.
