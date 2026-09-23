# Issue discovery and feature specification

Use this reference for triage and specifications. Stay in that stage unless implementation was also requested and authorized.

## Triage

Read the report, relevant repository guidance, and the code path it names. Check recent related issues if an issue tracker is available. Determine whether the request describes broken existing behavior, new behavior, documentation, or an unclear request. For a bug, capture the reproduction steps, expected and observed result, and environment when they matter. For a feature, identify the user, the problem, and the observable outcome.

Return a short triage note with: classification, what the code currently does, missing information, one grounded proposal for each resolvable gap, related issue links if found, and the next useful action. Mark a proposed choice as yours. Ask the user only when different answers would change the product and the repository provides no basis to choose. Do not label a bug reproduced until you have observed it.

## Feature specification

Trace the affected flow, nearby conventions, data and API boundaries, and tests. Write a spec another contributor can implement without inventing behavior:

- Who is affected and what they need to do.
- The behavior from the user's point of view, including important states and errors.
- Acceptance criteria phrased as observable actions and outcomes, with relevant responsive or accessibility cases.
- Likely files or components, existing pieces to reuse, dependencies or risks, and explicit scope limits where ambiguity is likely.
- Open product decisions, each with a recommended option when the evidence supports one.

Use a mockup only when visual placement or interaction is material and a visual artifact would resolve ambiguity. Base it on the actual interface and label any invented elements. Do not require a browser screenshot for a backend or text-only feature. If the repository has a human specification approval gate, leave it for a human; record the spec as ready for review without setting its approval state yourself.
