import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ObjectToCss from '../pages/ObjectToCss/index.jsx';
import ObjectToType from '../pages/ObjectToType/index.jsx';

export default function Router() {
  return (
    <Routes>
      <Route path="/object-to-css" element={<ObjectToCss/>}/>
      <Route path="/object-to-type" element={<ObjectToType/>}/>
      <Route path="*" element={<div>请选择左侧功能</div>}/>
    </Routes>
  );
}
