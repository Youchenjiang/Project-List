# 專案清理與維護指南

## 清理說明

為了保持專案的整潔和易於維護，我們進行了以下清理工作：

### 1. 移除未使用的 WebAssembly 相關檔案

專案最初可能計劃使用 WebAssembly，但目前並未實際使用。我們已經：

- 移除了 `frontend/public/backend.wasm` 和 `frontend/public/wasm_exec.js` 文件
- 移除了 `frontend/src/services/openai.js` 中未使用的 WebAssembly 相關程式碼
- 清理了空的 `backend/cmd/wasm` 目錄

### 2. 整合重複的防火牆文件

之前有多個關於 Windows 防火牆設定的文件，內容重複且分散。我們已經：

- 創建了一個統一的 `backend/RUNNING_GUIDE.md` 文件，包含完整的執行與防火牆設定指南
- 移除了多餘的 `FIREWALL_GUIDE.md`、`BACKEND_RUNNING_GUIDE.md` 和 `WINDOWS_FIREWALL.md`
- 更新了 `backend/README.md` 中的參考連結

### 3. 添加 .gitignore 文件

添加了適當的 `.gitignore` 文件，排除：

- 編譯生成的 `backend.exe` 文件
- WebAssembly 相關文件
- Node.js 依賴目錄
- 各種臨時文件和作業系統特定文件

## 專案結構優化

清理後的專案結構更加精簡明確：

```text
Project-List/
├── .gitignore                # 新增的 git 忽略文件
├── README.md                 # 主要文件
├── README_zh.md              # 中文版文件
├── cleanup.ps1               # 清理腳本
├── backend/                  # 後端服務
│   ├── ARCHITECTURE.md       # 架構說明
│   ├── README.md             # 後端說明文件 (已更新)
│   ├── RUNNING_GUIDE.md      # 整合後的執行指南
│   ├── SWAGGER_GUIDE.md      # Swagger API 指南
│   ├── main.go               # 主程式
│   ├── run.bat               # 命令提示字元啟動腳本
│   ├── run.ps1               # PowerShell 啟動腳本
│   ├── config/               # 配置目錄
│   ├── docs/                 # Swagger 文件
│   ├── middleware/           # 中間件
│   ├── public/               # 公開資源
│   ├── router/               # 路由處理
│   └── services/             # 服務層
└── frontend/                 # 前端應用 (已移除未使用的 wasm 文件)
```

## 如何執行清理

如果您已經拉取了這個版本的代碼，不需要額外操作。如果您有較舊版本的代碼，可以運行清理腳本：

```powershell
# 在專案根目錄執行
.\cleanup.ps1
```

## 後續維護建議

1. **持續審查代碼**：定期檢查是否有未使用的代碼或文件
2. **統一文件風格**：避免創建多個具有類似功能的文件
3. **更新 .gitignore**：當有新的生成文件或臨時文件時，應及時更新
4. **保持結構清晰**：遵循已有的目錄結構，避免創建不必要的子目錄
