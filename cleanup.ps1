# 此腳本用於清理不再使用的文件

# 要刪除的文件列表
$filesToDelete = @(
    # WebAssembly 相關文件 (不再使用)
    ".\frontend\public\backend.wasm",
    ".\frontend\public\wasm_exec.js",
    
    # 空目錄
    ".\backend\cmd\wasm",
    
    # 重複的防火牆文件 (已整合到 RUNNING_GUIDE.md)
    ".\backend\FIREWALL_GUIDE.md",
    ".\backend\BACKEND_RUNNING_GUIDE.md",
    ".\WINDOWS_FIREWALL.md"
)

# 清理文件
foreach ($file in $filesToDelete) {
    $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $file
    if (Test-Path -Path $fullPath) {
        Write-Host "刪除文件: $fullPath" -ForegroundColor Yellow
        Remove-Item -Path $fullPath -Force
    } else {
        Write-Host "文件不存在，無需刪除: $fullPath" -ForegroundColor Cyan
    }
}

# 刪除空目錄 (如果存在且為空)
$emptyDirs = @(
    ".\backend\cmd"
)

foreach ($dir in $emptyDirs) {
    $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $dir
    if (Test-Path -Path $fullPath) {
        $items = Get-ChildItem -Path $fullPath
        if ($items.Count -eq 0) {
            Write-Host "刪除空目錄: $fullPath" -ForegroundColor Yellow
            Remove-Item -Path $fullPath -Force
        } else {
            Write-Host "目錄不為空，不刪除: $fullPath" -ForegroundColor Cyan
        }
    } else {
        Write-Host "目錄不存在，無需刪除: $fullPath" -ForegroundColor Cyan
    }
}

Write-Host "清理完成！" -ForegroundColor Green
