
import "./App.css";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  let Uploaded_images ;
  
  const uploadimage = (event) => {
    event.preventDefault();
    if(selectedImage===null)
    {
      setSelectedImage(event.target.files[0]);
      
    }
    Uploaded_images = event.target.files[0];
    console.log(Uploaded_images);
    detection();
  };
  const detection = async () => {

    if(Uploaded_images!==null)
    {
      console.log(Uploaded_images)
      const image = await faceapi.bufferToImage(Uploaded_images);
  
      console.log("hi");
      // console.log(image);
      const detect = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();
  
      console.log(detect);

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(image);
      faceapi.matchDimensions(canvasRef.current
        ,
        {
        width: imageRef.current.width,
        height: imageRef.current.height,
        
      }
      )
      faceapi.draw.drawDetections(canvasRef.current , detect);

    }
  };
  
  const loadmodels = () => {
    Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      console.log("Loaded"),
    ]).then();
  };

  useEffect(() => {
    loadmodels();
  }, []);

  console.log(selectedImage);



  return (
    <div>
      <input
        type="file"
        name="myImage"
        accept=".jpg, .jpeg, .png"
        crossOrigin="anonymous"
        onChange={uploadimage}
      />
      {selectedImage!==null && (
        <>
          <div>
            <img
            
              alt="not found"
              style={{
                position: "absolute",
                marginRight: "auto",
                marginLeft: "auto",
                left: 0,
                right: 0,
                // zIndex: 9,
                textAlign: "center",
                // width: "640px",
                // height: "480px",
              }}
              src={URL.createObjectURL(selectedImage)}
              ref={imageRef}
              />
            {/* <button onClick={() => setSelectedImage(null)}>Remove</button> */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginRight: "auto",
              marginLeft: "auto",
              left: 0,
              right: 0,
              // zIndex: 9,
              textAlign: "center",
              // width: "640px",
              // height: "480px",
            }
          }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default App;