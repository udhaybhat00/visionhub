"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, Maximize2, X } from "lucide-react";

type ProductImage = {
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
};

interface Props {
  images?: ProductImage[];
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  const active = images[activeIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  const imageUrls = useMemo(
    () =>
      images.map((image) => ({
        key: image._key,
        display: urlFor(image).url(),
        full: urlFor(image).width(1800).fit("max").url(),
        thumb: urlFor(image).width(220).fit("max").url(),
      })),
    [images]
  );

  const goToImage = (index: number) => {
    if (!images.length) return;

    const nextIndex = (index + images.length) % images.length;
    setActiveIndex(nextIndex);
  };

  const showPrevious = () => goToImage(activeIndex - 1);
  const showNext = () => goToImage(activeIndex + 1);

  const openViewer = (index = activeIndex) => {
    setActiveIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setDragStartX(null);
    setDragDeltaX(0);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStartX(event.clientX);
    setDragDeltaX(0);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX === null || !hasMultipleImages) return;

    setDragDeltaX(event.clientX - dragStartX);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX === null || !hasMultipleImages) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const swipeThreshold = 50;

    if (dragDeltaX > swipeThreshold) {
      showPrevious();
    } else if (dragDeltaX < -swipeThreshold) {
      showNext();
    }

    setDragStartX(null);
    setDragDeltaX(0);
  };

  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, isViewerOpen]);

  if (!active || !imageUrls.length) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 text-gray-400 md:min-h-[450px]">
        <ImageIcon className="size-10" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 md:flex-row-reverse md:items-start">
        <div className="relative min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={active?._key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative h-[340px] w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_10px_28px_rgba(15,15,15,0.06)] md:sticky md:top-24 md:h-[520px]"
            >
              <button
                type="button"
                onClick={() => openViewer(activeIndex)}
                className="relative flex h-full w-full cursor-zoom-in items-center justify-center bg-[radial-gradient(circle_at_center,#ffffff_0%,#f8fafc_72%,#f1f5f9_100%)] px-3 py-5 md:px-8"
                aria-label="Open product image gallery"
              >
                <Image
                  src={imageUrls[activeIndex].display}
                  alt={`Product image ${activeIndex + 1}`}
                  width={900}
                  height={900}
                  priority
                  className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${
                    isStock === 0 ? "opacity-50" : ""
                  }`}
                />
              </button>

              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-gray-900 shadow-sm ring-1 ring-gray-200">
                  {activeIndex + 1} / {images.length}
                </span>
                {isStock === 0 ? (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-100">
                    Out of stock
                  </span>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => openViewer(activeIndex)}
                className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-md ring-1 ring-gray-200 transition hover:bg-gray-50"
                aria-label="Expand product image"
              >
                <Maximize2 className="size-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:max-h-[520px] md:w-[74px] md:flex-col md:overflow-y-auto md:overflow-x-hidden md:pb-0 md:pr-1">
          {images.map((image, index) => (
            <button
              key={image._key}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative size-[68px] shrink-0 overflow-hidden rounded-lg border bg-white transition-all md:size-[70px] ${
                activeIndex === index
                  ? "border-shop_orange ring-2 ring-shop_orange/25"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`Show product image ${index + 1}`}
            >
              <Image
                src={imageUrls[index].thumb}
                alt={`Product thumbnail ${index + 1}`}
                fill
                sizes="70px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isViewerOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-white text-gray-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Product image gallery"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:px-6">
              <div>
                <p className="text-sm font-bold text-gray-950">
                  Product photos
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {activeIndex + 1} of {images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={closeViewer}
                className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-950 transition-colors hover:bg-gray-200"
                aria-label="Close gallery"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              {hasMultipleImages && (
                <div className="order-2 shrink-0 border-t border-gray-200 bg-white px-3 py-3 md:order-1 md:w-24 md:border-r md:border-t-0 md:px-3 md:py-5">
                  <div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pb-0">
                    {images.map((image, index) => (
                      <button
                        type="button"
                        key={image._key}
                        onClick={() => goToImage(index)}
                        className={`relative size-16 shrink-0 overflow-hidden rounded-lg border bg-white transition-all md:size-[68px] ${
                          activeIndex === index
                            ? "border-shop_orange ring-2 ring-shop_orange/25"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        aria-label={`Open image ${index + 1}`}
                      >
                        <Image
                          src={imageUrls[index].thumb}
                          alt={`Product thumbnail ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-contain p-1.5"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="relative order-1 flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden bg-gray-50 px-4 py-5 md:order-2 md:px-10 md:py-8"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
              >
                <div className="relative h-[min(62vh,620px)] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-[0_18px_60px_rgba(15,15,15,0.08)] ring-1 ring-gray-200 md:h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={imageUrls[activeIndex].key}
                      initial={{ opacity: 0, x: dragDeltaX < 0 ? 40 : -40 }}
                      animate={{ opacity: 1, x: dragDeltaX }}
                      exit={{ opacity: 0, x: dragDeltaX < 0 ? -40 : 40 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={imageUrls[activeIndex].full}
                        alt={`Product image ${activeIndex + 1}`}
                        fill
                        sizes="100vw"
                        priority
                        className="select-none object-contain p-4 md:p-8"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageView;
