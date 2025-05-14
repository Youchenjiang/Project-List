# 安全改進：避免在前端暴露 API 金鑰

## 問題與解決方案

在代碼審查中發現了一個安全問題：OpenAI API 金鑰直接暴露在前端代碼中。這可能會導致濫用和未經授權的 API 使用。

這個 PR 通過以下方式解決了這個問題：

1. **後端代理實現**：
   - 建立了一個 Go 後端 API 代理端點 `/api/openai/chat`
   - 將 API 金鑰從前端移至後端，以保護它免受未經授權的訪問
   - 添加了適當的錯誤處理和 CORS 設置

2. **前端服務重構**：
   - 更新了 `openai.js` 服務，使用後端代理而非直接調用 OpenAI API
   - 添加了更好的錯誤處理和用戶反饋

3. **共享 API 金鑰配置**：
   - 配置後端以使用共享 API 金鑰，使所有開發人員能夠無縫協作
   - 可選擇通過 `.env` 文件設置自己的 API 金鑰

4. **用戶體驗改進**：
   - 添加了 API 狀態指示器，以提高透明度
   - 改進了錯誤處理和備用機制

5. **文檔與指南**：
   - 添加了 SETUP.md 以說明如何啟動和測試系統
   - 更新了後端 README.md 以解釋 API 代理設置

## 相關文件變更

- `backend/main.go`：添加了 OpenAI API 代理功能
- `backend/.env.example`：添加了環境變數模板
- `frontend/src/services/openai.js`：更新為使用後端代理
- `frontend/src/components/TeddyBelleInteraction.js`：添加了 API 狀態指示器
- `frontend/src/styles/teddyBelle.css`：添加了 API 狀態樣式
- `SETUP.md`：添加了系統啟動和測試指南

## 安全最佳實踐

此 PR 符合以下安全最佳實踐：

- 敏感密鑰不再暴露在前端代碼中
- 使用環境變數來設置敏感資訊
- 使用後端代理來處理敏感操作
- 提供適當的錯誤處理和備用方案

## 測試說明

已進行測試以確保：

1. 使用共享 API 金鑰能夠正常工作
2. API 錯誤處理正常運作
3. UI 顯示正確的 API 狀態
