import React from 'react';
import { useProject } from '../context/ProjectContext';
import TeddyBelleInteraction from './TeddyBelleInteraction';

const ContentArea = () => {
    const { selectedProject, currentProject } = useProject();

    // 渲染內容區域
    const renderContent = () => {
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
            }
        } else {
            // 渲染iframe
            return (
                <iframe 
                    src={selectedProject}
                    title="Project Content"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                    sandbox="allow-same-origin allow-scripts"
                />
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