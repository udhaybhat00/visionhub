"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(images[0]);
  return (
    <div className="w-full space-y-2 md:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-[280px] md:min-h-[450px] md:max-h-[550px] border border-dark-color/10 rounded-md group overflow-hidden"
        >
          <Zoom>
  <Image
    src={urlFor(active).url()}
    alt="productImage"
    width={700}
    height={700}
    priority
    className={`w-full h-[280px] md:h-[500px] object-contain group-hover:scale-110 transition-all duration-300 rounded-md cursor-zoom-in ${
      isStock === 0 ? "opacity-50" : ""
    }`}
  />
</Zoom>
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
        {images.map((image) => (
          <button
            key={image._key}
            onClick={() => setActive(image)}
            className={`border rounded-md overflow-hidden ${
              active._key === image._key ? "ring-1 ring-dark-color" : ""
            }`}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Thumbnail ${image._key}`}
              width={100}
              height={100}
              className="w-full h-auto object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;
