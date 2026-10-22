# Tire Store production readiness

This plan reflects the code currently under `front-src-2`, `tire-store-admin`,
and `tire-store-api`. The workspace has no Git metadata, so repository history
and a trustworthy pre-change diff are unavailable. Keep each phase narrow and
record verification before enabling a production deployment.

## Current blockers

1. ERP driver authentication and fleet/order ownership are not implemented.
   Credit, order, installment, and payment routes are now Development-only, so
   they remain unavailable outside Development until that integration exists.
2. `IOrderRepository` and `ICreditRepository` resolve to `InMemoryStore`, so
   orders, installments, and credit state do not survive an API restart.
3. SQL Server is now supported for non-Development environments and has an
   initial EF Core migration. Existing SQLite records are not automatically
   copied, and production deployment still needs a reviewed data migration.

## Delivery phases

### Phase 1 — Repository and build baseline

- Keep local environment files, database files, logs, and build artifacts out
  of source control.
- Pin CI to a supported Node runtime, install from the committed Yarn lockfile,
  and make the production build reject TypeScript errors.
- Keep `.env.example` files limited to public configuration names; client
  environment variables must never contain secrets.

### Phase 2 — Persistence and schema lifecycle

- [x] Add SQL Server infrastructure behind the existing application abstractions.
- [x] Add a versioned initial migration for catalog, inventory, and panel access
  schema without changing their API contracts.
- [x] Keep SQLite `EnsureCreated` isolated to Development; production refuses
  SQLite and refuses to start while SQL Server migrations are pending.
- [ ] Review and execute a separate SQLite-to-SQL Server data migration before
  moving any existing catalog or panel users.

### Phase 3 — Identity and access boundaries

- Integrate driver identity from the ERP contract; do not infer identity from
  client-supplied driver IDs.
- Scope credit, orders, installments, and store operations to the authenticated
  actor and authorized tenant at the application boundary.
- Verify panel membership/permissions and CSRF behavior against the live API.

#### ERP archive findings (read-only)

- The app JWT contract includes `PeopleId`, `PeopleInfoId`, `UserId`, `Post`,
  `PostDepId`, and related profile claims. The driver role check uses `Post`;
  the app token contract does not provide a fleet ownership claim. Resolve
  selected fleets through ERP authorization rather than trusting request IDs.
- Do not copy the current ERP JWT configuration as-is: issuer/audience
  validation is disabled and the authentication failure path returns exception
  details. The ERP API also enables the Developer Exception Page unconditionally.
- The supplied `ERP.zip` contains a hard-coded logging-service credential in
  `NaraErp/NaraErp.API/Program.cs:24` and Firebase service-account credential
  files under `NaraErp/NaraErp.API/`. Treat them as exposed: revoke/rotate them
  before deployment and remove them from source/archive distribution.

### Phase 4 — Financial workflow persistence

- [x] Make inventory reservation conditional and atomic, including duplicate
  product lines, to prevent overselling at the stock repository boundary.
- An isolated SQLite Development smoke test rejected duplicate lines totaling
  22 against stock 20 without changing stock; two simultaneous requests for 15
  units created one order and left stock at 5.
- Persist orders, installments, credit requests/balances, and payment attempts
  with explicit driver ownership.
- Make order, inventory, credit, and installment changes transactional and
  enforce concurrency and idempotency for checkout/payment callbacks.

### Phase 5 — Frontend and admin contracts

- Keep tire-store features behind their existing page/service boundaries and
  move shared API types to a versioned contract generated from OpenAPI.
- Keep order workflow demos in Development; expose order screens in Production
  only after the API provides durable, authorized order data.
- Keep demo data confined to Development and avoid reporting financial KPIs
  that are not backed by persisted payment/settlement records.
- [x] Keep the initial non-Development API release catalog-only: driver credit,
  orders, installments, payments, and seller order operations are not mapped.
- [x] Advertise commerce availability from the API; the driver app and admin
  panel hide purchase/order actions when commerce is unavailable.
- Keep the legacy driver app shell intact while progressively isolating the
  tire-store feature; avoid unrelated app-wide rewrites.

### Phase 6 — Release controls

- [x] Add a readiness endpoint that checks database connectivity and pending
  SQL Server migrations, separate from the liveness endpoint.
- [x] Fail startup outside `Development` when `Cors:Origins` is not explicitly
  configured, instead of silently serving a browser-inaccessible deployment.
- [x] Reject invalid/path-based origins and require HTTPS for non-Development
  origins; Development keeps its HTTP localhost defaults.
- [x] Increment failed panel-login attempts atomically in the database so
  concurrent failures cannot overwrite each other's lockout count.
- [x] Add a root Azure pipeline covering the driver app, admin panel, and API.
- [ ] Configure Azure DevOps to use the new pipeline file and verify its first
  hosted/agent run; the workspace contains no Git metadata to inspect that state.
- Add focused authorization, persistence, transaction, payment, and UI-flow
  checks to CI before enabling deployment.
- Add health/readiness checks, structured redacted logs, monitoring, backup and
  restore rehearsal, and a documented rollback path.
- Verify HTTPS, exact CORS origins, production secrets, and payment gateway
  configuration in staging before production traffic.

## Phase 1 changes in this delivery

- Both existing driver-app pipelines now use Node 22, enforce the Yarn lockfile,
  and explicitly reject TypeScript compile errors.
- `.env` files, local databases, logs, and generated build output are excluded
  from the relevant application source directories; example config files stay
  trackable.
- Driver-app and admin environment files are ignored, with example files
  explicitly allowed.
- Removed the unused `VITE_ADMIN_KEY` example; values exposed through Vite
  client variables must be treated as public, never as backend credentials.
- API local database/build output and temporary logs are ignored.
- TireStore now renders product cards and discount ribbons through focused
  components; catalog filtering and cart state remain owned by `Catalog`.
- Persian number formatting and installment display calculation are shared
  helpers rather than duplicated in the card and detail views.
- Production admin screens no longer mix fabricated orders into API results;
  the dashboard clearly identifies the catalog-only release stage.

Later phases remain required for production; these repository/build changes do
not make the API production-safe by themselves.

## Phase 2 implementation notes

- SQL Server is the default provider outside `Development`; configure
  `ConnectionStrings__StoreSqlServer` through the deployment secret store.
- Apply the checked-in EF migration as a one-off deployment step with
  `dotnet run --project src/TireStore.Api -- --migrate-store-database`.
  The API does not automatically mutate the schema on normal startup.
- Keep `Database__Provider=Sqlite` and `ConnectionStrings__StoreDatabase` for
  local Development only. Sample stores/products are seeded only in this mode.
- The initial migration creates schema only; it does not migrate existing
  SQLite data. Orders, credit, installments, and payment-attempt persistence,
  as well as driver identity/authorization, remain release blockers.
- Outside Development, `GET /api/store/capabilities` reports commerce disabled.
  Only public shop/product reads and authenticated product/access management
  remain mapped until identity, ownership, durable finance, and transaction
  guarantees are delivered.
- Configure `Cors__Origins` with the exact driver/admin browser origins outside
  Development. The base appsettings file intentionally has an empty origin list;
  startup now fails instead of silently allowing a broken cross-origin deploy.
