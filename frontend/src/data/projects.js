import { BASE_URL, getProjectPath } from "./config";

export const projects = [
  {
    id: 1,
    name: "Download Effect",
    path: getProjectPath("projects/Effect-Download/index.html"),
    icon: "↓",
    description:
      "A circular progress bar with pause, resume, and cancel functionality.",
    reference: `${BASE_URL}/Effect-Download/index.html`,
  },
  {
    id: 2,
    name: "Ripple Effect",
    path: getProjectPath("projects/Effect-Ripple/index.html"),
    icon: "💧",
    description: "A ripple animation that generates three waves with delays.",
    reference: `${BASE_URL}/Effect-Ripple/index.html`,
  },
  {
    id: 3,
    name: "熊熊與貝兒",
    path: "teddy-belle",
    icon: "🧸",
    description: "與可愛的玩偶熊熊和貝兒互動的有趣頁面。",
    isReactComponent: true,
  },
  {
    id: 4,
    name: "Visual Map",
    path: getProjectPath("projects/Visual Map/index.html"),
    icon: "🗺️",
    description: "互動式資料視覺化地圖展示。",
    reference: `${BASE_URL}/Visual Map/index.html`,
  },
  {
    id: 5,
    name: "密碼安全檢查",
    path: getProjectPath("projects/Password-Check/index.html"),
    icon: "🔐",
    description: "檢查密碼是否外洩並分析密碼強度的工具。",
    reference: `${BASE_URL}/Password-Check/index.html`,
  },
];
