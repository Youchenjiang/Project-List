// TeddyBelleInteraction.js
// 熊熊與貝兒互動頁面元件
// 功能：提供與熊熊和玲娜貝兒的互動體驗，包含對話、動作和表情變化

import React, { useState, useEffect } from 'react';
import '../styles/teddyBelle.css';
import '../styles/characterSvg.css';
import '../styles/characterAnimations.css';
import { PUBLIC_PATH, GITHUB_PAGES_BASE } from '../data/config';
import { createChatResponse } from '../services/openai';

const TeddyBelleInteraction = () => {
    // 狀態管理
    const [activeCharacter, setActiveCharacter] = useState('teddy'); // 'teddy' 或 'belle'
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [mood, setMood] = useState('happy'); // 'happy', 'sad', 'excited'
    
    // 預設回應選項 - 作為 API 備用方案
    const defaultResponses = {
        teddy: [
            '啊～真是太有趣了！我們繼續玩吧！',
            '我最喜歡和你聊天了～',
            '要不要一起去找蜂蜜吃呢？',
            '你說得對！熊熊也是這樣想的！',
            '嘿嘿，這讓我想起一個好玩的故事...',
            '我們一起去森林探險好不好？',
            '你真是我最好的朋友了！',
            '這個主意太棒了！熊熊超喜歡的～',
            '讓我們一起玩個遊戲吧！',
            '你知道嗎？今天的陽光特別溫暖～'
        ],
        belle: [
            '啊啦，這真是太有趣了！',
            '讓我想到了一個美麗的故事呢...',
            '要不要聽聽我的小秘密？',
            '我最喜歡和你這樣聊天了！',
            '這個想法真棒，我們一起來實現吧！',
            '好浪漫啊～讓我想到花園裡的玫瑰',
            '你說得對！這就像魔法一樣美妙！',
            '我們來跳個舞慶祝一下吧！',
            '今天的你特別閃耀呢！',
            '要不要一起去探索夢幻世界？'
        ]
    };

    // 圖片基礎路徑設定
    const imgBasePath = window.location.hostname === 'localhost' 
        ? `${GITHUB_PAGES_BASE}/assets/images/` 
        : `${PUBLIC_PATH}/assets/images/`;

    // 取得隨機回應
    const getRandomResponse = (character) => {
        const responses = defaultResponses[character];
        const randomIndex = Math.floor(Math.random() * responses.length);
        // 加入延遲，模擬思考時間
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(responses[randomIndex]);
            }, Math.random() * 1000 + 500); // 500-1500ms 的隨機延遲
        });
    };

    // 處理訊息發送
    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        // 添加用戶訊息
        const userMessage = { sender: 'user', text: message };
        setConversation(prev => [...prev, userMessage]);
        setMessage('');
        setIsTyping(true);

        try {
            let responseText;
            try {
                // 嘗試使用 OpenAI API 獲取回應
                responseText = await createChatResponse(message, activeCharacter);
            } catch (apiError) {
                // API 錯誤時，無縫切換到預設回應
                responseText = await getRandomResponse(activeCharacter);
            }

            // 處理回應
            setConversation(prev => [...prev, { 
                sender: activeCharacter, 
                text: responseText 
            }]);

            // 觸發動畫效果
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);

            // 根據回應內容設置心情
            if (responseText.includes('開心') || responseText.includes('高興') || 
                responseText.includes('有趣') || responseText.includes('喜歡')) {
                setMood('happy');
            } else if (responseText.includes('難過') || responseText.includes('抱歉')) {
                setMood('sad');
            } else if (responseText.includes('驚訝') || responseText.includes('太棒了')) {
                setMood('excited');
            }
        } catch (error) {
            // 如果所有嘗試都失敗，使用備用回應
            const fallbackResponse = await getRandomResponse(activeCharacter);
            setConversation(prev => [...prev, { 
                sender: activeCharacter, 
                text: fallbackResponse 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    // 處理按Enter發送
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    // 處理角色切換
    const switchCharacter = (character) => {
        setActiveCharacter(character);
        setMood('happy'); // 重置心情
        // 添加歡迎訊息
        const welcomeMessage = character === 'teddy' 
            ? '嗨！我是熊熊，很高興見到你！' 
            : '你好！我是玲娜貝兒，今天想一起玩耍嗎？';
        setConversation([{ sender: character, text: welcomeMessage }]);
    };    // 處理文字輸入改變
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };    /**
     * 處理互動動作
     * @param {string} action - 動作類型：'hug', 'play', 'feed', 'wave', 'nod'
     */    const handleAction = (action) => {
        setIsAnimating(true);
        
        let actionMessage;
        let animationClass = '';
        
        // 更新角色表情和動作
        switch(action) {
            case 'hug':
                setMood('happy');
                animationClass = 'hug-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊感到被愛和溫暖！' 
                    : '玲娜貝兒給了你一個溫暖的擁抱！';
                break;
            case 'play':
                setMood('excited');
                animationClass = 'play-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊開心地跳來跳去！' 
                    : '玲娜貝兒開心地轉圈圈！';
                break;
            case 'feed':
                setMood('happy');
                animationClass = 'feed-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊滿足地吃著蜂蜜！' 
                    : '玲娜貝兒開心地吃著棉花糖！';
                break;
            case 'wave':
                setMood('happy');
                animationClass = 'wave-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊向你揮手打招呼！' 
                    : '玲娜貝兒向你揮手打招呼！';
                break;
            case 'nod':
                setMood('happy');
                animationClass = 'nod-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊點頭表示同意！' 
                    : '玲娜貝兒點頭表示同意！';
                break;
            default:
                setMood('happy');
                actionMessage = '發生了有趣的事情！';
        }
        
        // 添加動畫類別到角色元素
        const characterElement = document.querySelector(activeCharacter === 'teddy' ? '.teddy-character' : '.belle-character');
        if (characterElement && animationClass) {
            characterElement.classList.add(animationClass);
            setTimeout(() => {
                characterElement.classList.remove(animationClass);
            }, 1400);
        }
        
        setConversation([...conversation, { sender: 'system', text: actionMessage }]);
        
        setTimeout(() => {
            setIsAnimating(false);
        }, 1500);
    };    // 初始化歡迎訊息
    useEffect(() => {
        const welcomeMessage = activeCharacter === 'teddy' 
            ? '嗨！我是熊熊，很高興見到你！' 
            : '你好！我是玲娜貝兒，今天想一起玩耍嗎？';
        
        setConversation([
            { sender: activeCharacter, text: welcomeMessage }
        ]);
    }, [activeCharacter]);

    return (
        <div className="teddy-belle-container">
            <div className="character-selection">
                <button 
                    className={`character-btn ${activeCharacter === 'teddy' ? 'active' : ''}`}
                    onClick={() => switchCharacter('teddy')}
                >
                    熊熊
                </button>
                <button 
                    className={`character-btn ${activeCharacter === 'belle' ? 'active' : ''}`}
                    onClick={() => switchCharacter('belle')}
                >
                    玲娜貝兒
                </button>
            </div>
            
            <div className="interaction-area">
                <div className={`character-display ${isAnimating ? 'animating' : ''}`}>
                    {activeCharacter === 'teddy' ? (
                        <div className={`teddy-character ${isAnimating ? 'animating' : ''}`}>
                            {/* 使用teddy.svg文件作為熊熊的圖像 */}
                            <img 
                                src={`${imgBasePath}teddy.svg`} 
                                alt="熊熊" 
                                className="character-svg"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    ) : (
                        <div className={`belle-character ${isAnimating ? 'animating' : ''}`}>
                            {/* 使用belle.svg文件作為玲娜貝兒的圖像 */}
                            <img 
                                src={`${imgBasePath}belle.svg`} 
                                alt="玲娜貝兒" 
                                className="character-svg"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    )}
                </div>
                
                <div className="conversation-area">
                    <div className="messages">                    {conversation.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.sender === 'system' ? (
                                    <div className="system-message">{msg.text}</div>
                                ) : (
                                    <>
                                        <div className="message-avatar">
                                            {msg.sender === 'user' ? 
                                                '👨‍💻' : 
                                                (msg.sender === 'teddy' ? 
                                                    <img src={`${imgBasePath}teddy.svg`} alt="熊熊" className="avatar-icon" /> : 
                                                    <img src={`${imgBasePath}belle.svg`} alt="玲娜貝兒" className="avatar-icon" />
                                                )
                                            }
                                        </div>
                                        <div className="message-bubble">{msg.text}</div>
                                    </>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className={`message ${activeCharacter}`}>
                                <div className="message-avatar">
                                    <img 
                                        src={`${imgBasePath}${activeCharacter}.svg`}
                                        alt={activeCharacter === 'teddy' ? '熊熊' : '玲娜貝兒'}
                                        className="avatar-icon"
                                    />
                                </div>
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="message-input">
                        <input 
                            type="text" 
                            value={message} 
                            onChange={handleInputChange} 
                            placeholder="輸入訊息..." 
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSendMessage}>發送</button>
                    </div>
                </div>
            </div>
            
            <div className="action-buttons">
                <button onClick={() => handleAction('hug')}>擁抱</button>
                <button onClick={() => handleAction('play')}>玩耍</button>
                <button onClick={() => handleAction('feed')}>餵食</button>
                <button onClick={() => handleAction('wave')}>揮手</button>
                <button onClick={() => handleAction('nod')}>點頭</button>
            </div>
        </div>
    );
};

export default TeddyBelleInteraction;