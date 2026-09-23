# Working with GitHub from a Cloud Session

A reference for all pipeline agents. Repository: `vidprog/coffee-ground-tests`.

## Access Check

The first thing an agent does:

```bash
gh auth status && gh repo view vidprog/coffee-ground-tests --json name
```

No access — stop and say so plainly. Do not pretend to work.

## Fresh Repository State First

A checkout in a cloud session arrives in **detached HEAD**, and its `origin/*` refs may be
stale: they show the state at the time the image was built, not the current one.

So **before any conclusion** about the state of branches:

```bash
git fetch origin --prune
git log --oneline -5 origin/main
```

The failures this avoids:

- "this commit is not on `main`" — it actually is, the ref is just stale;
- "the commit was never pushed" — detached HEAD does not mean the commit is local-only;
- working from an old base and a conflict on push.

If the discrepancy remains after `git fetch` — it is real, then stop and call a human.

## Common Commands

```bash
# tickets
gh issue view $ISSUE --comments
gh issue list --label "type:bug" --label "ai:triaged" --state open --json number,title
gh issue comment $ISSUE --body-file comment.md
gh issue edit $ISSUE --add-label "x" --remove-label "y"

# PRs
gh pr create --draft --title "..." --body-file body.md
gh pr ready $PR
gh pr checks $PR
gh pr comment $PR --body-file review.md
```

Long comments always via `--body-file`, not `--body`: quotes and line breaks in text
break the shell.

## Loop Protection

Agent comments → the comment triggers an agent → an endless loop and bill.

Before starting, check the author of the last comment. If it is a bot or yourself —
stop, except when a human explicitly asked to continue.

## Idempotency

A run may be repeated. Before publishing a comment, check whether it already exists:

```bash
gh issue view $ISSUE --comments --json comments -q '.comments[].body' | grep -c "## 🔍 Triage"
```

Already there — update the existing comment instead of duplicating, or just exit.

## Always Clean Up After Yourself

The `ai:in-progress` label is removed under **any** outcome: success, error, giving up.
A leftover `ai:in-progress` blocks the ticket forever.
