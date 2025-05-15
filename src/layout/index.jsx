import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import './index.css';

export default function Layout({children}) {
  const location = useLocation();
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}>
          <h1>欢迎使用 转换工具</h1>
        </Link>
      </header>
      <div className="app-layout">
        <aside className="app-sider">
          <nav>
            <Link
              to="/object-to-css"
              className={`menu-link${location.pathname === '/object-to-css' ? ' active' : ''}`}
            >
              对象 转 CSS样式
            </Link>
            <Link
              to="/object-to-type"
              className={`menu-link${location.pathname === '/object-to-type' ? ' active' : ''}`}
            >
              对象 转 类型声明
            </Link>
          </nav>
        </aside>
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}

