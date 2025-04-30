import './index.css'

export default function ObjectToCss() {
  function convertToCSS() {
    const reactStyleInput = document.getElementById('reactStyle').value;
    const errorElement = document.getElementById('error');
    const cssOutput = document.getElementById('cssOutput');

    try {
      // Parse the input as JSON
      const styleObject = JSON.parse(reactStyleInput);

      // Convert React style object to CSS
      let cssString = '';
      for (const [key, value] of Object.entries(styleObject)) {
        // Convert camelCase to kebab-case
        const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        cssString += `${cssProperty}: ${value};\n`;
      }

      // Display the result
      cssOutput.value = cssString;
      errorElement.style.display = 'none';
      // eslint-disable-next-line
    } catch (error) {
      errorElement.textContent = 'Error: Please enter a valid JSON object';
      errorElement.style.display = 'block';
      cssOutput.value = '';
    }
  }

  return (
    <div className="container">
      <h1>React Style to CSS Converter</h1>
      <div className="input-group">
        <label htmlFor="reactStyle">React Style Object:</label>
        <textarea
          id="reactStyle"
          placeholder='Enter React style object here, e.g.:
{
    "backgroundColor": "#f0f0f0",
    "padding": "20px",
    "borderRadius": "5px"
}'
          defaultValue={""}
        />
      </div>
      <button onClick={convertToCSS}>Convert to CSS</button>
      <div className="input-group">
        <label htmlFor="cssOutput">CSS Output:</label>
        <textarea id="cssOutput" readOnly="" defaultValue={""}/>
      </div>
      <div id="error" className="error"/>
    </div>
  )
}