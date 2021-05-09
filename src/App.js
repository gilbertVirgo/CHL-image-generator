import React from  "react";
import './App.css';

import canvasTxt from "canvas-txt";

const scale = 2;
const margin = 75 * scale;
const width = 1000 * scale;
const height = 1000 * scale;
const logoWidth = 130 * scale; const logoHeight = 55 * scale;


const fileToBase64 = async (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

const drawFile = async (context, base64String) => new Promise((resolve) => {
	const image = new Image();
	image.onload = () => resolve(context.drawImage(image, 0, 0, width, height));
	image.src = base64String; 
});

const drawLogo = async (context) => new Promise((resolve) => {
  const image = new Image();
  image.onload = () => {
    context.drawImage(image, 10 * scale, 10 * scale, logoWidth, logoHeight)

    resolve();
  }
  image.src = require("./logo.png").default;
})

function App() {
  const [text, setText] = React.useState("");
  const [textColour, setTextColour] = React.useState("#000000");
  const [textBgColour, setTextBgColour] = React.useState("#FFFFFF");
  const [file, setFile] = React.useState(null);
  const [fontSize, setFontSize] = React.useState("60");
  const [base64String, setBase64String] = React.useState(null);

  const canvas = React.useRef(null);

  React.useEffect(() => {
    if(canvas) {
      (async function() {
        const context = canvas.current.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.imageSmoothingEnabled = false;

        if(base64String) {
          await drawFile(context, base64String);
        }

        context.fillStyle = textBgColour + "60";
        context.fillRect(margin, margin, width - (margin * 2), height - (margin * 2));

        if(text) {
          canvasTxt.vAlign = "center";
          canvasTxt.font = "'Hoefler Text', Garamond, serif";
          canvasTxt.lineHeight = ((fontSize) * scale) + 20;
          canvasTxt.fontSize = fontSize * scale;
          canvasTxt.align = "center";
          context.fillStyle = textColour;
          canvasTxt.drawText(context, text.split("").join(String.fromCharCode(8202)), margin, margin, width - (margin * 2), height - (margin * 2));
        }

        await drawLogo(context);
      })();
    }
    
  }, [text, base64String, fontSize, textColour, textBgColour]);

  React.useEffect(() => {
    if(file) (async function() {
      const base64String = await fileToBase64(file);

      setBase64String(base64String);
    })();
  }, [file]);

  return (
    <main>
      <label>Font size (px)</label>
      <input type="number" value={fontSize} onChange={({target}) => setFontSize(target.value)} />
      <label>Text</label>
      <textarea value={text} onChange={({target}) => setText(target.value)}/>
      <label>Text colour</label>
      <input type="color" value={textColour} onChange={({target}) => setTextColour(target.value)} />
      <label>Text background colour</label>
      <input type="color" value={textBgColour} onChange={({target}) => setTextBgColour(target.value)} />
      <label>Image</label>
      <input type="file" onChange={({target: {files: [file]}}) => setFile(file)} />
      <canvas width={width} height={height} style={{width: 500, height: 500}} ref={canvas}></canvas>
    </main>
  );
}

export default App;
