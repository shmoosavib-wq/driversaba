# TireStore architecture review and incremental migration

Date: 2026-10-20. Scope: front-src-2/src/pages/TireStore only for implementation.
Status: Phase 1 started, not a completed integration or full acceptance sign-off.

## Reference and constraints

Read Front_Sababar(new_ver).zip directly: package.json, src/Routers/protected.tsx,
and src/services/api-manager.ts. Existing extracted reference was also inspected.
The reference uses React 18, CRACO, React Router 6, React Query 3,
styled-components, @/ imports and a cookie-aware shared Axios API manager.
Keep the host's pages/components/services/Routers convention. Do not modify host
pages, auth, backend contracts, reference ZIP, or add dependencies/state managers.
The workspace is not a Git repository; no reliable Git diff/history is available.
No credentials or environment-file contents were included in this report.

## Confirmed findings, ordered by priority

1. P1 integration blocker: src/services/tire-store-api.ts:4 creates its own
   Axios instance and base URL, unlike the shared src/services/api-manager.ts.
   This is a confirmed architecture mismatch, not proof of an authorization bug.
   Do not blindly replace it: confirm backend origin, path prefixes and interceptor
   behavior first. Migration must preserve current request/response contracts.
2. P1 navigation: src/pages/TireStore/index.tsx:19 defines View, and :70 uses
   local history/setView. Product/shop/order navigation is not URL-owned; most
   views cannot survive direct refresh, and browser Back is not feature history.
   Migrate to host protected nested routes, retaining legacy query links through
   a compatibility redirect. Recover IDs from URL, validate them before queries.
3. P1 async ownership: src/pages/TireStore/index.tsx:49 polls products every
   15 seconds and :51 polls orders every 5 seconds independent of displayed screen.
   Move queries into cohesive hooks with central keys, screen-aware enabled flags
   and terminal-status polling. Keep server state in React Query, not Zustand.
4. P1 recoverability: src/pages/TireStore/index.tsx:78 only reads HTTP message
   via any; local Error messages are lost. Screen composition also substitutes []
   for unavailable responses. Audit each loading/error/empty/permission/retry branch
   before consolidating an AsyncState component. Do not equate errors with empty data.
5. P2 responsibility boundaries: index orchestrates navigation, credit, payment,
   cart, queries and mutations. OrderScreens.tsx:95 groups five independent screens;
   Catalog.tsx:97, :131 and :195 group shops, catalog and product details.
   Split cohesive responsibilities, not arbitrary line-count chunks.
6. P2 finance presentation: Catalog.tsx:13 computes an installment estimate and
   Checkout.tsx:18 constructs dates locally. Confirm backend quote schedule and
   rounding policy. No backend accounting error is established by this review.
   Keep final amounts server-authoritative; label estimates if still necessary.
7. P2 fleet boundary: helpers.ts:2 and index.tsx:65 use any and permissive fallbacks.
   Normalize ERP input once from unknown into a small Fleet model after obtaining
   real contract examples; reject invalid IDs rather than inventing valid identity.
8. P2 styles: style2.ts through style5.ts mix unrelated visual responsibilities.
   Move styles beside their owning screen/component as those boundaries are split;
   do not simply rename mixed files and pretend ownership is fixed.
9. P2 validation gap: no existing *.test.* files were found under front-src-2/src.
   Establish an approved test baseline before claiming flow coverage. Development
   mock fleets are already gated by NODE_ENV === development; their presence is
   not evidence of production mock exposure.

## Phase 1 implemented

- hooks/useTireCart.ts owns cart state, quantity clamping, API line items and
  display lines. It preserves the existing stock limit, delete-on-zero and
  setCart reset/shop-change behavior. No persistence or global state was added.
- components/ProformaInvoice.tsx owns invoice presentation only; no API calls,
  auth, financial rules or new UI were introduced. Existing totals and markup
  were preserved. Existing one-letter identifiers in extracted markup were not
  introduced or expanded as part of this behavior-preserving move.
- index.tsx consumes useTireCart; OrderScreens.tsx consumes ProformaInvoice.
- No existing driver-app page, router, shared API client or backend was edited.

## Next phases and acceptance gates

1. Query/orchestration: useTireCatalog, useTireOrders, useTireCheckout and central
   query keys; focused request state/retry handling; preserve cache compatibility.
2. Routes: routes/ with RouteObject[] registered by the host team under RequireAuth.
   Keep /tire-store entry compatible. Add shops/:shopId/products, products/:productId,
   checkout, orders/:orderId, orders/:orderId/delivery, installments, history and
   payment/return. Test direct refresh, browser Back and old notification URLs.
3. Screens: screens/{ShopList,TireCatalog,TireDetails,Checkout,OrderStatus,Delivery,
   Installments,PurchaseHistory}/index.tsx and style.ts. Extract gallery, quantity
   selector, plan selector and delivery picker only where ownership is real.
4. API/fleet/payment boundaries: agree host API mapping, add typed adapters, shared
   HTTP error normalization and safe payment-return validation. Before changes to
   payment redirects/auth/external integrations, perform a scoped threat-model review.
5. Validation: approved flow tests for quantity boundaries, shop reset, checkout
   failure/retry, duplicate submissions, seller status polling, payment return refresh,
   delivery date selection, invoice totals and direct navigation; build/type/lint.

## Open questions / backend coordination

- Is TireStore on the host API origin or a separate service behind a reverse proxy?
- Does quote expose authoritative installment due dates and rounding allocations?
- What is the authoritative ERP fleet DTO and identity field?
- Which order statuses are terminal for polling and which payment hosts are allowed?
- Are order creation/payment initiation idempotent and ownership checked server-side?
  These are unverified contracts, not confirmed backend vulnerabilities.

## Migration and changed files

New: pages/TireStore/hooks/useTireCart.ts,
     pages/TireStore/components/ProformaInvoice.tsx.
Changed: pages/TireStore/index.tsx, pages/TireStore/OrderScreens.tsx.
Documentation: docs/architecture/tire-store-refactor-review-2026-10-20.md.
Copy these feature-only changes into the host branch; preserve @/ resolution,
React Query 3 and existing service import. No package or auth migration required.
Full route, API client, screen/style and fleet migration remains explicitly pending.

## Validation

Baseline and post-change TypeScript checks passed with --noEmit --incremental false.
Focused ESLint completed with zero errors and warnings in existing screen code;
new import-group warnings were subsequently corrected and lint rerun.
CRACO production build with CI=true failed because Autoprefixer warnings about
CSS end versus flex-end are treated as errors. No stylesheet was changed in this
phase. The build also reports outdated Browserslist data, empty Tailwind content
configuration and missing Git metadata. A successful production build and browser
regression run are not claimed. No dependencies were installed, external APIs contacted,
financial transactions performed or production browser flows exercised.
