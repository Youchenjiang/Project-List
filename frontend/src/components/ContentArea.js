import React, { useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import TeddyBelleInteraction from './TeddyBelleInteraction';

const ContentArea = () => {
    const { selectedProject, currentProject, showProjectInfo, setShowProjectInfo, setSelectedProject } = useProject();

    // 監聽來自嵌入 iframe 的消息
    useEffect(() => {
        const handleMessage = (event) => {
            // 確保消息來源是我們的 iframe
            if (event.data && event.data.type === 'SELECT_PROJECT') {
                console.log('收到專案切換消息:', event.data.projectPath);
                setShowProjectInfo(false); // 關閉專案介紹頁面
                setSelectedProject(event.data.projectPath); // 設置選中的專案
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [setShowProjectInfo, setSelectedProject]);

    // 渲染內容區域
    const renderContent = () => {
        // 顯示專案介紹
        if (showProjectInfo) {
            return (
                <div className="project-info-page">
                    <div className="project-info-header">
                        <h1>專案介紹</h1>
                        <button 
                            className="close-button"
                            onClick={() => setShowProjectInfo(false)}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '20px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >×</button>
                    </div>                    <iframe 
                        src={`${window.location.origin}/Project-List/projects/project-intro.html`}
                        title="Project Introduction"
                        style={{
                            width: '100%',
                            height: 'calc(100% - 60px)',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#fff'
                        }}
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            );
        }

        // 顯示歡迎頁面
        if (!selectedProject) {
            return (
                <div className="welcome-page">
                    <h1>專案管理系統</h1>
                    <p>點擊側邊欄的專案來查看不同的效果示範</p>
                </div>
            );
        }

        // 檢查是否為React組件
        if (currentProject?.isReactComponent) {
            // 根據路徑選擇要渲染的React組件
            switch (selectedProject) {
                case 'teddy-belle':
                    return <TeddyBelleInteraction />;
                default:
                    return <div>找不到對應的React組件</div>;
            }        } else {
            // 渲染iframe
            const iframeSrc = selectedProject;
            return (
                <div className="project-container" style={{ height: '100%', overflow: 'auto' }}>
                    <div className="reference-info">
                        {currentProject?.reference && (
                            <a href={currentProject.reference} target="_blank" rel="noreferrer">
                                <span className="reference-icon">🔗</span>
                                查看原始碼
                            </a>
                        )}
                    </div>
                    <iframe 
                        ref={iframe => {
                            if (iframe) {
                                iframe.onload = () => {
                                    try {
                                        // 移除 iframe 內容中的 header, nav 等元素
                                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                                        const elementsToRemove = iframeDoc.querySelectorAll('header, nav, .navigation, .navbar, .nav-bar');
                                        elementsToRemove.forEach(element => element.remove());
                                        
                                        // 調整 body 樣式
                                        if (iframeDoc.body) {
                                            iframeDoc.body.style.margin = '0';
                                            iframeDoc.body.style.padding = '20px';
                                        }
                                    } catch (e) {
                                        console.warn('無法修改 iframe 內容:', e);
                                    }
                                };
                            }
                        }}
                        src={iframeSrc}
                        title="Project Content"
                        style={{
                            width: '100%',
                            height: 'calc(100% - 40px)',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#fff'
                        }}
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            );
        }
    };

    return (
        <div className="content-area">
            <div className="reference-info">
                {currentProject?.reference && (
                    <a href={currentProject.reference} target="_blank" rel="noreferrer">
                        <span className="reference-icon">🔗</span>
                        查看原始碼
                    </a>
                )}
            </div>
            {renderContent()}
        </div>
    );
};

export default ContentArea;