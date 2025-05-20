package config

import (
	"os"
)

// Config 應用配置
type Config struct {
	OpenAIAPIKey   string
	OpenAIBaseURL  string
	ServerPort     string
	AllowedOrigins []string
}

// LoadConfig 從環境變數加載配置
func LoadConfig() *Config {
	// 設置默認值
	config := &Config{
		OpenAIAPIKey:   "",
		OpenAIBaseURL:  "https://api.chatanywhere.tech/v1",
		ServerPort:     "8080",
		AllowedOrigins: []string{"http://localhost:3000", "http://localhost:8080"},
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

	if origins := os.Getenv("ALLOWED_ORIGINS"); origins != "" {
		config.AllowedOrigins = strings.Split(origins, ",")
	}

	return config
}
