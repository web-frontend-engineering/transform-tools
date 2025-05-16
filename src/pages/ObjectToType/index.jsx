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

function getTypeDeclaration(obj, name = 'RootObject', depth = 0) {
  const indent = (n) => '  '.repeat(n);
  let lines = [depth === 0 ? `type ${name} = {` : '{'];
  for (const key in obj) {
    const value = obj[key];
    if (Array.isArray(value)) { // 属性值是【数组】
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        // 递归处理数组元素对象类型，嵌套统一换行缩进
        const nested = getTypeDeclaration(value[0], '', depth + 1).trim();
        const nestedLines = nested.split('\n').map(line => indent(depth + 2) + line).join('\n');
        lines.push(`${indent(depth + 1)}${key}:\n${nestedLines};`);
      } else {
        lines.push(`${indent(depth + 1)}${key}: ${inferType(value)};`);
      }
    } else if (typeof value === 'object' && value !== null) { // 属性值是【对象】
      // 递归处理嵌套对象，嵌套统一换行缩进
      const nested = getTypeDeclaration(value, '', depth + 1).trim();
      const nestedLines = nested.split('\n').map(line => indent(depth + 2) + line).join('\n');
      lines.push(`${indent(depth + 1)}${key}:\n${nestedLines};`);
    } else { // 属性值是【基本数据类型】
      lines.push(`${indent(depth + 1)}${key}: ${inferType(value)};`);
    }
  }
  lines.push(indent(depth) + '}');
  return lines.join('\n');
}


export default function ObjectToType() {
  const inputRef = useRef();
  const typeNameRef = useRef();
  const outputRef = useRef();
  const errorRef = useRef();
  const [copyTip, setCopyTip] = React.useState('');

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
    "need_feedback": false,
    "item_status": 200,
    "service_info": {
      "name": "流程测试2",
      "description": "流程测试2",
      "icon": "https://static.com/backend/15294641189257.jpg"
    },
    "item_type": "2",
    "start_sync": true,
    "change_key": "c7e06df584bf4bd4bda8e03276c50d2c",
    "stop_item_reason": null,
    "allow_stop_item": false,
    "is_reset_mobile": false,
    "stage_info": {
      "accept": {"memo": "您的问题创建成功", "create_tm": "2025-05-12 11:12:39"},
      "finish": {"stage": 6, "memo": "工单审核异常，请您尝试重新提交", "create_tm": "2025-05-12 11:12:39"}
    },
    "item_log": [
      {"memo": "您的问题创建成功", "create_tm": "2025-05-12 11:12:39"},
      {
        "stage": 1,
        "memo": "您的问题已生成工单",
        "create_tm": "2025-05-12 11:12:39"
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
          <div style={{display: 'flex', gap: '12px'}}>
            <button onClick={handleConvert}>生成类型声明</button>
            <button
              type="button"
              onClick={() => {
                if (outputRef.current) {
                  navigator.clipboard.writeText(outputRef.current.value).then(() => {
                    setCopyTip('复制成功！');
                    setTimeout(() => setCopyTip(''), 3000);
                  });
                }
              }}
            >一键复制
            </button>
            {copyTip && <span style={{color: '#52c41a', alignSelf: 'center'}}>{copyTip}</span>}
          </div>
        </div>
      </div>

    </div>
  );
}
