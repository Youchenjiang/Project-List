package main

import (
	"fmt"
	"log"
	"net/http"
)

// Project represents a project item
type Project struct {
	ID   int
	Name string
}

// Global projects slice
var projects = []Project{
	{ID: 1, Name: "Effect-Download"},
	{ID: 2, Name: "Effect-Ripple"},
}

func main() {
	mux := http.NewServeMux()

	// 根目錄處理
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Welcome to Project Management System")
	})

	// 動態處理所有專案路由
	for _, project := range projects {
		proj := project
		mux.HandleFunc("/"+proj.Name+"/", func(w http.ResponseWriter, r *http.Request) {
			if r.URL.Path != "/"+proj.Name+"/" {
				http.NotFound(w, r)
				return
			}
			fmt.Fprintf(w, "Project: %s", proj.Name)
		})

		// 靜態資源路由處理
		mux.Handle("/"+proj.Name+"/static/", http.StripPrefix("/"+proj.Name+"/static/", http.FileServer(http.Dir("frontend/public/projects/"+proj.Name))))
	}

	// 啟動服務器
	fmt.Println("Server is running on :8080...")
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
