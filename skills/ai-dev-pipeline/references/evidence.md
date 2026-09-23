# Evidence for claims

Choose proof that matches the claim:

| Claim | Useful evidence |
| --- | --- |
| A bug existed | Reproduction steps and observed failure; ideally a failing regression test |
| A fix works | The same check passing after the change, plus relevant regression checks |
| A feature meets its spec | Checks mapped to observable acceptance criteria |
| The UI looks right | Screenshot or browser inspection at relevant states and sizes |
| A PR is ready | Relevant checks, reviewed diff, and stated unresolved risks |

Record the command or action and its result. A screenshot cannot establish that a nonvisual state changed; expose the state through a test or inspection instead. A green suite alone does not establish that the new behavior was tested. If a check could not run, say why and limit the conclusion accordingly.

Store evidence using the target repository's convention. When sharing a screenshot, use a link the reviewer can actually open. Avoid duplicate images that do not show a difference. Do not invent test output, GitHub checks, or browser runs.
