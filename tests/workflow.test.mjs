import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync('.github/workflows/ai-pipeline.yml', 'utf8');
assert.match(workflow, /copilot-requests: write/);
assert.match(workflow, /GITHUB_TOKEN: \$\{\{ github\.token \}\}/);
assert.match(workflow, /copilot --model gpt-5\.3-codex/);
assert.doesNotMatch(workflow, /OPENAI_API_KEY|secrets\./);
const [, block] = workflow.split('          script: |\n');
assert.ok(block, 'feedback script exists');
const source = block.split('\n').map(line => line.replace(/^            /, '')).join('\n');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const post = new AsyncFunction('github', 'context', 'process', source);

test('feedback creates once and updates on rerun', async () => {
  const calls = [];
  let comments = [];
  const github = {
    paginate: async () => comments,
    rest: { issues: {
      listComments: () => {},
      createComment: async args => calls.push(['create', args]),
      updateComment: async args => calls.push(['update', args]),
    } },
  };
  const context = {
    eventName: 'issues',
    payload: { issue: { number: 42 }, label: { name: 'ai:triage' } },
    repo: { owner: 'owner', repo: 'repo' },
  };

  await post(github, context, { env: { CODEX_FINAL_MESSAGE: 'Triage' } });
  assert.equal(calls[0][0], 'create');
  comments = [{ id: 5, user: { login: 'github-actions[bot]' }, body: calls[0][1].body }];
  await post(github, context, { env: { CODEX_FINAL_MESSAGE: 'Updated' } });
  assert.equal(calls[1][0], 'update');
  assert.equal(calls[1][1].comment_id, 5);

  context.eventName = 'pull_request';
  context.payload = { pull_request: { number: 7 } };
  await post(github, context, { env: { CODEX_FINAL_MESSAGE: 'Review' } });
  assert.equal(calls[2][0], 'create');
  assert.match(calls[2][1].body, /^<!-- ai-dev-pipeline:review -->/);
});
