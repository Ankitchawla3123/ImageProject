import React, { useRef, useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const imgRef = useRef(null)

  function handleChange(e) {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const imageURL = URL.createObjectURL(uploadedFile);
      setFile(imageURL);
    }
  }

  function handleInspect() {
    if (imgRef.current) {
      console.log("Image width:", imgRef.current.width);
      console.log("Image height:", imgRef.current.height);
    }
  }

  return (
    <div className="App">
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />

      {file && (
        <>
          <img
            ref={imgRef}
            src={file}
            alt="Uploaded preview"
            onLoad={handleInspect}
          />
          <button onClick={handleInspect}>Inspect Image</button>
        </>
      )}
    </div>
  );
}

export default App;
