# BUILD knowledge entitlement repair

## Failure and containment

The block collector previously assigned every non-showcase section to `beginner`, while the product paywall reserves displayed blocks after the first to `full`. SQL and TypeScript correctly applied the stored tier, but that tier was wrong. This is a source-classification defect, not evidence that model instructions enforce authorization.

`tests/knowledgeBlocEntitlements.test.ts` reproduces the original failure and checks every displayed block and section. The corrected collector preserves preview access to `b1-s0`, assigns the rest of the first displayed block to beginner, and assigns later blocks to full. Stable section identifiers must not be confused with the reordered display numbers.

`repair-bloc-knowledge-access.ts` defaults to a read-only inventory. With `--apply` it only tightens the canonical restricted section set to full, does not delete content or rewrite embeddings, and reads back identities, row count, restricted tiers and unchanged unrelated grants. Run with authorized environment variables; never place credentials in a report.

The production repair on 2026-09-10 restricted 52 of 61 existing block chunks, spanning 23 sections. A real-vector query through the production knowledge RPC returned zero locked matches for preview and beginner and positive locked matches for full. Temporary test identities and profiles were removed and verified absent. This is database/RPC evidence, not a substitute for the final deployed HTTP MCP gate.

## Assistant behavior

The MCP initialization response includes `BUILD_ASSISTANT_INSTRUCTIONS`: answer simple questions directly, ask targeted contextual questions only when they change the advice, combine accessible sources with general reasoning, explain concrete steps for practical requests, and label source-backed claims versus deductions. The client/model ultimately controls how it follows these instructions; protocol delivery is testable, exact Claude answer quality still requires user feedback.

An inaccessible block must not be reconstructed via alternate searches or source paths. A model can explain a general concept without attributing that explanation to unavailable BUILD material. Material already disclosed in an existing conversation cannot be withdrawn by correcting future retrieval permissions.

## Release gates

1. Collector regression, full application tests and typecheck.
2. Production build and independent review of the exact staged tree.
3. Verify data entitlements again after any knowledge ingestion.
4. Deployed MCP initialize plus real search for preview, beginner and full; check both error channels and authorization tiers.
5. Verify private block text is absent from public client assets and unavailable page/RSC responses.
6. Remove and read back every temporary OAuth client, token, profile and auth user.

The skills catalogue uses a separate versioned pointer; preserve legacy `manifest.json` during its transition. Knowledge ingestion and skills ZIP publication are different operations and require distinct verification.
