import './index.scss'
import React from "react";

function convertToCSS() {
  const reactStyleInput = document.getElementById('reactStyle').value;
  const errorElement = document.getElementById('error');
  const cssOutput = document.getElementById('cssOutput');

  try {
    // 首先尝试解析为 JSON，如果失败则尝试解析为 JavaScript 对象
    let styleObject;
    try {
      styleObject = JSON.parse(reactStyleInput);
    } catch (jsonError) {
      // 如果 JSON 解析失败，尝试解析为 JavaScript 对象
      // 首先检查输入是否是单个属性（没有对象包装）
      const trimmedInput = reactStyleInput.trim();
      if (!trimmedInput.startsWith('{') && !trimmedInput.endsWith('}')) {
        // 将输入包装在对象中
        styleObject = new Function('return {' + trimmedInput + '}')();
      } else {
        styleObject = new Function('return ' + trimmedInput)();
      }
    }

    // 将 React 样式对象转换为 CSS
    let cssString = '';
    for (const [key, value] of Object.entries(styleObject)) {
      // 将驼峰命名转换为连字符命名
      const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      cssString += `${cssProperty}: ${value};\n`;
    }

    // 显示结果
    cssOutput.value = cssString;
    errorElement.style.display = 'none';
  } catch (error) {
    errorElement.textContent = '错误：请输入有效的样式对象或属性';
    errorElement.style.display = 'block';
    cssOutput.value = '';
  }
}

export default function ObjectToCss() {
  const [copyTip, setCopyTip] = React.useState('');
  return (
    <div className="object-to-css">
      <h1>【对象】转【CSS样式】工具</h1>
      <div className="flex-row-container">
        {/* 左侧输入区 */}
        <div className="left-panel">
          <div className="input-group">
            <label htmlFor="reactStyle">样式对象：</label>
            <textarea
              id="reactStyle"
              placeholder={`在此输入样式对象或属性，例如：\n{\n    "backgroundColor": "#f0f0f0",\n    "padding": "20px",\n    "borderRadius": "5px"\n}\n或\n{\n    backgroundColor: "#f0f0f0",\n    padding: "20px",\n    borderRadius: "5px"\n}\n或\nflexDirection: "column"`}
              defaultValue={""}
            />
          </div>
          <button onClick={convertToCSS}>转换为 CSS</button>
        </div>
        {/* 右侧输出区 */}
        <div className="right-panel">
          <div className="input-group">
            <label htmlFor="cssOutput">CSS 输出：</label>
            <textarea id="cssOutput" readOnly defaultValue={""}/>
          </div>
          <button
            type="button"
            onClick={() => {
              const cssOutput = document.getElementById('cssOutput');
              if (cssOutput) {
                navigator.clipboard.writeText(cssOutput.value).then(() => {
                  setCopyTip('复制成功！');
                  setTimeout(() => setCopyTip(''), 3000);
                });
              }
            }}
          >一键复制
          </button>
          {copyTip && <span style={{color: '#52c41a', alignSelf: 'center'}}>{copyTip}</span>}
          <div id="error" className="error"/>
        </div>
      </div>
    </div>
  )
}