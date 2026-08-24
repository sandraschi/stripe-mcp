param([switch]$Headless, [switch]$BackendOnly, [switch]$NoBrowser)
$ErrorActionPreference = "Stop"
$ScriptRoot = Split-Path -Parent $PSCommandPath
$BackendPort = 11165
$FrontendPort = 11166

$Host.UI.RawUI.WindowTitle = "stripe-mcp - backend :$BackendPort / frontend :$FrontendPort"

if (-not $Headless) {
    Write-Host ""
    Write-Host "  stripe-mcp (Stripe Gateway & Austrian/EU Tax Compliance)" -ForegroundColor Cyan
    Write-Host "  BACKEND   http://127.0.0.1:$BackendPort   (REST /api, FastMCP /mcp, Webhooks)" -ForegroundColor Gray
    Write-Host "  FRONTEND  http://127.0.0.1:$FrontendPort  (React Webapp Dashboard)" -ForegroundColor Gray
    Write-Host ""
}

# Clear port zombies
Get-NetTCPConnection -LocalPort $BackendPort -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Get-NetTCPConnection -LocalPort $FrontendPort -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# Start backend job
$BackendJob = Start-Job -Name "stripe-mcp-backend" -ScriptBlock {
    param($Root, $Port)
    Set-Location $Root
    $env:PORT = $Port
    C:\Users\sandr\.local\bin\uv.exe run python -m stripe_mcp.server --port $Port
} -ArgumentList $ScriptRoot, $BackendPort

# Health poll
for ($i = 0; $i -lt 60; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:$BackendPort/api/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
        if ($r.StatusCode -eq 200) { break }
    } catch {}
    Start-Sleep 1
}

if ($BackendOnly) {
    Write-Host "Backend started on port $BackendPort. Press Ctrl+C to exit." -ForegroundColor Green
    while ($true) {
        if ($BackendJob.State -eq "Completed" -or $BackendJob.State -eq "Failed") {
            Receive-Job $BackendJob
            break
        }
        Start-Sleep 2
    }
    exit 0
}

# Start frontend
$WebRoot = Join-Path $ScriptRoot "webapp"
if (Test-Path $WebRoot) {
    Start-Process -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c npx vite --port $FrontendPort --host" -WorkingDirectory $WebRoot
}

if (-not $NoBrowser -and -not $Headless) {
    Start-Sleep -Seconds 2
    Start-Process "http://127.0.0.1:$FrontendPort"
}

# Keep-alive loop
while ($true) {
    if ($BackendJob.State -eq "Completed" -or $BackendJob.State -eq "Failed") {
        Receive-Job $BackendJob
        break
    }
    Start-Sleep 2
}
