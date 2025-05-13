import React from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Router from './router/index.jsx';
import Layout from './layout/index.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Router/>
      </Layout>
    </BrowserRouter>
  );
}
