import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import './App.css'
import useRotate from "./hooks/useRotate";
import useScale from "./hooks/useScale";
import useTranslate from "./hooks/useTranslate";
import MathematicsDialog from "./components/MathematicsDialog";


export default function App() {
  const imgRef = useRef();
  const leftCanvasRef = useRef();
  const rightCanvasRef = useRef();
  const grayMatRef = useRef(null);
  const colorMatRef = useRef(null);

  const [cvReady, setCvReady] = useState(false);
  const [fileName, setFileName] = useState("");
  const [cv, setCv] = useState(null);
  const [hasTransformed, setHasTransformed] = useState(false);

  const { angle, setAngle, rotate } = useRotate(cv, fileName);
  const { scale, setScale, scaleImage } = useScale(cv, fileName);
  const { tx, ty, setTx, setTy, translate } = useTranslate(cv, fileName);

  const [priorities, setPriorities] = useState({
    rotate: "Don't Apply",
    scale: "Don't Apply",
    translate: "Don't Apply",
  });

  const availablePriorities = ["Don't Apply", "1st", "2nd", "3rd"];

  useEffect(() => {
    const check = setInterval(() => {
      if (window.cv && window.cv.Mat) {
        setCv(window.cv);
        setCvReady(true);
        clearInterval(check);
        console.log("✅ OpenCV.js ready");
      }
    }, 200);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setHasTransformed(false);
    const reader = new FileReader();
    reader.onload = (ev) => (imgRef.current.src = ev.target.result);
    reader.readAsDataURL(file);
  };

const handleImageLoad = () => {
  if (!cvReady) return;
  let src = cv.imread(imgRef.current);

  const maxWidth = window.innerWidth * 0.3;
  if (src.cols > maxWidth) {
    const scale = maxWidth / src.cols;
    const newSize = new cv.Size(src.cols * scale, src.rows * scale);
    let resized = new cv.Mat();
    cv.resize(src, resized, newSize, 0, 0, cv.INTER_AREA);
    src.delete();
    src = resized;
  }

  colorMatRef.current = src.clone();
  cv.imshow(leftCanvasRef.current, colorMatRef.current);

  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.imshow(rightCanvasRef.current, gray);

  grayMatRef.current = gray;
  src.delete();
};

  const handlePriorityChange = (transform, value) => {
    setPriorities((prev) => {
      const updated = { ...prev };
      if (value !== "Don't Apply") {
        for (const key in updated) {
          if (key !== transform && updated[key] === value) {
            updated[key] = "Don't Apply";
          }
        }
      }
      updated[transform] = value;
      return updated;
    });
  };

  const applyTransformations = () => {
    if (!grayMatRef.current) return alert("Upload an image first!");
    const order = Object.entries(priorities)
      .filter(([_, val]) => val !== "Don't Apply")
      .sort((a, b) => a[1].localeCompare(b[1], undefined, { numeric: true }));
    if (order.length === 0) return alert("No transformations selected!");

    let working = grayMatRef.current.clone();
    order.forEach(([transform]) => {
      let dst;
      if (transform === "rotate") dst = rotate(working);
      else if (transform === "scale") dst = scaleImage(working);
      else if (transform === "translate") dst = translate(working);
      if (dst) {
        working.delete();
        working = dst.clone();
        dst.delete();
      }
    });

    cv.imshow(rightCanvasRef.current, working);
    working.delete();

    if (!hasTransformed) {
      cv.imshow(leftCanvasRef.current, grayMatRef.current);
      setHasTransformed(true);
    }
  };

  const allDontApply = Object.values(priorities).every((v) => v === "Don't Apply");

  const renderTransformRow = (label, inputs, key) => (
    <div className="flex items-center justify-center gap-4 my-4">
      <label className="w-32 text-right font-medium">{label}</label>
      <div className="flex items-center gap-3">{inputs}</div>

      {/* --- UPDATED Select like SelectDemo --- */}
      <Select
        value={priorities[key]}
        onValueChange={(value) => handlePriorityChange(key, value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Select Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            {availablePriorities.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-2">🖼️ Image Processing Practical</h2>
      <p className=" mb-6">Upload an image and apply transformations.</p>

      <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-6 w-1/2" />
      <img ref={imgRef} alt="Upload" onLoad={handleImageLoad} style={{ display: "none" }} />

      <div className="flex justify-center gap-10 mb-10">
        <div>
          <h3 className="font-semibold mb-2">
            {hasTransformed ? "Static Grayscale" : "Original (Color)"}
          </h3>
          <canvas ref={leftCanvasRef} className="border-2 border-gray-400 rounded-lg" />
        </div>
        <div>
          <h3 className="font-semibold mb-2">
            {hasTransformed ? "Transformed Output" : "Initial Grayscale"}
          </h3>
          <canvas ref={rightCanvasRef} className="border-2 border-gray-400 rounded-lg" />
        </div>
      </div>

      <div className="max-w-xl mx-auto border p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Transformation Controls</h3>

        {renderTransformRow(
          "Rotate Angle:",
          <Input
            type="number"
            value={angle}
            onChange={(e) => setAngle(parseFloat(e.target.value))}
            disabled={priorities.rotate === "Don't Apply"}
            className="w-[100px]"
          />,
          "rotate"
        )}

        {renderTransformRow(
          "Scale Factor:",
          <Input
            type="number"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            disabled={priorities.scale === "Don't Apply"}
            className="w-[100px]"
          />,
          "scale"
        )}

        {renderTransformRow(
          "Translate (X, Y):",
          <>
            <Input
              type="number"
              value={tx}
              onChange={(e) => setTx(parseFloat(e.target.value))}
              disabled={priorities.translate === "Don't Apply"}
              className="w-[80px]"
            />
            <Input
              type="number"
              value={ty}
              onChange={(e) => setTy(parseFloat(e.target.value))}
              disabled={priorities.translate === "Don't Apply"}
              className="w-[80px]"
            />
          </>,
          "translate"
        )}

        <div className="mt-6 flex justify-center">
          <Button onClick={applyTransformations} disabled={allDontApply}>
            Apply Transformation(s)
          </Button>
        </div>
      </div>
      <MathematicsDialog/>
    </div>
  );
}

