import { useEffect, useState, useRef } from 'react';

function App() {

  const [backgroundText, setBackgroundText] = useState(""); // The inputted text
  const [font, setFont] = useState(54);

  const DisplayCanvas = props => {

    const canvasRef = useRef(null);
    
    useEffect(() => {
      const ctx = canvasRef.current.getContext('2d');
      const scaledWidth = props.width * (2/3);
      const scaledHeight = props.height * (2/3);
      const scaledFont = props.font * (2/3);
      // Draw background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, scaledWidth, scaledHeight);

      // Draw text
      ctx.font = scaledFont + 'px serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(props.text, scaledWidth/2, scaledHeight/2);
    }, [props]);

    return <canvas ref={canvasRef} width={props.width * (2/3)} height={props.height * (2/3)} style={{border: '1px solid black'}}>Your browser does not support the canvas HTML element.</canvas>;
  };
 
  const DownloadBackground = props => {
    
    // Component combining the Download Button with the downloading apparatus (Hidden canvas and a tag)
    // This way the shouldDownload state re-renders only the necessary things
    const [shouldDownload, setShouldDownload] = useState(false);

    const canvasRef = useRef(null);
    const aRef = useRef(null);


    function doDownload(canvasRef, aRef, ...props) {
      const ctx = canvasRef.current.getContext('2d');

      // Draw background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 1920, 1080);

      // Draw text
      ctx.font = '54px serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('test-text', 1920/2, 1080/2);

      aRef.current.href = canvasRef.current.toDataURL("image/png");
      aRef.current.download = "back.png";
      aRef.current.click();
    }

    // We must do the download inside useEffect because it requires a non-null reference to the <canvas> and <a> elements
    useEffect(() => {
      
      console.log("inside download canvas eff");

      if(shouldDownload) {
        doDownload(canvasRef, aRef);
        setShouldDownload(false);
      }
    }, [shouldDownload]);

    
    return (
      <div>
        <button onClick={()=>setShouldDownload(true)}>Download</button>
        <canvas ref={canvasRef} width={1920} height={1080} hidden/>
        {// eslint-disable-next-line
        }<a ref={aRef} download="back.png" hidden></a>
      </div>
    );
  }

  return (
    <div className="App" style={{textAlign: 'center'}}>

      <label>
        Input Text: 
        <input type="text" id="inputText" onChange={e => setBackgroundText(e.target.value)}>
        </input>
      </label>
      <DownloadBackground/>
      
      <div>
        <h2>Two-Thirds Scale Display</h2>
        <DisplayCanvas width={1920} height={1080} text={backgroundText} font={font}/>
      </div>
    </div>
  );
}

export default App;
