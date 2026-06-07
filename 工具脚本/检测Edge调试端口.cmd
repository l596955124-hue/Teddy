@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "try { $r = Invoke-WebRequest -Uri 'http://localhost:9223/json/version' -UseBasicParsing -TimeoutSec 3; Write-Host 'EDGE_CDP_OK_9223'; Write-Host $r.Content } catch { Write-Host 'EDGE_CDP_NOT_READY_9223'; Write-Host $_.Exception.Message }"
