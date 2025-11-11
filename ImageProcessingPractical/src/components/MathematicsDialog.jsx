import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

export default function MathematicsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-6">
          📘 Mathematics Used
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mathematics Used</DialogTitle>
          <DialogDescription>
            The core mathematical principles behind image transformations:
            matrix representation, grayscale conversion, rotation, scaling, and translation.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-sm space-y-6 leading-relaxed">

          {/* 1. Image as Matrix */}
          <section>
            <h3 className="font-semibold text-3xl mb-2">🧩 1️⃣ Image as a Matrix</h3>
            <p>
              In digital image processing, an image is represented as a matrix of pixels.
              For a color image, each pixel has three intensity values:
            </p>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s overflow-x-auto">
I(x, y) = [ R(x, y), G(x, y), B(x, y) ]
            </pre>
            <p>
              For a grayscale image, each pixel contains a single intensity value:
            </p>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">I(x, y)</pre>
            <p>
              Each pixel can be represented as a coordinate-intensity triplet:
              <br />
              <code>(x, y, I)</code> — where <code>x</code> and <code>y</code> are coordinates,
              and <code>I</code> is the pixel intensity (0–255).
            </p>
          </section>

          <hr className="border-t border-gray-500 my-6" />

          {/* 2. Grayscale */}
          <section>
            <h3 className="font-semibold text-3xl mb-2">🎨 2️⃣ Grayscale Conversion</h3>
            <p>
              To convert a color image to grayscale, the RGB channels are combined using
              a weighted sum that reflects human visual perception:
            </p>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
Gray = 0.299 × R + 0.587 × G + 0.114 × B
            </pre>
            <p>
              This formula gives a single brightness value per pixel, forming a 2D matrix.
            </p>
          </section>

          <hr className="border-t border-gray-500 my-6" />

          {/* 3. Matrix Representation */}
          <section>
            <h3 className="font-semibold text-3xl mb-2">🧮 3️⃣ Matrix Representation</h3>
            <p>
              Image transformations such as rotation, scaling, and translation can be
              represented using homogeneous coordinates:
            </p>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
[x', y', I']ᵀ = T × [x, y, I]ᵀ
            </pre>
            <p>
              Each transformation has its own transformation matrix <code>T</code>.
            </p>
          </section>

          <hr className="border-t border-gray-500 my-6" />

          {/* Rotation */}
          <section>
            <h3 className="font-semibold text-3xl mb-2">🔄 Rotation</h3>
            <p>
              Rotation is a linear transformation that turns every point in the image
              around a pivot point (usually the image center).
            </p>

            <h4 className="text-lg mt-2">1️⃣ Rotation Matrix</h4>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
[ x' ]   [ cosθ  -sinθ  0 ] [ x ]{"\n"}
[ y' ] = [ sinθ   cosθ  0 ] [ y ]{"\n"}
[ I  ]   [  0      0    1 ] [ I ]
            </pre>
            <p>Therefore:</p>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
x' = x·cosθ − y·sinθ{"\n"}
y' = x·sinθ + y·cosθ
            </pre>

            <h4 className="text-lg mt-2">2️⃣ Rotation Around Image Center</h4>
            <p>
              Since images are indexed from the top-left corner (0,0), we must adjust
              to rotate around the image’s center <code>(cx, cy)</code>:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Translate point to origin: <code>x₀ = x − cx, y₀ = y − cy</code></li>
              <li>Apply rotation using matrix above.</li>
              <li>Translate back: <code>x' = x₀' + cx, y' = y₀' + cy</code></li>
            </ul>


          </section>

          <hr className="border-t border-gray-500 my-6" />

          {/* Scaling */}
          <section>
            <h3 className="font-semibold text-3xl mb-2">📏 Scaling</h3>
            <p>
              Scaling changes the size of an image by stretching or shrinking it
              along the x-axis and y-axis.
            </p>

            <h4 className="text-lg mt-2">1️⃣ Scaling Matrix</h4>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
[ x' ]   [ Sx  0   0 ] [ x ]{"\n"}
[ y' ] = [ 0   Sy  0 ] [ y ]{"\n"}
[ I  ]   [ 0   0   1 ] [ I ]
            </pre>
            <p>
              So, <code>x' = Sx × x</code> and <code>y' = Sy × y</code><br />
              where Sx and Sy are scaling factors for horizontal and vertical directions.
            </p>

            <h4 className="text-lg mt-2">2️⃣ Reverse Mapping</h4>
            <p>
              To avoid holes and overlapping pixels, reverse mapping is used:
            </p>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
x = x′ / Sx{"\n"}
y = y′ / Sy
            </pre>
            <p>
              For each output pixel (x′, y′), the corresponding source pixel (x, y)
              is fetched from the original image.
            </p>

            <h4 className="text-lg mt-2">3️⃣ Bilinear Interpolation</h4>
            <p>
              Often, (x, y) are fractional (e.g., 1.5, 2.3). Since pixel positions are discrete,
              the intensity is computed as a weighted average of the 4 nearest pixels:
            </p>
            <br />
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
I(x, y) ≈ (1 - a)(1 - b)·I(x₁, y₁){"\n"}
         + a(1 - b)·I(x₂, y₁){"\n"}
         + (1 - a)b·I(x₁, y₂){"\n"}
         + a·b·I(x₂, y₂)
            </pre>
            <br />
            <p>
              where:
              <ul className="list-disc list-inside space-y-1">
                <li><code>(x₁, y₁)</code>, <code>(x₂, y₂)</code> are nearest integer neighbors.</li>
                <li><code>a = x − ⌊x⌋</code>, <code>b = y − ⌊y⌋</code> are fractional parts.</li>
              </ul>
              <br />
              This ensures smooth scaling without blocky edges.
            </p>
          </section>

          <hr className="border-t border-gray-500 my-6" />

          {/* Translation */}
          <section>
            <h3 className="font-semibold text-3xl mb-2">📦 Translation</h3>
            <p>
              Translation shifts the image by a fixed distance along the x and y axes.
            </p>

            <h4 className="text-lg mt-2">1️⃣ Translation Matrix</h4>
            <pre className="bg-gray-700 mt-2 mb-2 p-2 rounded-md text-s">
[ x' ]   [ 1  0  Tx ] [ x ]{"\n"}
[ y' ] = [ 0  1  Ty ] [ y ]{"\n"}
[ I  ]   [ 0  0  1  ] [ I ]
            </pre>
            <p>
              This moves each pixel by Tx units horizontally and Ty units vertically:
              <br />
              <code>(x′, y′) = (x + Tx, y + Ty)</code>
            </p>
            <p>
              Pixels shifted outside the boundary are filled with black (intensity 0).
            </p>
          </section>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="default">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
