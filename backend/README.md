# OpenAI API 後端代理

這個後端服務提供了一個安全的代理，用於處理對 OpenAI API 的請求。它解決了將 API 密鑰暴露在前端代碼中的安全問題。

## 關於共享 API 金鑰

為了方便開發，本專案已內建一個共享的 OpenAI API 金鑰，所有開發者可以直接使用，無需額外設置。這個金鑰已安全地存儲在後端代碼中，不會暴露在前端。

## 設定步驟

1. 直接啟動後端服務即可使用共享金鑰：

    ```bash
    go run main.go
    ```

    或者使用啟動腳本（解決Windows防火牆問題）：

    ```bash
    # PowerShell方式
    .\run.ps1

    # 或使用命令提示字元
    run.bat
    ```

2. (可選) 如果您想使用自己的 API 金鑰，可以設置環境變數：

    ```powershell
    $env:OPENAI_API_KEY="your_api_key"
    go run main.go
    ```

詳細的後端運行指南和防火牆設定說明，請參考 [RUNNING_GUIDE.md](RUNNING_GUIDE.md)

## 架構說明

本專案採用模塊化架構設計，將功能分為多個模塊：

- **config**: 配置管理
- **middleware**: HTTP 中間件
- **router**: 路由處理
- **services**: 業務邏輯實現

詳細架構說明請參考 [ARCHITECTURE.md](ARCHITECTURE.md)。

## API 端點

### POST /api/openai/chat

允許從前端安全地調用 OpenAI 聊天 API。

#### 請求格式

```json
{
  "message": "用戶的消息",
  "character": "teddy 或 belle"
}
```

### GET /api/test

用於測試後端連接是否正常。

#### 回應格式

```json
{
  "status": "ok",
  "message": "API 測試成功"
}
```

## API 安全性建議

- 永遠不要將 `.env` 文件提交到版本控制系統
- 確保在生產環境中使用安全的方式來管理 API 密鑰，如環境變數或密鑰管理服務
- 在生產環境中，考慮添加更多安全機制，如 API 速率限制和請求驗證

## Windows 防火牆設定

使用 Go 運行後端時，可能會遇到 Windows 防火牆每次都要求授權的問題，因為 Go 每次都會編譯生成一個新的臨時可執行檔案。我們提供了幾種解決方案：

### 方法一：使用啟動腳本

我們提供了兩個啟動腳本來解決此問題：

1. **使用 PowerShell 啟動**：

   ```powershell
   cd backend
   .\run.ps1
   ```

2. **使用命令提示字元啟動**：

   ```cmd
   cd backend
   run.bat
   ```

這些腳本會將 Go 應用程式編譯成一個固定的可執行檔 (`backend.exe`)，這樣防火牆就只會詢問一次。

詳細設定說明請參考 [RUNNING_GUIDE.md](RUNNING_GUIDE.md)。
