import React from 'react';
import {HashRouter, Routes, Route, Link} from 'react-router-dom';
import './App.scss';
import Router from './router/index.jsx';
import Layout from './layout/index.jsx';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Router/>
      </Layout>
    </HashRouter>
  );
}
