Set-Location $PSScriptRoot
Start-Process cmd -ArgumentList '/c','npm run dev' -WindowStyle Hidden
Start-Sleep 6
(Invoke-WebRequest http://localhost:5173 -UseBasicParsing).StatusCode
