# Local credit approval demo

Explicit local-test request, 2026-10-21. Replaces the frontend-only credit override.

Start from tire-store-api:

    dotnet run --project src/TireStore.Api --urls http://localhost:5188 -- --Demo:EnableCreditApproval=true

POST /api/store/credit/demo-approve exists only in Development with this opt-in flag.
It additionally requires loopback local/remote connections, a loopback Host and the
local app Origin on port 3000. No client-supplied credit amount is accepted.
It uses CreditService.Approve, requires a pending request, returns existing approval
on repeated clicks, and retains order validation and all administrator permissions.
The frontend's development-only demo button updates the real local credit query.
No fake Approved state, warning banner or artificial checkout rejection remains.

Trust boundary: a local browser can approve local test credit without an ERP session
when explicitly enabled by the developer. This must not be used with real financial
data or exposed via proxies/tunnels. Origin is a browser cross-site guard, not user
authentication. Local processes are trusted. Production never maps this route even
if the flag is supplied. Default Development also does not map it.

Credit and orders are in memory in the current backend: API restart resets them.
Re-submit a credit request after restart before using the demo approval button.
Normal business validation and actual errors are not hidden.

