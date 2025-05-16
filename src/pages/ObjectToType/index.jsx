import React, {useRef} from 'react';
import './index.scss';

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

function getTypeDeclaration(obj, name = 'RootObject', typeMap = {}, parentNames = new Set()) {
  // 防止递归引用死循环
  if (parentNames.has(name)) return '';
  parentNames.add(name);
  let lines = [`type ${name} = {`];
  for (const key in obj) {
    const value = obj[key];
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        // 内联对象类型数组
        const objFields = Object.entries(value[0])
          .map(([k, v]) => `${k}: ${inferType(v)}`)
          .join('; ');
        lines.push(`  ${key}: { ${objFields} }[];`);
      } else {
        lines.push(`  ${key}: ${inferType(value)};`);
      }
    } else if (typeof value === 'object' && value !== null) {
      // 嵌套对象
      const childTypeName = name + '_' + key.charAt(0).toUpperCase() + key.slice(1);
      lines.push(`  ${key}: ${childTypeName};`);
      typeMap[childTypeName] = getTypeDeclaration(value, childTypeName, typeMap, new Set(parentNames));
    } else {
      lines.push(`  ${key}: ${inferType(value)};`);
    }
  }
  lines.push('}');
  parentNames.delete(name);
  typeMap[name] = lines.join('\n');
  // 最顶层时拼接所有类型
  if (name === 'RootObject' || name === parentNames.values().next().value) {
    return Object.values(typeMap).reverse().join('\n\n');
  }
  return typeMap[name];
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
        console.log('jsonErr', jsonErr);
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
      console.log(err)
      errorRef.current.textContent = '错误：请输入有效的 JS 对象';
      errorRef.current.style.display = 'block';
      outputRef.current.value = '';
    }
  }

  const exampleObj = {
    "role_level": 111,
    "role_name": "居士小曾",
    "zone_name": "电信区",
    "server_name": "龙争虎斗",
    "is_single": false,
    "role_create_time": "2024-12-09 21:49:37",
    "list": [
      {
        "id": 1,
        "title": "账号",
        "align": "center",
      }
    ]
  }
  const example = JSON.stringify(exampleObj, null, 2);

  return (
    <div className="object-to-type">
      <h1>【对象】转【类型声明】工具</h1>
      <div className="flex-row-container">
        {/* 左侧：JS对象输入区和类型名 */}
        <div className="left-panel">
          <div className="input-group">
            <label htmlFor="jsObject">JS对象：</label>
            <textarea
              id="jsObject"
              ref={inputRef}
              placeholder={example}
              defaultValue={example}
            />
          </div>
        </div>
        {/* 右侧：类型声明输出区 */}
        <div className="right-panel">
          <div className="input-group">
            <label htmlFor="typeOutput">类型声明：</label>
            <textarea id="typeOutput" ref={outputRef} readOnly defaultValue=""/>
          </div>
          <div id="error" className="error" ref={errorRef}/>
          <div className="input-group">
            <label htmlFor="typeName">类型名：</label>
            <input
              id="typeName"
              ref={typeNameRef}
              type="text"
              defaultValue="Object"
            />
          </div>
          <button onClick={handleConvert}>生成类型声明</button>
        </div>
      </div>

    </div>
  );
}
