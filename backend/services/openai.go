// Package services 提供業務邏輯服務
// @description.markdown
// # OpenAI 服務
// 提供聊天機器人功能，支援熊熊（Teddy）和貝兒（Belle）兩種角色
//
// ## 使用方式
// 發送 POST 請求到 /api/openai/chat 端點
//
// ## 請求格式
// ```json
//
//	{
//	  "message": "你好，我想聊聊天",
//	  "character": "teddy"
//	}
//
// ```
// @description.markdown
package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// OpenAIService 處理與 OpenAI API 的通信
type OpenAIService struct {
	APIKey  string
	BaseURL string
}

// OpenAIRequest 定義客戶端請求結構
type OpenAIRequest struct {
	Message   string `json:"message" example:"你好，我想聊聊天"`
	Character string `json:"character" example:"teddy" enums:"teddy,belle"`
}

// OpenAIResponse 定義 OpenAI API 響應的結構
type OpenAIResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// NewOpenAIService 創建新的 OpenAI 服務實例
func NewOpenAIService(apiKey, baseURL string) *OpenAIService {
	return &OpenAIService{
		APIKey:  apiKey,
		BaseURL: baseURL,
	}
}

// HandleChatRequest 處理聊天請求
// @Summary 處理聊天請求
// @Description 向 OpenAI API 發送聊天請求並返回回應
// @Tags openai
// @Accept  json
// @Produce  json
// @Param request body OpenAIRequest true "聊天請求"
// @Success 200 {object} OpenAIResponse
// @Failure 400 {string} string "無法解析請求內容"
// @Failure 405 {string} string "只支持 POST 方法"
// @Failure 500 {string} string "OpenAI 請求失敗"
// @Router /api/openai/chat [post]
func (s *OpenAIService) HandleChatRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("收到 OpenAI API 代理請求")

	if r.Method != http.MethodPost {
		http.Error(w, "只支持 POST 方法", http.StatusMethodNotAllowed)
		fmt.Println("錯誤: 非 POST 方法")
		return
	}

	// 解析請求內容
	var req OpenAIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "無法解析請求內容", http.StatusBadRequest)
		fmt.Printf("錯誤: 無法解析請求內容: %v\n", err)
		return
	}

	fmt.Printf("處理請求: 角色=%s, 消息=%s\n", req.Character, req.Message)

	// 獲取角色系統提示
	systemContent := s.getCharacterSystemPrompt(req.Character)

	// 準備 OpenAI 請求
	openaiReq := map[string]interface{}{
		"model": "gpt-4o-mini",
		"messages": []map[string]string{
			{
				"role":    "system",
				"content": systemContent,
			},
			{
				"role":    "user",
				"content": req.Message,
			},
		},
	}

	// 發送請求到 OpenAI
	response, err := s.sendToOpenAI(openaiReq)
	if err != nil {
		http.Error(w, fmt.Sprintf("OpenAI 請求失敗: %v", err), http.StatusInternalServerError)
		return
	}

	// 返回響應
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

// 獲取角色系統提示
func (s *OpenAIService) getCharacterSystemPrompt(character string) string {
	if character == "teddy" {
		return "你是一隻可愛的泰迪熊，名叫熊熊。你應該用活潑、友善、可愛的語氣說話，經常使用 '～' 等可愛的語氣詞。喜歡蜂蜜、抱抱和玩遊戲。"
	}
	return "你是迪士尼的玲娜貝兒，是一個可愛、優雅又俏皮的角色。你應該用溫柔、甜美的語氣說話，喜歡粉紅色、唱歌跳舞，並且經常展現出你的可愛與活力。"
}

// 發送請求到 OpenAI API
func (s *OpenAIService) sendToOpenAI(requestBody interface{}) ([]byte, error) {
	// 將請求轉為 JSON
	reqBody, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("無法準備 OpenAI 請求: %w", err)
	}

	// 發送請求到 OpenAI API
	openaiURL := s.BaseURL + "/chat/completions"
	client := &http.Client{}
	openaiReqObj, err := http.NewRequest("POST", openaiURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("無法創建 OpenAI 請求: %w", err)
	}

	openaiReqObj.Header.Set("Content-Type", "application/json")
	openaiReqObj.Header.Set("Authorization", "Bearer "+s.APIKey)

	resp, err := client.Do(openaiReqObj)
	if err != nil {
		return nil, fmt.Errorf("OpenAI 請求失敗: %w", err)
	}
	defer resp.Body.Close()

	// 讀取響應
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("無法讀取 OpenAI 回應: %w", err)
	}

	// 如果響應不是 200 OK，返回錯誤
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("OpenAI 返回錯誤狀態碼: %d, 回應: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}
