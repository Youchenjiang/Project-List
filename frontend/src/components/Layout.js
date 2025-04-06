import React from 'react';
import Sidebar from './Sidebar';
import ContentArea from './ContentArea';

const Layout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <ContentArea />
            </main>
        </div>
    );
};

export default Layout;
