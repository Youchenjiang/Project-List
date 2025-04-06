import React from 'react';
import Layout from './components/Layout';
import { ProjectProvider } from './context/ProjectContext';
import './styles/index.css';

function App() {
  return (
    <ProjectProvider>
      <Layout />
    </ProjectProvider>
  );
}

export default App;
