# 重構後的後端架構

## 目錄結構

```text
backend/
├── config/           # 配置管理
│   └── config.go     # 從環境變數加載配置
├── docs/             # Swagger 自動生成的 API 文檔
│   ├── docs.go       # Go 程式碼形式的 API 文檔
│   ├── swagger.json  # JSON 格式的 API 文檔
│   └── swagger.yaml  # YAML 格式的 API 文檔
├── middleware/       # HTTP 中間件
│   └── cors.go       # CORS 支持中間件
├── public/           # 靜態資源
│   └── test.html     # API 測試頁面
├── router/           # 路由處理
│   └── router.go     # 設置和管理 HTTP 路由
├── services/         # 業務邏輯
│   └── openai.go     # OpenAI API 集成
├── go.mod            # Go 模塊定義
├── main.go           # 應用入口點
└── README.md         # 文檔
```

## 模塊說明

1. **config**: 管理應用程式配置，從環境變數或默認值加載設置
2. **docs**: 自動生成的 Swagger API 文檔
3. **middleware**: 定義 HTTP 中間件，如 CORS 支持
4. **public**: 提供靜態資源，如 API 測試頁面
5. **router**: 處理 HTTP 路由和請求分發
6. **services**: 實現業務邏輯，包括 OpenAI API 集成

## 如何運行

運行方式與之前相同：

```bash
go run main.go
```

## API 文檔與測試

啟動服務器後，可以通過以下 URL 訪問 Swagger API 文檔：

```txt
http://localhost:8080/swagger/index.html
```

Swagger UI 提供了一個交互式界面，使您可以：

1. 瀏覽所有可用的 API 端點
2. 查看每個端點的詳細文檔
3. 直接從瀏覽器測試 API 調用

此外，我們還提供了一個簡易的 API 測試頁面，可通過以下 URL 訪問：

```txt
http://localhost:8080/test
```

這個頁面提供了更加用戶友好的界面，專門用於測試聊天 API 和其他端點。

## 使用自定義配置

設置環境變數來自定義配置：

```powershell
$env:OPENAI_API_KEY="your_api_key"
$env:OPENAI_BASE_URL="https://api.openai.com/v1"
$env:SERVER_PORT="8000"
go run main.go
```

## 優勢

1. **模塊化**: 代碼已組織成邏輯模塊，更容易維護
2. **可測試性**: 各個組件可以獨立測試
3. **可擴展性**: 可以輕鬆添加新功能或修改現有功能
4. **關注點分離**: 每個模塊專注於特定功能
5. **API 文檔**: 使用 Swagger 自動生成 API 文檔，方便開發和測試
