package middleware

import (
	"net/http"
)

// CORS 添加跨域資源共享標頭
func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 設置允許的域
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// 設置允許的方法
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		// 設置允許的標頭
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// 處理預檢請求
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// 調用下一個處理器
		next.ServeHTTP(w, r)
	})
}
