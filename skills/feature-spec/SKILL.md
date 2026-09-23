---
name: feature-spec
description: Researches a feature request and writes a specification with acceptance criteria and a screenshot mockup for human review. Use for type:feature tickets after triage.
---

# Feature Specification

Your job is to **research and describe**, not implement. No feature code is written at this stage.
A human reads the result and decides: set `spec:approved` or return it for a rewrite.

The ticket number is in `$ISSUE`.

## Step 0. Check the state

Work only if there is `type:feature` + `ai:triaged`, and no `spec:ready`, `spec:approved`,
`ai:in-progress`, `needs-info`. Set `ai:in-progress`, remove it at the end.

Exception: a human explicitly asked for a rewrite — then rewrite, even if `spec:ready` is already set.

## Step 1. Research

Read `AGENTS.md`, then the actual code in the change area. Find out concretely:

- where exactly this behavior lives in the current code (file and function);
- what already exists that can be reused;
- what constraints the pure frontend without a build imposes (no server, no state between sessions);
- whether it conflicts with `prefers-reduced-motion`, responsive layout, the Ukrainian localization.

A specification without links to specific lines of code is fiction. That is how it will be judged too.

## Step 2. Draw the mockup — as a real screenshot

ASCII-art in a comment is **forbidden**. A human must see the result with their own eyes,
not reconstruct it from boxes and dashes.

The mockup is made **by overlaying on the live page**, not by editing project files:

1. Write a throwaway script in `/tmp` (it never lands in the repository).
   Node will not find the project's `node_modules` from there — load Playwright via
   `createRequire("<project root>/package.json")`, not a plain `import`.
2. Start the site as is, open it in Playwright — the same Chromium as in the tests.
3. Overlay the proposed change at runtime: `page.addStyleTag`, `page.evaluate`,
   `context.addInitScript`. Do **not** touch `index.html`, `styles.css`, `app.js`.
4. Capture at least two widths: desktop 1280 and mobile **360** — the same one as in the acceptance criteria.
5. If the change has states (on/off, before/after) — show both.

File names: `docs/evidence/spec-$ISSUE-<screen>[-mobile].png`.
The naming convention is in `_shared/evidence.md`.

Then put the PNGs on a branch so the raw link works. A branch **with images only**,
no code and no PR:

```bash
git worktree add /tmp/mockup-$ISSUE -b ai/$ISSUE-spec-mockup origin/main
cp docs/evidence/spec-$ISSUE-*.png /tmp/mockup-$ISSUE/docs/evidence/
git -C /tmp/mockup-$ISSUE add docs/evidence/
git -C /tmp/mockup-$ISSUE commit -m "Mockup for specification #$ISSUE"
git -C /tmp/mockup-$ISSUE push -u origin ai/$ISSUE-spec-mockup
git worktree remove /tmp/mockup-$ISSUE
```

The worktree is so you do not drag uncommitted changes from the working branch along.

The link for the comment:
`https://raw.githubusercontent.com/vidprog/coffee-ground-tests/ai/$ISSUE-spec-mockup/docs/evidence/spec-$ISSUE-home.png`

**The mockup must be honest.** It is an overlay on the real layout of the real project,
so it shows real proportions, fonts and behavior at 360px. If you draw something that does not
exist in the project — say so in the caption under the image.

## Step 3. Write the specification

As a comment on the ticket, exactly in this format:

```markdown
## 📋 Specification

### Who and why
The user, the scenario, the problem. One or two sentences.

### What we do
A description of the behavior from the user's point of view. Without the words "optimize",
"improve" — only what can be seen on screen.

### What it will look like

| Desktop | 360px |
|---|---|
| ![desktop](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/ai/$ISSUE-spec-mockup/docs/evidence/spec-$ISSUE-home.png) | ![mobile](https://raw.githubusercontent.com/vidprog/coffee-ground-tests/ai/$ISSUE-spec-mockup/docs/evidence/spec-$ISSUE-home-mobile.png) |

Under the images — one line about what exactly is shown on them and what was drawn in.

### Acceptance criteria
- [ ] Each item is verifiable by a Playwright test.
- [ ] Phrase it as an observable action: "after clicking X, Y appears".
- [ ] Mandatory item about the mobile width 360px.
- [ ] Mandatory item about `prefers-reduced-motion`, if there is animation.

### Out of scope
What we deliberately do NOT do in this ticket. At least two items.

### Technical plan
| File | Change |
|---|---|
| `app.js` | new function `shareResult()` next to `copyResult()` (line ~118) |
| `styles.css` | button style based on `.ghost-btn` |
| `tests/share.spec.js` | new test for the acceptance criteria |

Size estimate: S / M / L. Risks: what may go wrong.

### Open questions
Where a human decision is needed. If there are none — write "none".

---
👤 **Review needed.** Agree — set the `spec:approved` label, and implementation can start.
Something is off — write a comment, I will rewrite the specification.

<sub>🤖 Automated specification · the mockup was overlaid in a browser, project code was not touched</sub>
```

## Step 4. Set labels

```bash
gh issue edit $ISSUE -R vidprog/coffee-ground-tests \
  --add-label "spec:ready" --remove-label "ai:in-progress"
```

## If the specification was returned

Read the reason, rewrite the specification **with exactly that remark in mind**,
note in the comment what changed compared to the previous version, and retake the mockup
if the remark was about looks. Do not argue, but if the remark contradicts the code —
say so directly, with links to lines.

## Forbidden

Writing feature code, editing project files for the mockup, opening a PR,
setting `spec:approved` yourself, making assumptions about a backend or a build — there are none in the project.
ASCII-art instead of a screenshot. Drawing the mockup in a graphics editor instead of a browser —
it will lie about proportions.

The branch `ai/$ISSUE-spec-mockup` with PNGs only — the only thing this skill is allowed to push.
