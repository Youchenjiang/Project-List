package config

import (
	"os"
)

// Config 應用配置
type Config struct {
	OpenAIAPIKey  string
	OpenAIBaseURL string
	ServerPort    string
}

// LoadConfig 從環境變數加載配置
func LoadConfig() *Config {
	// 設置默認值
	config := &Config{
		OpenAIAPIKey:  "請在 .env 文件或環境變量中設置您的 API_KEY",
		OpenAIBaseURL: "https://api.chatanywhere.tech/v1",
		ServerPort:    "8080",
	}

	// 從環境變數覆蓋，如果有設置
	if apiKey := os.Getenv("OPENAI_API_KEY"); apiKey != "" {
		config.OpenAIAPIKey = apiKey
	}

	if baseURL := os.Getenv("OPENAI_BASE_URL"); baseURL != "" {
		config.OpenAIBaseURL = baseURL
	}

	if port := os.Getenv("SERVER_PORT"); port != "" {
		config.ServerPort = port
	}

	return config
}
