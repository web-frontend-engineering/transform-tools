import React, {useRef} from 'react';
import './index.css';

function inferType(value) {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'string') {
    // 简单判断日期字符串
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) return 'string // 日期时间';
    return 'string';
  }
  if (Array.isArray(value)) return 'any[]';
  if (typeof value === 'object' && value !== null) return 'object';
  return 'any';
}

function getTypeDeclaration(obj, name = 'RootObject') {
  let lines = [`type ${name} = {`];
  for (const key in obj) {
    lines.push(`  ${key}: ${inferType(obj[key])};`);
  }
  lines.push('}');
  return lines.join('\n');
}

export default function ObjectToType() {
  const inputRef = useRef();
  const typeNameRef = useRef();
  const outputRef = useRef();
  const errorRef = useRef();

  function handleConvert() {
    const input = inputRef.current.value;
    const typeName = typeNameRef.current.value || 'Object';
    let obj;
    try {
      // 尝试 JSON 解析
      try {
        obj = JSON.parse(input);
      } catch (jsonErr) {
        // 尝试 JS 对象解析
        const trimmed = input.trim();
        if (!trimmed.startsWith('{') && !trimmed.endsWith('}')) {
          obj = new Function('return {' + trimmed + '}')();
        } else {
          obj = new Function('return ' + trimmed)();
        }
      }
      const typeDecl = getTypeDeclaration(obj, typeName);
      outputRef.current.value = typeDecl;
      errorRef.current.style.display = 'none';
    } catch (err) {
      errorRef.current.textContent = '错误：请输入有效的 JS 对象';
      errorRef.current.style.display = 'block';
      outputRef.current.value = '';
    }
  }

  const example = `{
  "server_name": "龙争虎斗",
  "role_name": "居士小曾",
  "role_level": 111,
  "zone_name": "电信区",
  "role_type": "标准女",
  "role_force": "七秀",
  "is_woman": false,
  "role_create_time": "2024-12-09 21:49:37"
}`;

  return (
    <div className="container">
      <h1>【对象】转【类型声明】工具</h1>
      <div className="input-group">
        <label htmlFor="jsObject">JS对象：</label>
        <textarea
          id="jsObject"
          ref={inputRef}
          placeholder={example}
          defaultValue={example}
        />
      </div>
      <button onClick={handleConvert}>生成类型声明</button>
      <div className="input-group">
        <label htmlFor="typeName">类型名：</label>
        <input
          id="typeName"
          ref={typeNameRef}
          type="text"
          defaultValue="Object"
        />
      </div>
      <div className="input-group">
        <label htmlFor="typeOutput">类型声明：</label>
        <textarea id="typeOutput" ref={outputRef} readOnly defaultValue=""/>
      </div>
      <div id="error" className="error" ref={errorRef}/>
    </div>
  );
}
