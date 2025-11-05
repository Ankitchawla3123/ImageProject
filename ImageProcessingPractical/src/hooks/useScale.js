import { useState } from "react";

export default function useScale(cv, fileName) {
  const [scale, setScale] = useState(1.5);

  const scaleImage = (grayMat) => {
    if (!grayMat) return null;
    const dst = new cv.Mat();
    const newSize = new cv.Size(grayMat.cols * scale, grayMat.rows * scale);
    cv.resize(grayMat, dst, newSize, 0, 0, cv.INTER_LINEAR);
    console.log(`Scaled ${fileName} by factor of ${scale}`);
    return dst;
  };

  return { scale, setScale, scaleImage };
}
