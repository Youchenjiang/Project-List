import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import '../styles/sidebar.css';

const Sidebar = () => {
    const { projects, setSelectedProject } = useProject();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
      // 處理過渡效果
    useEffect(() => {
        if (isSidebarExpanded) {
            setIsTransitioning(true);
            const timer = setTimeout(() => setIsTransitioning(false), 350); // 增加一點時間，確保過渡效果完成
            return () => clearTimeout(timer);
        } else {
            // 收縮時也設置過渡狀態，延遲移除，確保文字有足夠的時間淡出
            setIsTransitioning(true);
            const timer = setTimeout(() => setIsTransitioning(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isSidebarExpanded]);

    return (
        <nav className={`sidebar ${isSidebarExpanded ? 'expanded' : ''} ${isTransitioning ? 'transitioning' : ''}`} 
             onMouseEnter={() => setIsSidebarExpanded(true)}
             onMouseLeave={() => setIsSidebarExpanded(false)}>
            <div className="sidebar-content">
                <div className="project-list">
                    <button 
                        className="project-item home-button"
                        onClick={() => setSelectedProject(null)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            border: 'none',
                            background: 'none',
                            color: 'inherit',
                            width: '100%'
                        }}
                    >                        <div className="project-icon">🏠</div>
                        {(isSidebarExpanded || isTransitioning) && (
                            <div className="project-text">
                                <h3>回首頁</h3>
                                <p>返回歡迎頁面</p>
                            </div>
                        )}
                    </button>
                    <hr style={{ margin: '10px 5px', borderColor: '#ddd', opacity: 0.5 }} />
                    {projects.map((project) => (
                        <button 
                            key={project.id}
                            className="project-item"
                            onClick={() => setSelectedProject(project.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                border: 'none',
                                background: 'none',
                                color: 'inherit',
                                width: '100%'
                            }}
                        >
                            <div className="project-icon">{project.icon}</div>
                            {(isSidebarExpanded || isTransitioning) && (
                                <div className="project-text">
                                    <h3>{project.name}</h3>
                                    <p>{project.description}</p>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;