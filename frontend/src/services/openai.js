// OpenAI API 服務 - 通過後端代理安全調用
// 後端地址根據開發或生產環境設置
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? window.location.origin
    : 'http://localhost:8080'; // 在開發環境中使用本地後端

console.log(`當前環境: ${process.env.NODE_ENV || '未設置'}`);
console.log(`使用 API 基礎 URL: ${API_BASE_URL}`);

// 創建 ChatGPT 回應
export const createChatResponse = async (message, character) => {
    try {
        console.log(`使用共享API金鑰通過後端代理發送請求...`);
        console.log(`請求數據:`, { message, character });
        
        // 使用 HTTP 後端
        console.log(`請求端點: ${API_BASE_URL}/api/openai/chat`);
        const response = await fetch(`${API_BASE_URL}/api/openai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                character
            })
        });

        if (!response.ok) {
            console.error(`API 回應狀態: ${response.status}`);
            throw new Error(`API 回應狀態: ${response.status}`);
        }

        const data = await response.json();
        
        console.log(`API 回應成功:`, data);
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API 錯誤詳情:', error);
        // 提供友好的錯誤回應
        return character === 'teddy' 
            ? '哎呀～發生了一點小問題，要不我們先玩個遊戲吧！' 
            : '唔...好像遇到了一些問題呢，不如我們先聊聊別的吧？';
    }
};

// 測試後端連接
export const testBackendConnection = async () => {
    try {
        console.log(`測試後端連接... ${API_BASE_URL}/api/test`);
        const response = await fetch(`${API_BASE_URL}/api/test`);
        
        if (!response.ok) {
            console.error(`測試 API 回應狀態: ${response.status}`);
            return { success: false, error: `狀態碼: ${response.status}` };
        }

        const data = await response.json();
        console.log(`測試 API 回應成功:`, data);
        return { success: true, data };
    } catch (error) {
        console.error('測試 API 錯誤詳情:', error);
        return { success: false, error: error.message };
    }
};
