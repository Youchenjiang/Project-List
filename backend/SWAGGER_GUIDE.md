# Swagger API 文檔指南

本文檔提供如何在此專案中新增 API 端點並將其整合到 Swagger 文檔中的完整指南。

## 第一步：設計 API 端點

首先，決定您的 API 端點的路徑、HTTP 方法、請求參數和響應格式。例如：

- 路徑：`/api/projects/{id}`
- 方法：GET
- 功能：根據 ID 獲取特定專案
- 響應：專案詳細資訊

## 第二步：在路由處理器中新增 API 函數

在 `router/router.go` 文件中新增處理此 API 的函數，並添加 Swagger 註解：

```go
// GetProjectByID 根據 ID 獲取特定專案
// @Summary 獲取特定專案
// @Description 根據 ID 獲取單個專案的詳細資訊
// @Tags projects
// @Accept json
// @Produce json
// @Param id path int true "專案 ID"
// @Success 200 {object} Project
// @Failure 404 {object} map[string]string "專案不存在"
// @Router /api/projects/{id} [get]
func (r *Router) handleGetProjectByID(w http.ResponseWriter, req *http.Request) {
    // 從 URL 解析 ID
    parts := strings.Split(req.URL.Path, "/")
    if len(parts) < 4 {
        http.Error(w, "無效的 URL", http.StatusBadRequest)
        return
    }
    
    idStr := parts[3]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "無效的 ID 格式", http.StatusBadRequest)
        return
    }
    
    // 查找專案
    var foundProject *Project
    for _, project := range r.Projects {
        if project.ID == id {
            foundProject = &project
            break
        }
    }
    
    // 檢查是否找到專案
    if foundProject == nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusNotFound)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "專案不存在",
        })
        return
    }
    
    // 返回專案資訊
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(foundProject)
}
```

## 第三步：在路由設定中註冊新的 API 端點

在 `router.Setup()` 方法中註冊新的路由：

```go
// Setup 設置所有路由
func (r *Router) Setup() {
    // ...existing code...
    
    // 項目 API
    r.Mux.HandleFunc("/api/projects", r.handleGetProjects)
    r.Mux.HandleFunc("/api/projects/{id}", r.handleGetProjectByID) // 新增的路由
    
    // ...existing code...
}
```

## 第四步：生成 Swagger 文檔

執行 `swag init` 命令以生成新的 Swagger 文檔：

```powershell
cd backend
$env:PATH += ";$home\go\bin"
swag init
```

這會自動更新 `docs/swagger.json`、`docs/swagger.yaml` 和 `docs/docs.go` 文件。

## 第五步：重新啟動服務器

執行以下命令重新啟動服務器：

```powershell
cd backend
$env:SERVER_PORT="8083"  # 根據需要設置端口
go run main.go
```

## 第六步：在 Swagger UI 中測試新的 API

訪問 Swagger UI 頁面：<http://localhost:8083/swagger/index.html>

您應該能看到新增的 API 端點，並且可以直接在 Swagger UI 中測試它。

## 關於 Swagger 註解的說明

Swagger 註解支援多種標籤，以下是常用的一些：

- `@Summary`：API 端點的簡短摘要
- `@Description`：API 端點的詳細描述
- `@Tags`：API 的分類標籤，用於在 Swagger UI 中組織 API
- `@Accept`：支援的請求內容類型（如 `json`、`xml`）
- `@Produce`：支援的響應內容類型
- `@Param`：請求參數，格式為 `名稱 位置 類型 是否必須 描述`
  - 位置可以是：`path`、`query`、`header`、`body`、`formData`
- `@Success`：成功響應的定義，格式為 `狀態碼 {類型} 模型名稱`
- `@Failure`：失敗響應的定義
- `@Router`：API 的路徑和 HTTP 方法

## 範例：添加一個 POST API 端點

以下是如何添加一個創建專案的 POST API 端點的範例：

```go
// CreateProject 創建新專案
// @Summary 創建專案
// @Description 創建一個新的專案
// @Tags projects
// @Accept json
// @Produce json
// @Param project body Project true "專案資訊"
// @Success 201 {object} Project
// @Failure 400 {object} map[string]string "無效的請求數據"
// @Router /api/projects [post]
func (r *Router) handleCreateProject(w http.ResponseWriter, req *http.Request) {
    if req.Method != http.MethodPost {
        http.Error(w, "只支持 POST 方法", http.StatusMethodNotAllowed)
        return
    }
    
    // 解析請求體
    var newProject Project
    if err := json.NewDecoder(req.Body).Decode(&newProject); err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "無法解析請求數據",
        })
        return
    }
    
    // 生成新 ID
    maxID := 0
    for _, project := range r.Projects {
        if project.ID > maxID {
            maxID = project.ID
        }
    }
    newProject.ID = maxID + 1
    
    // 添加到項目列表
    r.Projects = append(r.Projects, newProject)
    
    // 返回新創建的項目
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(newProject)
}
```

然後在路由設定中註冊這個端點，更新 `router.Setup()` 方法：

```go
func (r *Router) Setup() {
    // ...existing code...
    
    // 項目 API 路由
    r.Mux.HandleFunc("/api/projects", func(w http.ResponseWriter, req *http.Request) {
        if req.Method == http.MethodGet {
            r.handleGetProjects(w, req)
        } else if req.Method == http.MethodPost {
            r.handleCreateProject(w, req)
        } else {
            http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
        }
    })
    
    r.Mux.HandleFunc("/api/projects/", r.handleGetProjectByID)
    
    // ...existing code...
}
```

## 常見問題與解決方案

1. **URL 不匹配**：確保 Swagger 註解中的 `@Router` 路徑與實際註冊的路由路徑一致。

2. **主機配置錯誤**：最好在運行時動態設置 Swagger 的主機：

   ```go
   docs.SwaggerInfo.Host = "localhost:" + cfg.ServerPort
   ```

3. **定義不一致**：確保 Swagger 註解中引用的結構體（如 `Project`）已被正確定義。

4. **找不到 swag 命令**：確保 `swag` 命令已正確安裝並添加到 PATH 中：

   ```powershell
   go install github.com/swaggo/swag/cmd/swag@latest
   $env:PATH += ";$home\go\bin"
   ```

5. **Swagger 文檔未更新**：有時需要清除快取，可以嘗試刷新瀏覽器或使用無痕模式。

## 最佳實踐

1. **分組 API**：使用相同的 `@Tags` 值來組織相關的 API 端點。

2. **詳細的描述**：提供清晰的 `@Summary` 和 `@Description`，幫助使用者理解 API 的用途。

3. **參數驗證**：在 Swagger 註解中指明參數約束，如 `minlength`、`maxlength` 等。

4. **請求與響應範例**：使用 `example` 標籤提供範例，如 `example:"張三"`。

5. **HTTP 狀態碼**：為各種情況提供正確的 HTTP 狀態碼和對應的響應模型。
