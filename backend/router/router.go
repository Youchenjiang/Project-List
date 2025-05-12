package router

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path"

	"project-manager/config"
	"project-manager/services"

	httpSwagger "github.com/swaggo/http-swagger"
)

// Router 處理HTTP路由
type Router struct {
	Mux        *http.ServeMux
	OpenAIServ *services.OpenAIService
	Projects   []Project
}

// Project 定義項目結構
type Project struct {
	ID   int
	Name string
}

// NewRouter 創建新的路由器
func NewRouter(cfg *config.Config) *Router {
	openaiService := services.NewOpenAIService(cfg.OpenAIAPIKey, cfg.OpenAIBaseURL)

	return &Router{
		Mux:        http.NewServeMux(),
		OpenAIServ: openaiService,
		Projects: []Project{
			{ID: 1, Name: "Effect-Download"},
			{ID: 2, Name: "Effect-Ripple"},
		},
	}
}

// Setup 設置所有路由
func (r *Router) Setup() {
	// 根路由
	r.Mux.HandleFunc("/", r.handleHome)

	// API 測試端點
	r.Mux.HandleFunc("/api/test", r.handleAPITest)

	// OpenAI API 代理
	r.Mux.HandleFunc("/api/openai/chat", r.OpenAIServ.HandleChatRequest)

	// Swagger 文檔
	r.Mux.HandleFunc("/swagger/", httpSwagger.WrapHandler)

	// API 測試頁面
	r.Mux.HandleFunc("/test", r.handleTestPage)

	// 靜態文件
	r.Mux.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("public"))))

	// 設置項目相關路由
	r.setupProjectRoutes()

	// 設置項目 API 路由
	r.Mux.HandleFunc("/api/projects", r.handleGetProjects)
}

// 主頁處理
// @Summary 主頁
// @Description 返回 API 歡迎訊息
// @Tags general
// @Accept  json
// @Produce  json
// @Success 200 {object} map[string]string
// @Router / [get]
func (r *Router) handleHome(w http.ResponseWriter, req *http.Request) {
	if req.URL.Path != "/" {
		http.NotFound(w, req)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	resp := map[string]string{
		"status":  "ok",
		"message": "Welcome to Project Management System",
	}
	json.NewEncoder(w).Encode(resp)
}

// API 測試處理
// @Summary API 測試端點
// @Description 測試 API 是否正常運作
// @Tags general
// @Accept  json
// @Produce  json
// @Success 200 {object} map[string]string
// @Router /api/test [get]
func (r *Router) handleAPITest(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	resp := map[string]string{
		"status":  "ok",
		"message": "API 測試成功",
	}
	json.NewEncoder(w).Encode(resp)
}

// API 測試頁面處理
// @Summary API 測試頁面
// @Description 返回 API 測試頁面 HTML
// @Tags general
// @Accept  html
// @Produce  html
// @Success 200 {string} string "HTML 頁面"
// @Router /test [get]
func (r *Router) handleTestPage(w http.ResponseWriter, req *http.Request) {
	http.ServeFile(w, req, "public/test.html")
}

// 獲取項目列表
// @Summary 獲取所有項目
// @Description 返回系統中所有可用項目的列表
// @Tags projects
// @Accept  json
// @Produce  json
// @Success 200 {array} Project
// @Router /api/projects [get]
func (r *Router) handleGetProjects(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(r.Projects)
}

// 設置項目相關路由
func (r *Router) setupProjectRoutes() {
	for _, project := range r.Projects {
		proj := project // 創建副本避免閉包問題

		// 項目主頁
		r.Mux.HandleFunc("/"+proj.Name+"/", func(w http.ResponseWriter, req *http.Request) {
			if req.URL.Path != "/"+proj.Name+"/" {
				http.NotFound(w, req)
				return
			}
			fmt.Fprintf(w, "Project: %s", proj.Name)
		})

		// 項目靜態資源
		staticPath := path.Join("frontend", "public", "projects", proj.Name)
		r.Mux.Handle(
			"/"+proj.Name+"/static/",
			http.StripPrefix("/"+proj.Name+"/static/", http.FileServer(http.Dir(staticPath))),
		)
	}
}
