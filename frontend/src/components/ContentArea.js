import React from 'react';
import { useProject } from '../context/ProjectContext';

const ContentArea = () => {
    const { selectedProject, currentProject } = useProject();

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
            {selectedProject ? (
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
            ) : (
                <div className="welcome-page">
                    <h1>專案管理系統</h1>
                    <p>點擊側邊欄的專案來查看不同的效果示範</p>
                </div>
            )}
        </div>
    );
};

export default ContentArea;