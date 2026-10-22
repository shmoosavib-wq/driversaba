Set-Location $PSScriptRoot
Start-Process dotnet -ArgumentList 'run','--project','src/TireStore.Api','--urls','http://localhost:5188' -WindowStyle Hidden -RedirectStandardOutput api.log -RedirectStandardError api.err
Start-Sleep 12
Invoke-RestMethod 'http://localhost:5188/api/admin/products?page=1&pageSize=2' | ConvertTo-Json -Depth 4
