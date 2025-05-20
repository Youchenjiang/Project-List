// @title Project Manager API
// @version 1.0
// @description 專案管理後端 API，包含 OpenAI 聊天代理、專案管理功能等
// @termsOfService http://localhost:8080/terms/

// @contact.name API Support
// @contact.url http://localhost:8080/support
// @contact.email support@project-manager.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /
// @schemes http https

package main

import (
	"fmt"
	"log"
	"net/http"

	"project-manager/config"
	"project-manager/docs"
	"project-manager/middleware"
	"project-manager/router"
)

func main() {
	// 加載配置
	cfg := config.LoadConfig()
	// 設置 Swagger 信息
	docs.SwaggerInfo.Title = "Project Manager API"
	docs.SwaggerInfo.Description = "專案管理後端 API，包含 OpenAI 聊天代理"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "127.0.0.1:" + cfg.ServerPort
	docs.SwaggerInfo.BasePath = "/"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	// 創建路由器並設置路由
	r := router.NewRouter(cfg)
	r.Setup()

	// 應用 CORS 中間件
	handler := middleware.CORS(cfg)(r.Mux)
	// 啟動服務器
	serverAddr := "127.0.0.1:" + cfg.ServerPort // 明確綁定到 localhost IP
	fmt.Println("開啟 CORS 支持...")
	fmt.Println("Server is running on", serverAddr)
	fmt.Println("API 端點: /api/openai/chat")
	fmt.Println("API 金鑰已加載")

	err := http.ListenAndServe(serverAddr, handler)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
