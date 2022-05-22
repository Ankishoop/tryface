// import "./App.css";
// import * as faceapi from "face-api.js";
// import { useEffect, useRef, useState } from "react";

// const App = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);
  
  
//   const uploadimage = (event) => {
//     event.preventDefault();
//     if(selectedImage===null)
//     {
//       setSelectedImage(event.target.files[0]);
//       console.log(selectedImage.files);
//     }
//     detection();
//   };
//   const detection = async () => {

//     // const blob = new Blob([help], { type: "text/plain" });
//     // const {help }= selectedImage;
//     if(selectedImage!==null)
//     {
//       console.log(selectedImage)
//       const image = await faceapi.bufferToImage(selectedImage.files[0]);
  
//       console.log("hi");
//       console.log(image);
//       const detect = await faceapi
//         .detectAllFaces(image)
//         .withFaceLandmarks()
//         .withFaceDescriptors();
  
//       console.log(detect);

//     }
//   };

//   const loadmodels = () => {
//     Promise.all([
//       faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//       faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
//       console.log("Loaded"),
//     ]).then();
//   };

//   useEffect(() => {
//     loadmodels();
//   }, []);

//   console.log(selectedImage);

//   return (
//     <div>
//       <input
//         type="file"
//         name="myImage"
//         accept=".jpg, .jpeg, .png"
//         onChange={uploadimage}
//       />
//       {selectedImage!==null && (
//         <>
//           <div>
//             <img
//             id="imageupload"
//               alt="not found"
//               style={{
//                 position: "absolute",
//                 marginRight: "auto",
//                 marginLeft: "auto",
//                 left: 0,
//                 right: 0,
//                 zIndex: 9,
//                 textAlign: "center",
//                 width: "640px",
//                 height: "480px",
//               }}
//               src={URL.createObjectURL(selectedImage)}
//               ref={imageRef}
//               />
//             {/* <button onClick={() => setSelectedImage(null)}>Remove</button> */}
//           <canvas
//             ref={canvasRef}
//             style={{
//               position: "absolute",
//               marginRight: "auto",
//               marginLeft: "auto",
//               left: 0,
//               right: 0,
//               zIndex: 9,
//               textAlign: "center",
//               width: "640px",
//               height: "480px",
//             }}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default App;






// faceapi.matchDimensions(canvasRef.current
      //   ,
      //   {
      //   width: imageRef.width,
      //   height: imageRef.height,
        
      // }
      // )
      // faceapi.draw.drawDetections(canvasRef.current , detect);



      //  const [upload, setupload] = useState(null);

// const uploadimage=async(event)=>
// {
//   setupload(event.target.files[0])
//   // event.preventDefalut();
// }

// console.log(upload)




import React from "react";
import * as faceapi from "face-api.js";

function App() {
  const imageUpload = document.getElementById("imageUpload");

  
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  ]).then(start);

  async function start() {
    const container = document.createElement("div");
    container.style.position = "relative";
    document.body.append(container);
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    let image;
    let canvas;
    document.body.append("Loaded");
    imageUpload.addEventListener("change", async () => {
      if (image) image.remove();
      if (canvas) canvas.remove();
      image = await faceapi.bufferToImage(imageUpload.files[0]);
      container.append(image);
      canvas = faceapi.createCanvasFromMedia(image);
      container.append(canvas);
      const displaySize = { width: image.width, height: image.height };
      faceapi.matchDimensions(canvas, displaySize);
      const detections = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvas);
      });
    });
  }

  function loadLabeledImages() {
    const labels = [
      "Black Widow",
      "Captain America",
      "Captain Marvel",
      "Hawkeye",
      "Jim Rhodes",
      "Thor",
      "Tony Stark",
    ];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(
            `https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`
          );
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }

        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }
  return (
    <>
      <div>
        <input type="file" id="imageUpload" />

      
      </div>
    </>
  );
}

export default App;

