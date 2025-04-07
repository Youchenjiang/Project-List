// 使用 PUBLIC_URL 環境變數來適應不同的部署環境
// 修改為GitHub Pages的URL而不是倉庫URL
export const BASE_URL = window.location.hostname === 'localhost' 
  ? "/projects" 
  : "https://youchenjiang.github.io/Project-List/projects";

// 獲取應用的基礎 URL 路徑
// 在GitHub Pages環境中，PUBLIC_URL應該是/Project-List
export const PUBLIC_PATH = process.env.PUBLIC_URL || '';
// 手動設置GitHub Pages的基礎路徑，以防環境變數不可用
export const GITHUB_PAGES_BASE = '/Project-List';

// 獲取項目的基礎路徑，用於正確解析項目路徑
export const getProjectPath = (path) => {
  // 處理路徑
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // 在開發環境中使用完整URL（包含域名和端口），並添加/Project-List前綴
  if (window.location.hostname === 'localhost') {
    const localCompleteUrl = window.location.origin + GITHUB_PAGES_BASE + '/' + cleanPath;
    return localCompleteUrl; // 返回完整URL，包含域名、端口和/Project-List前綴
  }
  
  // 在生產環境（GitHub Pages）中添加基礎路徑
  const fullPath = `${GITHUB_PAGES_BASE}/${cleanPath}`;
  
  return fullPath;
}