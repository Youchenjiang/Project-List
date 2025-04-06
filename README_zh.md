# 專案列表

<div style="text-align: center;">

[English](README.md) | [中文](README_zh.md)

</div>
一系列小型互動式專案集合，旨在幫助您學習和探索各種前端功能與技術。

## 目錄

- [專案列表](#專案列表)
  - [目錄](#目錄)
  - [目的](#目的)
  - [技術棧](#技術棧)
  - [專案結構](#專案結構)
  - [安裝與使用](#安裝與使用)
    - [系統需求](#系統需求)
    - [快速開始](#快速開始)
    - [前端設定](#前端設定)
    - [後端設定](#後端設定)
    - [全端開發](#全端開發)
    - [新增功能](#新增功能)
  - [專案與功能](#專案與功能)
    - [前端應用](#前端應用)
    - [後端服務](#後端服務)
    - [獨立專案](#獨立專案)
  - [開發指南](#開發指南)
    - [程式碼風格](#程式碼風格)
    - [提交規範](#提交規範)
  - [貢獻](#貢獻)
  - [授權](#授權)
  - [致謝](#致謝)

## 目的

本倉庫作為學習資源和靈感來源，供開發者嘗試前端開發概念。每個專案都是獨立的，展示特定功能或效果。關鍵設計原則是每個小專案都可以獨立執行，即使與主框架分離。

## 技術棧

- 前端框架: React.js
- 建構工具: Create React App
- 樣式: CSS模組/SCSS
- 專案管理: Git

## 專案結構

```text
Project-List/
├── frontend/              # 前端React應用
│   ├── node_modules/      # 依賴項
│   ├── public/            # 靜態檔案和資源
│   │   ├── assets/        # 靜態資源
│   │   │   ├── images/    # 圖片
│   │   │   └── icons/     # 圖示
│   │   ├── projects/      # 專案範例(每個可獨立執行)
│   │   │   ├── Effect-Download/
│   │   │   │   ├── index.html   # 獨立HTML檔案
│   │   │   │   └── styles.css  # 專案特定樣式
│   │   │   └── Effect-Ripple/
│   │   │       ├── index.html   # 獨立HTML檔案
│   │   │       └── styles.css  # 專案特定樣式
│   │   ├── index.html     # 主HTML檔案
│   │   ├── manifest.json  # PWA配置
│   │   └── robots.txt     # 搜尋引擎配置
│   ├── src/               # 原始碼
│   │   ├── components/    # 可複用UI元件
│   │   │   ├── Layout.js  # 佈局元件
│   │   │   ├── Sidebar.js # 側邊欄元件
│   │   │   └── ContentArea.js # 內容區域元件
│   │   ├── context/       # React狀態管理上下文
│   │   │   └── ProjectContext.js # 專案上下文提供者
│   │   ├── styles/        # 按元件組織的CSS樣式
│   │   │   ├── layout.css # 佈局樣式
│   │   │   ├── sidebar.css # 側邊欄樣式
│   │   │   ├── content.css # 內容區域樣式
│   │   │   └── index.css  # 匯入的樣式索引
│   │   ├── data/          # 資料檔案
│   │   │   └── projects.js # 專案資料
│   │   ├── App.js         # 主應用元件
│   │   ├── App.css        # 主樣式
│   │   ├── index.js       # 入口點
│   │   ├── index.css      # 全域樣式
│   │   └── reportWebVitals.js  # 效能監控
│   ├── package.json       # 專案依賴項
│   └── package-lock.json  # 依賴鎖檔案
├── backend/               # 後端服務
│   ├── go.mod             # Go模組依賴項
│   └── main.go            # 主Go伺服器檔案
└── .vscode/               # VS Code設定
```

## 安裝與使用

按照以下步驟設定和使用專案:

### 系統需求

- Node.js (v16.0.0或更高版本)
- npm (v8.0.0或更高版本)
- Go (v1.21或更高版本) - 用於後端開發

### 快速開始

1. **複製倉庫**

   ```bash
   git clone https://github.com/Youchenjiang/Project-List.git
   cd Project-List
   ```

2. **安裝依賴並啟動應用**

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **探索功能**
   - 應用將在`http://localhost:3000`可用
   - 功能在導覽選單中組織
   - 點擊您想探索的功能

4. **查看原始碼**
   - 所有功能都在React元件中實現
   - 原始碼位於`frontend/src`目錄
   - 您可以直接查看和修改程式碼

5. **獨立執行單個專案**
   - `frontend/public/projects/`中的每個專案都可以獨立執行
   - 直接在瀏覽器中開啟任何專案的`index.html`檔案
   - 不需要React框架或後端來執行單個專案

### 前端設定

1. **導覽到前端目錄**

   ```bash
   cd frontend
   ```

2. **安裝依賴項**

   ```bash
   npm install
   ```

3. **可用指令碼**

   - 啟動開發伺服器:

     ```bash
     npm start
     ```

   - 建構生產版本:

     ```bash
     npm run build
     ```

   - 執行測試:

     ```bash
     npm test
     ```

4. **開發環境**

   前端使用React建構，使用以下關鍵依賴項:
   - React v19.1.0
   - React Router v7.5.0
   - 用於單元和整合測試的測試庫

### 後端設定

1. **導覽到後端目錄**

   ```bash
   cd backend
   ```

2. **安裝Go依賴項**

   ```bash
   go mod download
   ```

   所需依賴項:
   - golang.org/x/net - 核心網路功能
   - github.com/gorilla/mux - HTTP路由器和調度器

3. **執行後端伺服器**

   ```bash
   go run main.go
   ```

4. **後端API**

   後端伺服器預設在`http://localhost:8080`啟動，並提供以下端點:
   - `/` - 主應用端點
   - `/{project-name}/` - 單個專案端點

5. **關於後端的重要說明**

   雖然後端提供了瀏覽所有專案的便捷方式，但**執行單個專案不需要它**。`frontend/public/projects/`目錄中的每個專案設計為只需在瀏覽器中開啟其HTML檔案即可獨立執行。

### 全端開發

1. **啟動兩個伺服器**

   您需要同時執行前端和後端伺服器以獲得完整功能:

   終端1:

   ```bash
   cd frontend
   npm start
   ```

   終端2:

   ```bash
   cd backend
   go run main.go
   ```

2. **開發工作流程**

   - 前端變更將在瀏覽器中自動重新載入
   - 後端變更需要重啟伺服器
   - 使用Git進行版本控制，遵循提交規範

### 新增功能

1. **建立新效果或元件**

   - 在`frontend/public/projects/`中為新靜態資源建立新目錄
   - 在`frontend/src/components/`中建立新元件
   - 在`frontend/src/styles/`目錄中新增相應樣式
     - 遵循命名慣例: `componentName.css`
     - 如果需要，在`styles/index.css`中匯入您的樣式
   - 如果需要，更新`frontend/src/context/ProjectContext.js`中的上下文
     - 使用`useProject`鉤子在元件中存取專案資料
   - 更新主App.js以包含您的新元件或更新Layout元件

2. **測試您的變更**

   - 在同一目錄中編寫元件測試，使用`.test.js`後綴
   - 使用`npm test`執行測試
   - 在提交變更前確保所有現有測試通過

3. **文件**

   - 更新此README.md檔案，新增關於新功能的資訊
   - 包含解釋複雜邏輯的程式碼註釋
   - 如果適用，考慮新增示範或截圖

## 專案與功能

本倉庫包含以下專案和功能:

### 前端應用

基於React的應用，展示現代前端開發實踐，具有以下功能:

- 互動式使用者介面
- 現代React開發工作流程
- 清晰的程式碼組織
- 效能優化

### 後端服務

基於Go的後端服務，補充前端應用，具有以下功能:

- RESTful API端點
- 高效資料處理
- 安全認證
- 可擴展架構

### 獨立專案

`frontend/public/projects/`目錄中的每個專案設計為完全獨立:

- **獨立的HTML/CSS/JS**: 每個專案包含執行所需的所有檔案
- **無外部依賴**: 專案不依賴React框架或後端
- **直接執行**: 只需在瀏覽器中開啟任何專案的`index.html`檔案即可查看效果
- **自包含程式碼**: 效果或功能所需的所有程式碼都包含在專案資料夾中
- **易於提取**: 專案可以複製到任何位置，仍能正常執行

## 開發指南

### 程式碼風格

1. 使用帶鉤子的函式元件
2. 遵循React最佳實踐
3. 使用CSS模組進行樣式設計
4. 實現適當的錯誤處理
5. 編寫乾淨且可維護的程式碼

### 提交規範

1. 使用常規提交格式
2. 保持提交訊息清晰簡潔
3. 將相關變更分組在一起
4. 提交前測試變更

## 貢獻

我們歡迎貢獻！貢獻方式:

1. Fork此倉庫
2. 建立新分支:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. 進行變更並提交:

   ```bash
   git commit -m "feat: 您的描述性提交訊息"
   ```

4. 推送到您的分支:

   ```bash
   git push origin feature/your-feature-name
   ```

5. 開啟拉取請求

## 授權

本倉庫根據MIT授權條款授權。您可以自由使用和修改程式碼。

## 致謝

我要感謝以下工具和平台對本專案的貢獻:

- **[Trae AI](https://trae.ai) & [Windsurf](https://windsurf.com/)**: 提供智慧編碼輔助和開發支援
- **[VS Code](https://code.visualstudio.com)**: 提供強大靈活的開發環境
- **[GitHub Copilot](https://github.com/features/copilot)**: 透過AI驅動的程式碼建議提高生產力
- **[Rider](https://www.jetbrains.com/rider/)**: 提供出色的IDE功能和除錯能力
