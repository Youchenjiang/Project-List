import React, { createContext, useState, useContext } from 'react';
import { projects } from '../data/projects.js';

// 創建Context
const ProjectContext = createContext();

// 創建Provider組件
export const ProjectProvider = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState(null);
    
    // 獲取當前選中項目的詳細信息
    const currentProject = selectedProject 
        ? projects.find(p => p.path === selectedProject) 
        : null;
    
    // 提供給子組件的值
    const value = {
        projects,
        selectedProject,
        setSelectedProject,
        currentProject
    };
    
    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};

// 創建自定義Hook以便於使用Context
export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};