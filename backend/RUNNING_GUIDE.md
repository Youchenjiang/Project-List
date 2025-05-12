# 後端執行與防火牆設定指南

## 背景說明

在 Windows 環境中執行 Go 應用程式時，每次運行 `go run main.go` 都會生成不同的臨時可執行檔案，這會導致 Windows 防火牆將其視為新的應用程式，因此每次都會詢問是否允許通過防火牆。這可能會造成使用者體驗的困擾，本指南提供幾種解決方案。

## 解決方案

### 方案 1：使用啟動腳本

我們提供了兩個啟動腳本，這些腳本會將 Go 應用程式編譯成一個固定名稱的可執行檔（`backend.exe`），然後執行該檔案。由於可執行檔名稱固定，Windows 防火牆只會在第一次運行時詢問許可。

#### PowerShell 腳本 (run.ps1)

```powershell
# 使用方式：
cd backend
.\run.ps1
```

腳本內容：

```powershell
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
```

#### 命令提示字元腳本 (run.bat)

```bat
@echo off
echo 編譯後端應用程式...
go build -o backend.exe .

IF %ERRORLEVEL% NEQ 0 (
  echo 編譯失敗，錯誤碼: %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)

echo 啟動後端服務...
backend.exe

IF %ERRORLEVEL% NEQ 0 (
  echo 程式執行失敗，錯誤碼: %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
```

### 方案 2：手動設定防火牆規則

您可以為後端應用程式手動設定一個永久的防火牆規則：

1. 首先編譯應用程式：

   ```bash
   cd backend
   go build -o backend.exe .
   ```

2. 執行 `backend.exe`，當防火牆提示出現時，勾選「**私人網路**」和「**公用網路**」選項並點擊「允許存取」。

3. 或者，您可以手動創建防火牆規則：

   - 打開「Windows 防火牆進階安全性」（在開始選單中搜尋）
   - 選擇「輸入規則」→「新增規則」
   - 選擇「程式」，瀏覽選擇編譯好的 `backend.exe`
   - 選擇「允許連線」
   - 選擇所有網路類型
   - 輸入規則名稱，如「後端服務」，然後完成設定

### 方案 3：使用固定 IP 位址

我們已經將應用程式更新為只在 127.0.0.1 (localhost) 上監聽，這有助於減少防火牆提示的頻率：

```go
// 啟動服務器
serverAddr := "127.0.0.1:" + cfg.ServerPort // 明確綁定到 localhost IP
```

## API 端點

後端服務器將在默認情況下在 `http://127.0.0.1:8080` 上啟動並提供以下端點：

- `/` - 主應用端點
- `/api/test` - API 測試端點
- `/api/openai/chat` - OpenAI 聊天 API 代理
- `/swagger/` - API 文檔
- `/test` - API 測試頁面
- `/api/projects` - 專案列表 API

## 常見問題與解決方案

1. **防火牆提示仍然出現**

   如果在使用啟動腳本後仍然看到防火牆提示，請確保您已將 `backend.exe` 加入到防火牆的允許清單中。您可能需要以管理員身份運行命令提示字元或 PowerShell。

2. **端口被占用錯誤**

   如果您看到類似「某某端口被占用」的錯誤訊息，可能是另一個程式正在使用該端口。您可以通過設定環境變數更改端口：

   ```powershell
   $env:SERVER_PORT="8081"
   .\run.ps1
   ```

3. **找不到 Go 命令**

   如果系統找不到 go 命令，請確保 Go 已正確安裝並且添加到系統環境變數 PATH 中。

## 開發環境安全提示

- 開發環境中，我們使用共享的 API 金鑰以方便測試
- 在生產環境中，請使用安全的方式管理 API 金鑰，如環境變數或密鑰管理服務
- 永遠不要將金鑰直接寫入源代碼或提交到版本控制系統
