# Bug fixes and feature implementation

Check the requested scope, repository instructions, existing tests, and the entry point of the behavior. Search for all callers before changing a shared function. If an approved spec or issue is the authority, read its latest version and any subsequent clarifications. If the project requires human approval before implementation, verify it is present and human-granted.

## Bug fix

1. Reproduce the reported behavior with the smallest relevant run. Record exact steps and observed output. If it cannot be reproduced, investigate environmental differences and report what was tried; do not claim a fix.
2. Find the cause in the full call path. Add the smallest regression check that fails for the bug and succeeds for the intended behavior. A test is preferred when the repository supports one; for a manual-only case, document repeatable steps and the observable difference.
3. Make the smallest change at the shared cause. Run the regression check, then relevant existing checks. Inspect sibling callers affected by the edit.

## Feature

Implement the accepted behavior and its relevant error and accessibility states. Cover acceptance criteria with focused checks using the project's existing test approach. Check that those checks detect a missing implementation when practical. Avoid unrelated cleanup and new dependencies unless the feature requires them. If a spec conflicts with the code or lacks a product decision needed to proceed, surface that specific conflict rather than silently expanding the spec.

## Deliverable

Report what changed, the cause or acceptance criteria it addresses, commands run and their results, and any unverified behavior. Capture before/after visual evidence only when the change is visual and the environment supports it. If a PR was requested, make its description reviewable: issue link, behavior, tests, visual evidence when useful, and remaining risk. Do not claim tests passed from a command that was not run.
