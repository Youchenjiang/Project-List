// OpenAI API 服務
const API_KEY = "sk-Fs1TGwqvbBAaF0erqNBpubfEJESNYXc0OEEJGfdVtGEf9gJ1";
const BASE_URL = "https://api.chatanywhere.tech/v1";

// 創建 ChatGPT 回應
export const createChatResponse = async (message, character) => {
    try {
        const response = await fetch(`${BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        "role": "system",
                        "content": character === 'teddy' 
                            ? "你是一隻可愛的泰迪熊，名叫熊熊。你應該用活潑、友善、可愛的語氣說話，經常使用 '～' 等可愛的語氣詞。喜歡蜂蜜、抱抱和玩遊戲。"
                            : "你是迪士尼的玲娜貝兒，是一個可愛、優雅又俏皮的角色。你應該用溫柔、甜美的語氣說話，喜歡粉紅色、唱歌跳舞，並且經常展現出你的可愛與活力。"
                    },
                    { "role": "user", "content": message }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API 錯誤:', error);
        return character === 'teddy' 
            ? '哎呀～發生了一點小問題，要不我們先玩個遊戲吧！' 
            : '唔...好像遇到了一些問題呢，不如我們先聊聊別的吧？';
    }
};
