import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="dashboard animate-fade-in">
      <Navbar />
      <main className="dashboard__container">
        {children}
      </main>
    </div>
  );
};

export default Layout;
