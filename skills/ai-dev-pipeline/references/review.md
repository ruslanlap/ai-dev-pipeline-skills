# Pull request review

Read the PR description, linked issue or spec, diff, surrounding code, and available checks. Compare the implementation with the requested behavior before commenting on style. Run a targeted check when the checkout and dependencies permit it; distinguish your run from CI results.

Look for concrete defects: missed acceptance criteria, a test that would pass without the fix, regressions in sibling callers, changed behavior outside scope, missing validation at a trust boundary, or evidence that does not show the claim. Check repository-specific conventions only where the diff touches them. Do not require screenshots for nonvisual changes or a fixed number of tests for every criterion.

Lead with actionable findings, ordered by severity. For each, give the file and line, the triggering scenario, and the resulting behavior. Separate a blocking defect from a preference. If no actionable findings remain, say so plainly and name any checks you could not run. Do not imply that review is a formal approval or merge the PR. Publish a review comment only when the user asked for one.
