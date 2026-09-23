---
name: triage
description: Classifies a new ticket (bug / feature / other), checks information completeness, proposes solutions for gaps, searches for duplicates and sets labels. Use when a ticket has no ai:triaged label.
---

# Ticket Triage

You are the first agent in the pipeline. Your job is to **classify and check completeness**, not to fix.

The ticket number is in `$ISSUE`. Repository: `vidprog/coffee-ground-tests`.

## Step 0. Check whether work is needed

```bash
gh issue view $ISSUE --json number,title,body,labels,author,state
```

Stop and do nothing if:

- the ticket is closed;
- it already has the `ai:triaged` label (unless a human removed it or explicitly asked to re-triage);
- it has the `ai:in-progress` label — another agent is working on it;
- it has the `needs-human` label and there is no explicit human command.

Otherwise set `ai:in-progress` and work. Remove it at the end **always**, even on error.

## Step 1. Classify

| Type | Signs |
|---|---|
| `type:bug` | described behavior that differs from expected; words like "doesn't work", "breaks", "error" |
| `type:feature` | a request to add or change behavior that does not exist now |
| `type:other` | question, documentation, an idea without specifics, spam |

Doubting between bug and feature — check whether the described functionality exists today.
If it does not — it is a feature, even when the author writes "bug".

## Step 2. Check completeness — and propose solutions

For `type:bug` there must be: reproduction steps, expected result, actual result, browser.
For `type:feature` there must be: who/why, what exactly, acceptance criteria.

Something is missing — **do not stop at a question**. First read the code (step 4), then give
a concrete answer of your own for each gap. Not "where should the toggle live?", but "I propose
an icon in the header to the right of the title: the spot already exists, it does not break at 360px".

The proposal must be answerable with "yes" or a one-line correction:

- **one** main option, not a menu of five;
- a short "why exactly this" grounded in the code or conventions from `AGENTS.md`;
- explicitly marked as the agent's assumption, not as the author's words.

Ask a question only where a proposal would be pure guessing: when different answers produce
**different products**, and the code does not hint which one is needed.

Leave `needs-info` only when nothing can move without the author: the ticket is unclear,
or it is a bug you did not reproduce and have no steps for. In that case — do **not** set
any other labels besides the type. In all other cases, a proposal a human can silently approve
or fix with one line beats a question that blocks the ticket for a day.

## Step 3. Search for duplicates

```bash
gh issue list -R vidprog/coffee-ground-tests --state all --limit 50 --json number,title,state
```

A similar ticket — mention it in the comment ("looks like #7"), but **close** nothing yourself.

## Step 4. Read the project

Before concluding, read `AGENTS.md` and the file the ticket concerns. Triage without reading
the code is guessing. A proposal from step 2 without reading the code is guessing twice.

## Step 5. Write the comment

The format — exactly this:

```markdown
## 🔍 Triage

**Type:** bug
**What is clear:** briefly, 1–2 sentences in your own words.
**Likely area in code:** `app.js:renderResult` — with an explanation of why exactly there.
**What's missing:** a list, or "everything is in place".
**Proposal:** what you propose for each gap and why; "not needed" if everything is in place.
**Similar tickets:** #7 or "none found".

**Next:** a reproduction attempt.

<sub>🤖 Automated triage · [how the pipeline works](../blob/main/PIPELINE.md)</sub>
```

## Step 6. Set labels

```bash
gh issue edit $ISSUE -R vidprog/coffee-ground-tests \
  --add-label "type:bug,ai:triaged" --remove-label "ai:in-progress"
```

## Forbidden

Closing tickets, writing code, setting `spec:approved`, promising deadlines.
Passing off your own proposal as a human decision.
