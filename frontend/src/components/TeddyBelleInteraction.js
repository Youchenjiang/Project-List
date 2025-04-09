import React, { useState, useEffect } from 'react';
import '../styles/teddyBelle.css';
import '../styles/characterSvg.css';
import '../styles/characterAnimations.css';
import { PUBLIC_PATH, GITHUB_PAGES_BASE } from '../data/config';

const TeddyBelleInteraction = () => {
    // 狀態管理
    const [activeCharacter, setActiveCharacter] = useState('teddy'); // 'teddy' 或 'belle'
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [, setMood] = useState('happy'); // 'happy', 'sad', 'excited'
    
    // 圖片基礎路徑
    const imgBasePath = window.location.hostname === 'localhost' 
        ? `${GITHUB_PAGES_BASE}/assets/images/` 
        : `${PUBLIC_PATH}/assets/images/`;
    
    // 預設對話選項
    const dialogOptions = {
        teddy: [
            '你好啊！我是熊熊，想跟我玩什麼遊戲呢？',
            '我喜歡抱抱！要給我一個溫暖的抱抱嗎？',
            '我餓了，你能給我一些蜂蜜嗎？',
            '我們一起去冒險吧！'
        ],
        belle: [
            '嗨！我是玲娜貝兒，今天過得如何？',
            '我喜歡粉紅色的東西，你也喜歡嗎？',
            '要不要一起玩遊戲？',
            '我們來一起唱歌跳舞吧！',
            '你能摸摸我的耳朵嗎？好癢呀！'
        ]
    };

    // 處理用戶輸入
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    // 處理發送訊息
    const handleSendMessage = () => {
        if (message.trim() === '') return;

        // 添加用戶訊息到對話
        const newConversation = [...conversation, { sender: 'user', text: message }];
        setConversation(newConversation);
        setMessage('');

        // 設置動畫狀態
        setIsAnimating(true);
        
        // 模擬玩偶回應
        setTimeout(() => {
            // 使用activeCharacter直接獲取角色名稱
            const randomResponse = dialogOptions[activeCharacter][Math.floor(Math.random() * dialogOptions[activeCharacter].length)];
            
            setConversation([...newConversation, { sender: activeCharacter, text: randomResponse }]);
            setIsAnimating(false);
        }, 1000);
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
    };

    // 處理互動動作
    const handleAction = (action) => {
        setIsAnimating(true);
        
        let newMood;
        let actionMessage;
        let animationClass = '';
        
        switch(action) {
            case 'hug':
                newMood = 'happy';
                animationClass = 'hug-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊感到被愛和溫暖！' 
                    : '玲娜貝兒給了你一個溫暖的擁抱！';
                break;
            case 'play':
                newMood = 'excited';
                animationClass = 'play-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊開心地跳來跳去！' 
                    : '玲娜貝兒開心地轉圈圈！';
                break;
            case 'feed':
                newMood = 'happy';
                animationClass = 'feed-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊滿足地吃著蜂蜜！' 
                    : '玲娜貝兒開心地吃著棉花糖！';
                break;
            case 'wave':
                newMood = 'happy';
                animationClass = 'wave-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊向你揮手打招呼！' 
                    : '玲娜貝兒向你揮手打招呼！';
                break;
            case 'nod':
                newMood = 'happy';
                animationClass = 'nod-animation';
                actionMessage = activeCharacter === 'teddy' 
                    ? '熊熊點頭表示同意！' 
                    : '玲娜貝兒點頭表示同意！';
                break;
            default:
                newMood = 'happy';
                actionMessage = '發生了有趣的事情！';
        }
        
        setMood(newMood);
        
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
    };

    // 初始化歡迎訊息
    useEffect(() => {
        const welcomeMessage = activeCharacter === 'teddy' 
            ? '嗨！我是熊熊，很高興見到你！' 
            : '你好！我是玲娜貝兒，今天想一起玩耍嗎？';
        setConversation([{ sender: activeCharacter, text: welcomeMessage }]);
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
                    <div className="messages">
                        {conversation.map((msg, index) => (
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
                    </div>
                    
                    <div className="message-input">
                        <input 
                            type="text" 
                            value={message} 
                            onChange={handleInputChange} 
                            placeholder="輸入訊息..." 
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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