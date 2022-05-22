
import "./App.css";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // const[isloaded , ]
  
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
      const ladeledFaceDescriptors = await loadLabeledImages();

      const faceMatcher = new faceapi.FaceMatcher(ladeledFaceDescriptors,
        .6
        );


      const image = await faceapi.bufferToImage(Uploaded_images);
  
      

      const displaySize = { width: imageRef.current.width, height: imageRef.current.height };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detect = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();

        // console.log(detect);
        
        const resizedDetections = faceapi.resizeResults(detect, displaySize);
        
        canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(image);

        const results = resizedDetections.map(d=>
          faceMatcher.findBestMatch(d.descriptor)
          )


      results.forEach((result,i) =>{
        const box = resizedDetections[i].detection.box;
        
        const drawBox = new faceapi.draw.DrawBox(box,{
          label: result.toString()
        })
        drawBox.draw(canvasRef.current)
      })
      
      
        
    }
  };

  const loadLabeledImages=()=>
  {
    const labels = ['Black Widow','Captain America','Captain Marvel','Hawkeye','Jim Rhodes','Thor','Tony stark'];
    
    const descriptions = [];

    return Promise.all(
      labels.map(async label=>
        {
          for(let i=1;i<=2;i++)
          {
            const img = await faceapi.fetchImage(`https://github.com/WebDevSimplified/Face-Recognition-JavaScript/tree/master/labeled_images/${label}/${i}.jpg`);
            const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detection.descriptor);
          }
          return new faceapi.LabeledFaceDescriptors(label,descriptions);
        })

    )
  }
  
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