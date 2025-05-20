# 編譯後端為固定的可執行檔
Write-Host "編譯後端應用程式..." -ForegroundColor Cyan
go build -o backend.exe .

# 檢查編譯是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Host "編譯失敗，錯誤碼: $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

# 執行編譯後的程式
Write-Host "啟動後端服務..." -ForegroundColor Green
./backend.exe

# 捕獲錯誤
if ($LASTEXITCODE -ne 0) {
    Write-Host "程式執行失敗，錯誤碼: $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
