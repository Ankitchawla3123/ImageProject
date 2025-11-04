import { useState } from "react";

export default function useTranslate(cv, fileName) {
  const [tx, setTx] = useState(50);
  const [ty, setTy] = useState(30);

  const translate = (grayMat) => {
    if (!grayMat) return null;
    const dst = new cv.Mat();
    const M = cv.matFromArray(2, 3, cv.CV_64F, [1, 0, tx, 0, 1, ty]);
    cv.warpAffine(grayMat, dst, M, new cv.Size(grayMat.cols, grayMat.rows));
    console.log(`➡️ Translated ${fileName} by (${tx}, ${ty})`);
    return dst;
  };

  return { tx, ty, setTx, setTy, translate };
}
