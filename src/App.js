import { useEffect, useState, useRef } from 'react';

function App() {

  const [backgroundText, setBackgroundText] = useState(""); // The inputted text
  const [dimensionString, setDimensionString] = useState('{"width": 1920, "height": 1080}');
  const [font, setFont] = useState(54);

  const DimensionDropdown = props => {

    // When an option is chosen, the dimensionString state is set and this component is re-rendered.
    // In order for the <select> tag to display the currently chosen option post-re-render,
    // the value property on the <select> tag must be set to a state && must match the value property of an <option> tag.
    // Since all values are converted to strings, using objects as values will not work properly-
    // all object values will be converted to '[object object]' and the first such option will be displayed.

    const options = [
      { label: '1920x1080', value: '{"width": 1920, "height": 1080}'},
      { label: '1440x900', value: '{"width": 1440, "height": 900}' },
      { label: '1366x768', value: '{"width": 1366, "height": 768}' },
    ];

    return (
      <div>
        <label>
          Screen Resolution: 
          <select value={dimensionString} onChange={e => setDimensionString(e.target.value)}>
            {options.map((option) => (
              <option key={option.label} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>
    )
  }

  const DisplayCanvas = props => {
    const TWO_THIRDS = 2/3;

    const canvasRef = useRef(null);
    
    useEffect(() => {
      const ctx = canvasRef.current.getContext('2d');
      const dimensions = JSON.parse(dimensionString);
      const scaledWidth = dimensions.width * TWO_THIRDS;
      const scaledHeight = dimensions.height * TWO_THIRDS;
      const scaledFont = props.font * TWO_THIRDS;
      // Draw background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, scaledWidth, scaledHeight);

      // Draw text
      ctx.font = scaledFont + 'px serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(backgroundText, scaledWidth/2, scaledHeight/2);
    }, [props, TWO_THIRDS]);

    const dimensions = JSON.parse(dimensionString);
    return <canvas ref={canvasRef} width={dimensions.width * TWO_THIRDS} height={dimensions.height * TWO_THIRDS} style={{border: '1px solid black'}}>Your browser does not support the canvas HTML element.</canvas>;
  };
 
  const DownloadBackground = props => {
    
    // Component combining the Download Button with the downloading apparatus (Hidden canvas and a tag)
    // This way the shouldDownload state re-renders only the necessary things
    const [shouldDownload, setShouldDownload] = useState(false);

    const canvasRef = useRef(null);
    const aRef = useRef(null);


    function doDownload(canvasRef, aRef) {
      const ctx = canvasRef.current.getContext('2d');
      const dimensions = JSON.parse(dimensionString);

      // Draw background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw text
      ctx.font = '54px serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(backgroundText, dimensions.width/2, dimensions.height/2);

      // Create and complete download
      aRef.current.href = canvasRef.current.toDataURL("image/png");
      aRef.current.download = "back.png";
      aRef.current.click();
    }

    // We must do the download inside useEffect because it requires a non-null reference to the <canvas> and <a> elements
    useEffect(() => {
      if(shouldDownload) {
        doDownload(canvasRef, aRef);
        setShouldDownload(false);
      }
    }, [shouldDownload]);
    const dimensions = JSON.parse(dimensionString);

    return (
      <div>
        <button onClick={()=>setShouldDownload(true)}>Download</button>
        <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} hidden/>
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
      <DimensionDropdown/>
      <DownloadBackground/>
      
      <div>
        <h2>Two-Thirds Scale Display</h2>
        <DisplayCanvas font={font}/>
      </div>
    </div>
  );
}

export default App;
