import { useState } from "react";

export default function useRotate(cv, fileName) {
  const [angle, setAngle] = useState(45);

  const rotate = (grayMat) => {
    if (!grayMat) return null;
    const dst = new cv.Mat();
    const center = new cv.Point(grayMat.cols / 2, grayMat.rows / 2);
    const M = cv.getRotationMatrix2D(center, angle, 1);
    cv.warpAffine(grayMat, dst, M, new cv.Size(grayMat.cols, grayMat.rows));
    console.log(` Rotated ${fileName} by ${angle}°`);
    return dst;
  };

  return { angle, setAngle, rotate };
}
