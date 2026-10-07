# Per-repo fleet start config for stripe-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'stripe-mcp'
    BackendPort  = 11165
    FrontendPort = 11166
    HealthPath   = '/api/health'
    WebRoot      = 'webapp'
    Backend = @{
        Kind          = 'uvicorn'
        UvicornTarget = 'stripe_mcp.server:app'
        SyncExtras    = @('dev')
        SyncOnStart  = $true
        Env           = @{ WEB_PORT = '11165' }
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
