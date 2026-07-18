"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Check,
  ChevronLeft,
  Eye,
  Loader2,
  Lock,
  Minus,
  Move,
  Plus,
  RotateCcw,
  RotateCw,
  ShoppingBag,
  Sparkles,
  Star,
  Unlock,
  X,
} from "lucide-react";
import { defineQuery } from "next-sanity";

import { Product } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import PriceFormatter from "@/components/PriceFormatter";
import AddToCartButton from "@/components/AddToCartButton";
import useCartStore from "@/store";
import { client } from "@/sanity/lib/client";
import { productImageUrl } from "@/sanity/lib/image";

type FrameFit = {
  left: number;
  top: number;
  width: number;
  rotation: number;
  opacity: number;
};

type FaceLandmark = {
  x: number;
  y: number;
  z?: number;
};

type FaceMeshResults = {
  multiFaceLandmarks?: FaceLandmark[][];
};

type FaceMeshInstance = {
  setOptions: (options: Record<string, unknown>) => void;
  onResults: (callback: (results: FaceMeshResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close?: () => void;
};

type DragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

const productQuery = defineQuery(`*[_type=="product"] | order(coalesce(sortOrder, 999999) asc, name asc)[0...24]{
  ...,
  "averageRating": math::avg(*[_type == "review" && product._ref == ^._id && status == "approved"].rating),
  "totalReviews": count(*[_type == "review" && product._ref == ^._id && status == "approved"])
}`);

const defaultFrameFit: FrameFit = {
  left: 50,
  top: 39,
  width: 44,
  rotation: 0,
  opacity: 0.94,
};

const scriptLoaders = new Map<string, Promise<void>>();
const transparentFrameCache = new Map<string, Promise<string>>();

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function midpoint(a: FaceLandmark, b: FaceLandmark) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function getAutoFrameFit(landmarks: FaceLandmark[]): FrameFit | null {
  if (!landmarks?.[33] || !landmarks?.[133] || !landmarks?.[263] || !landmarks?.[362]) {
    return null;
  }

  const leftEye = midpoint(landmarks[33], landmarks[133]);
  const rightEye = midpoint(landmarks[362], landmarks[263]);
  const noseBridge = landmarks[168] || landmarks[6] || midpoint(leftEye, rightEye);
  const centerX = (leftEye.x + rightEye.x) / 2;
  const centerY = ((leftEye.y + rightEye.y) / 2) * 0.72 + noseBridge.y * 0.28;
  const eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
  const cheekDistance =
    landmarks[234] && landmarks[454]
      ? Math.hypot(landmarks[454].x - landmarks[234].x, landmarks[454].y - landmarks[234].y)
      : eyeDistance * 2.2;
  const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const frameWidth = Math.max(eyeDistance * 282, cheekDistance * 118);

  return {
    left: clamp((1 - centerX) * 100, 16, 84),
    top: clamp((centerY + eyeDistance * 0.2) * 100, 30, 56),
    width: clamp(frameWidth, 36, 72),
    rotation: clamp((-angle * 180) / Math.PI, -18, 18),
    opacity: 0.96,
  };
}

export default function AiStylistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [frameFit, setFrameFit] = useState<FrameFit>(defaultFrameFit);
  const [isFrameLocked, setIsFrameLocked] = useState(false);
  const [isAutoFitEnabled, setIsAutoFitEnabled] = useState(true);
  const [isTrackingReady, setIsTrackingReady] = useState(false);
  const [isProductTrayOpen, setIsProductTrayOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<FaceMeshInstance | null>(null);
  const faceLoopRef = useRef<number | null>(null);
  const autoFitRef = useRef(isAutoFitEnabled);
  const lockedRef = useRef(isFrameLocked);
  const { addItem } = useCartStore();

  useEffect(() => {
    client.fetch(productQuery).then((data) => {
      const next = (data || []) as Product[];
      setProducts(next);
      setSelectedProduct(next[0] || null);
    });


    return () => {
      stopLiveCamera();
    };
  }, []);

  useEffect(() => {
    document.body.classList.add("ai-stylist-active");
    return () => {
      document.body.classList.remove("ai-stylist-active");
    };
  }, []);

  useEffect(() => {
    autoFitRef.current = isAutoFitEnabled;
  }, [isAutoFitEnabled]);

  useEffect(() => {
    lockedRef.current = isFrameLocked;
  }, [isFrameLocked]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!isLiveCamera || !video || !stream) return;

    let isMounted = true;
    video.srcObject = stream;

    const onReady = async () => {
      if (!isMounted) return;
      await video.play().catch(() => undefined);
      if (isMounted) startFaceTracking();
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      onReady();
    } else {
      video.onloadedmetadata = onReady;
    }

    return () => {
      isMounted = false;
      video.onloadedmetadata = null;
    };
  }, [isLiveCamera]);

  const frameImage = selectedProduct?.images?.[0]
    ? productImageUrl(selectedProduct.images[0], 900, 900)
    : "";
  const tryOnProducts = useMemo(() => {
    if (!selectedProduct) return products;
    return [
      selectedProduct,
      ...products.filter((product) => product._id !== selectedProduct._id),
    ];
  }, [products, selectedProduct]);

  function stopFaceTracking() {
    if (faceLoopRef.current) {
      cancelAnimationFrame(faceLoopRef.current);
      faceLoopRef.current = null;
    }

    faceMeshRef.current?.close?.();
    faceMeshRef.current = null;
    setIsTrackingReady(false);
  }

  function stopLiveCamera() {
    stopFaceTracking();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsLiveCamera(false);
    setIsCameraStarting(false);
  }

  const startFaceTracking = async () => {
    const video = videoRef.current;
    if (!video) return;

    await loadAiLibraries();
    const FaceMesh = (window as unknown as { FaceMesh?: new (config: { locateFile: (file: string) => string }) => FaceMeshInstance }).FaceMesh;

    if (!FaceMesh) {
      setIsTrackingReady(false);
      return;
    }

    stopFaceTracking();

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.62,
      minTrackingConfidence: 0.62,
    });

    faceMesh.onResults((results) => {
      const fit = results.multiFaceLandmarks?.[0]
        ? getAutoFrameFit(results.multiFaceLandmarks[0])
        : null;

      setIsTrackingReady(Boolean(fit));

      if (fit && autoFitRef.current && !lockedRef.current) {
        setFrameFit(fit);
      }
    });

    faceMeshRef.current = faceMesh;

    const detect = async () => {
      if (!faceMeshRef.current || !streamRef.current || !videoRef.current) return;

      if (videoRef.current.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        await faceMeshRef.current.send({ image: videoRef.current }).catch(() => undefined);
      }

      faceLoopRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const startLiveCamera = async () => {
    setCameraError("");
    stopLiveCamera();

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Live camera is not available in this browser.");
      return;
    }

    try {
      setIsCameraStarting(true);
      setIsAutoFitEnabled(true);
      setIsFrameLocked(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setIsLiveCamera(true);
      setIsCameraStarting(false);
    } catch (error) {
      setIsCameraStarting(false);
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Camera permission was blocked. Enable camera access to use live try-on."
          : "Camera could not start. Please try again.";
      setCameraError(message);
    }
  };

  const updateFit = (next: Partial<FrameFit>) => {
    setFrameFit((current) => ({ ...current, ...next }));
  };

  const adjustSize = (amount: number) => {
    setIsAutoFitEnabled(false);
    updateFit({ width: clamp(frameFit.width + amount, 26, 78) });
  };

  const adjustRotation = (amount: number) => {
    setIsAutoFitEnabled(false);
    updateFit({ rotation: clamp(frameFit.rotation + amount, -26, 26) });
  };

  const resetFit = () => {
    setFrameFit(defaultFrameFit);
    setIsAutoFitEnabled(true);
    setIsFrameLocked(false);
  };

  const toggleAutoFit = () => {
    setIsAutoFitEnabled((current) => {
      const next = !current;
      if (next) setIsFrameLocked(false);
      return next;
    });
  };

  const toggleLock = () => {
    setIsFrameLocked((current) => {
      const next = !current;
      if (next) setIsAutoFitEnabled(false);
      return next;
    });
  };

  const selectProduct = (product: Product, closeTray = false) => {
    setSelectedProduct(product);
    if (closeTray) setIsProductTrayOpen(false);
  };

  const buyNow = (product: Product) => {
    addItem(product);
    window.location.href = "/cart";
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-0 pb-0 pt-0 md:px-6 md:pb-16 md:pt-20 lg:px-8 lg:pt-28">
      <section className="mx-auto max-w-7xl">
        <div className="hidden lg:block">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[26px] bg-gray-950 p-5 text-white shadow-2xl sm:rounded-[36px] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> VisionHub Virtual Try-On
            </div>
           <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
  Live Frame Fitting
</h1>

<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300">
  🚧 Beta Feature
  <span className="text-amber-200/80">
    Currently under development. Results may vary while we improve accuracy.
  </span>
</div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={startLiveCamera} disabled={isCameraStarting} className="h-12 rounded-full bg-white px-6 text-gray-950 hover:bg-gray-100">
                {isCameraStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                {isCameraStarting ? "Starting Camera" : "Start Try-On"}
              </Button>
            </div>
            {cameraError && <p className="mt-3 text-sm text-amber-200">{cameraError}</p>}
          </motion.div>
        </div>

        <div className="grid min-h-screen gap-0 md:mt-4 md:min-h-0 md:gap-4 lg:grid-cols-[minmax(320px,520px)_1fr]">
          <TryOnPanel
            frameImage={frameImage}
            frameFit={frameFit}
            setFrameFit={setFrameFit}
            setIsAutoFitEnabled={setIsAutoFitEnabled}
            isCameraStarting={isCameraStarting}
            videoRef={videoRef}
            isLiveCamera={isLiveCamera}
            isFrameLocked={isFrameLocked}
            isAutoFitEnabled={isAutoFitEnabled}
            isTrackingReady={isTrackingReady}
            selectedProduct={selectedProduct}
            onStartCamera={startLiveCamera}
            onStopCamera={stopLiveCamera}
            onToggleLock={toggleLock}
            onToggleAutoFit={toggleAutoFit}
            onResetFit={resetFit}
            onAdjustSize={adjustSize}
            onAdjustRotation={adjustRotation}
            onOpenProducts={() => setIsProductTrayOpen(true)}
          />
          <ProductPanel
            products={tryOnProducts}
            selectedProduct={selectedProduct}
            setSelectedProduct={(product) => selectProduct(product)}
            buyNow={buyNow}
          />
        </div>
        <MobileProductTray
          products={tryOnProducts}
          selectedProduct={selectedProduct}
          isOpen={isProductTrayOpen}
          onClose={() => setIsProductTrayOpen(false)}
          setSelectedProduct={(product) => selectProduct(product, true)}
          buyNow={buyNow}
        />
      </section>
    </main>
  );
}

function TryOnPanel({
  frameImage,
  frameFit,
  setFrameFit,
  setIsAutoFitEnabled,
  isCameraStarting,
  videoRef,
  isLiveCamera,
  isFrameLocked,
  isAutoFitEnabled,
  isTrackingReady,
  selectedProduct,
  onStartCamera,
  onStopCamera,
  onToggleLock,
  onToggleAutoFit,
  onResetFit,
  onAdjustSize,
  onAdjustRotation,
  onOpenProducts,
}: {
  frameImage: string;
  frameFit: FrameFit;
  setFrameFit: React.Dispatch<React.SetStateAction<FrameFit>>;
  setIsAutoFitEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isCameraStarting: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLiveCamera: boolean;
  isFrameLocked: boolean;
  isAutoFitEnabled: boolean;
  isTrackingReady: boolean;
  selectedProduct: Product | null;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onToggleLock: () => void;
  onToggleAutoFit: () => void;
  onResetFit: () => void;
  onAdjustSize: (amount: number) => void;
  onAdjustRotation: (amount: number) => void;
  onOpenProducts: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const status = isFrameLocked ? "Locked" : isAutoFitEnabled ? "Auto Fit" : "Adjust";

  const getPointerPercent = (event: React.PointerEvent) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return null;

    return {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    };
  };

  const onFramePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isFrameLocked) return;

    const point = getPointerPercent(event);
    if (!point) return;

    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: point.x - frameFit.left,
      offsetY: point.y - frameFit.top,
    };

    setIsAutoFitEnabled(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onFramePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || isFrameLocked) return;

    const point = getPointerPercent(event);
    if (!point) return;

    setFrameFit((current) => ({
      ...current,
      left: clamp(point.x - drag.offsetX, 10, 90),
      top: clamp(point.y - drag.offsetY, 18, 72),
    }));
  };

  const onFramePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;

    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-gray-950 md:h-auto md:rounded-[36px] md:bg-white md:p-5 md:shadow-sm">
      <div className="hidden items-center justify-between md:flex">
        <h2 className="text-lg font-semibold text-gray-950">Virtual Try-On</h2>
        <div className="flex items-center gap-2">
          {isLiveCamera && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isFrameLocked ? "bg-gray-950 text-white" : isTrackingReady && isAutoFitEnabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
              {status}
            </span>
          )}
          {isCameraStarting && <Loader2 className="h-5 w-5 animate-spin" />}
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] text-white md:hidden">
        <Link href="/" aria-label="Back to home" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 backdrop-blur">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="rounded-full bg-black/35 px-3 py-2 text-xs font-semibold backdrop-blur">
          {isLiveCamera ? status : "Try-On"}
        </div>
        <button type="button" onClick={onOpenProducts} aria-label="Open products" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/35 backdrop-blur">
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>

      <div ref={stageRef} className="relative h-full overflow-hidden bg-gray-950 md:mt-4 md:aspect-[4/5] md:h-auto md:max-h-[760px] md:rounded-[28px]">
        {isLiveCamera ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full scale-x-[-1] object-cover" />
            <FrameOverlay
              frameImage={frameImage}
              frameFit={frameFit}
              isLocked={isFrameLocked}
              onPointerDown={onFramePointerDown}
              onPointerMove={onFramePointerMove}
              onPointerUp={onFramePointerUp}
            />
            <FitControls
              isFrameLocked={isFrameLocked}
              isAutoFitEnabled={isAutoFitEnabled}
              isTrackingReady={isTrackingReady}
              onToggleLock={onToggleLock}
              onToggleAutoFit={onToggleAutoFit}
              onResetFit={onResetFit}
              onAdjustSize={onAdjustSize}
              onAdjustRotation={onAdjustRotation}
            />
            <CameraBottomControls
              isFrameLocked={isFrameLocked}
              isAutoFitEnabled={isAutoFitEnabled}
              isCameraStarting={isCameraStarting}
              selectedProduct={selectedProduct}
              onToggleLock={onToggleLock}
              onStopCamera={onStopCamera}
              onOpenProducts={onOpenProducts}
            />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-sm text-white">
            <Camera className="mb-4 h-10 w-10" />
            <p className="max-w-xs text-base font-semibold">Live virtual try-on</p>
            <Button onClick={onStartCamera} disabled={isCameraStarting} className="mt-5 h-12 rounded-full bg-white px-6 text-black hover:bg-gray-100">
              {isCameraStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
              {isCameraStarting ? "Starting" : "Start Camera"}
            </Button>
            {isCameraStarting && <p className="mt-3 text-xs text-white/60"> </p>}
          </div>
        )}
      </div>
    </section>
  );
}

function FrameOverlay({
  frameImage,
  frameFit,
  isLocked,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  frameImage: string;
  frameFit: FrameFit;
  isLocked: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void;
}) {
  const transparentFrameImage = useTransparentFrameImage(frameImage);

  if (!frameImage) return null;

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 select-none ${isLocked ? "pointer-events-none" : "cursor-grab touch-none active:cursor-grabbing"}`}
      style={{
        left: `${frameFit.left}%`,
        top: `${frameFit.top}%`,
        width: `${frameFit.width}%`,
        rotate: `${frameFit.rotation}deg`,
        opacity: frameFit.opacity,
      }}
    >
      <div className={`relative ${isLocked ? "" : "rounded-xl ring-1 ring-white/55 ring-offset-2 ring-offset-transparent"}`}>
        <Image
          src={transparentFrameImage || frameImage}
          alt="Selected frame"
          width={520}
          height={240}
          draggable={false}
          unoptimized={Boolean(transparentFrameImage)}
          className="pointer-events-none h-auto w-full object-contain drop-shadow-2xl contrast-125"
        />
        {!isLocked && (
          <>
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
            <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full border border-gray-950 bg-white shadow" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border border-gray-950 bg-white shadow" />
          </>
        )}
      </div>
    </div>
  );
}

function FitControls({
  isFrameLocked,
  isAutoFitEnabled,
  isTrackingReady,
  onToggleLock,
  onToggleAutoFit,
  onResetFit,
  onAdjustSize,
  onAdjustRotation,
}: {
  isFrameLocked: boolean;
  isAutoFitEnabled: boolean;
  isTrackingReady: boolean;
  onToggleLock: () => void;
  onToggleAutoFit: () => void;
  onResetFit: () => void;
  onAdjustSize: (amount: number) => void;
  onAdjustRotation: (amount: number) => void;
}) {
  return (
    <div className="absolute right-4 top-24 z-30 flex flex-col overflow-hidden rounded-full bg-black/35 text-white shadow-lg backdrop-blur md:top-5">
      <button
        type="button"
        onClick={onToggleAutoFit}
        aria-label={isAutoFitEnabled ? "Turn off auto fit" : "Turn on auto fit"}
        title={isAutoFitEnabled ? "Auto fit on" : "Auto fit off"}
        className={`inline-flex h-10 w-10 items-center justify-center ${isAutoFitEnabled && isTrackingReady ? "bg-white text-gray-950" : ""}`}
      >
        <Sparkles className="h-4 w-4" />
      </button>
      <div className="h-px bg-white/15" />
      <button type="button" onClick={onToggleLock} aria-label={isFrameLocked ? "Unlock frame" : "Lock frame"} title={isFrameLocked ? "Unlock" : "Lock"} className="inline-flex h-10 w-10 items-center justify-center">
        {isFrameLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      </button>
      <div className="h-px bg-white/15" />
      <button type="button" onClick={onResetFit} aria-label="Reset frame fit" title="Reset" className="inline-flex h-10 w-10 items-center justify-center">
        <Move className="h-4 w-4" />
      </button>
      <div className="h-px bg-white/15" />
      <button type="button" onClick={() => onAdjustSize(3)} aria-label="Increase frame size" title="Larger" className="inline-flex h-10 w-10 items-center justify-center">
        <Plus className="h-4 w-4" />
      </button>
      <div className="h-px bg-white/15" />
      <button type="button" onClick={() => onAdjustSize(-3)} aria-label="Decrease frame size" title="Smaller" className="inline-flex h-10 w-10 items-center justify-center">
        <Minus className="h-4 w-4" />
      </button>
      <div className="h-px bg-white/15" />
      <button type="button" onClick={() => onAdjustRotation(-2)} aria-label="Rotate frame left" title="Rotate left" className="inline-flex h-10 w-10 items-center justify-center">
        <RotateCcw className="h-4 w-4" />
      </button>
      <div className="h-px bg-white/15" />
      <button type="button" onClick={() => onAdjustRotation(2)} aria-label="Rotate frame right" title="Rotate right" className="inline-flex h-10 w-10 items-center justify-center">
        <RotateCw className="h-4 w-4" />
      </button>
    </div>
  );
}

function CameraBottomControls({
  isFrameLocked,
  isAutoFitEnabled,
  isCameraStarting,
  selectedProduct,
  onToggleLock,
  onStopCamera,
  onOpenProducts,
}: {
  isFrameLocked: boolean;
  isAutoFitEnabled: boolean;
  isCameraStarting: boolean;
  selectedProduct: Product | null;
  onToggleLock: () => void;
  onStopCamera: () => void;
  onOpenProducts: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mb-4 rounded-2xl bg-black/35 px-4 py-3 text-white backdrop-blur">
        <button type="button" onClick={onOpenProducts} className="flex w-full items-center gap-3 text-left">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/15">
            {selectedProduct?.images?.[0] ? (
              <Image src={productImageUrl(selectedProduct.images[0], 160, 160)} alt={selectedProduct.name || "Frame"} fill className="object-contain p-2" />
            ) : (
              <ShoppingBag className="m-3 h-6 w-6" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-sm font-semibold">{selectedProduct?.name || "Choose a frame"}</p>
            <p className="text-xs text-white/70">{isFrameLocked ? "Locked" : isAutoFitEnabled ? "Auto Fit" : "Adjust"}</p>
          </div>
          <ShoppingBag className="h-4 w-4 text-white/70" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-7">
        <button type="button" onClick={onStopCamera} aria-label="Stop camera" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
          <X className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onToggleLock}
          disabled={isCameraStarting}
          aria-label={isFrameLocked ? "Unlock frame" : "Lock frame"}
          className="inline-flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20 text-white shadow-2xl backdrop-blur disabled:opacity-60"
        >
          {isFrameLocked ? <Lock className="h-8 w-8" /> : <Unlock className="h-8 w-8" />}
        </button>
        <button type="button" onClick={onOpenProducts} aria-label="Open products" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
          <ShoppingBag className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function ProductPanel({
  products,
  selectedProduct,
  setSelectedProduct,
  buyNow,
}: {
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;
  buyNow: (product: Product) => void;
}) {
  return (
    <section className="hidden space-y-4 lg:block">
      <div className="rounded-[32px] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Live Try-On</p>
            <h2 className="mt-1 text-xl font-semibold text-gray-950">Frames</h2>
          </div>
          {selectedProduct && (
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href={`/product/${selectedProduct.slug?.current}`}>
                <Eye className="mr-2 h-4 w-4" /> View
              </Link>
            </Button>
          )}
        </div>
        <div className="-mx-2 flex snap-x gap-3 overflow-x-auto px-2 pb-2 sm:gap-4">
          {products.map((product) => (
            <ProductTryOnCard
              key={product._id}
              product={product}
              isSelected={selectedProduct?._id === product._id}
              onSelect={() => setSelectedProduct(product)}
              buyNow={buyNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MobileProductTray({
  products,
  selectedProduct,
  isOpen,
  onClose,
  setSelectedProduct,
  buyNow,
}: {
  products: Product[];
  selectedProduct: Product | null;
  isOpen: boolean;
  onClose: () => void;
  setSelectedProduct: (product: Product) => void;
  buyNow: (product: Product) => void;
}) {
  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 max-h-[74dvh] rounded-t-[28px] bg-white shadow-2xl transition-transform duration-300 lg:hidden ${isOpen ? "translate-y-0" : "translate-y-[calc(100%-1.25rem)]"}`}>
      <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-gray-300" />
      <div className="flex items-center justify-between px-4 py-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-gray-400">Frames</p>
          <h2 className="line-clamp-1 text-lg font-semibold text-gray-950">{selectedProduct?.name || "Choose a frame"}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close products" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {products.map((product) => (
            <ProductTryOnCard
              key={product._id}
              product={product}
              isSelected={selectedProduct?._id === product._id}
              onSelect={() => setSelectedProduct(product)}
              buyNow={buyNow}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductTryOnCard({
  product,
  isSelected,
  onSelect,
  buyNow,
  compact = false,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  buyNow: (product: Product) => void;
  compact?: boolean;
}) {
  const productImage = product.images?.[0]
    ? productImageUrl(product.images[0], 700, 700)
    : "";
  const transparentProductImage = useTransparentFrameImage(productImage);
  const totalReviews = product.totalReviews || 0;
  const averageRating = totalReviews > 0 ? product.averageRating : null;

  return (
    <motion.article whileHover={{ y: compact ? 0 : -4 }} className={`${compact ? "min-w-[72vw]" : "min-w-[250px]"} snap-start rounded-3xl border p-3 ${isSelected ? "border-gray-950" : "border-gray-100"}`}>
      <button type="button" onClick={onSelect} className="block w-full">
        <div className="relative aspect-square rounded-2xl bg-gray-50">
          {productImage && (
            <Image
              src={transparentProductImage || productImage}
              alt={product.name || "Frame"}
              fill
              unoptimized={Boolean(transparentProductImage)}
              className="object-contain p-5"
            />
          )}
          {isSelected && (
            <span className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-950 text-white">
              <Check className="h-4 w-4" />
            </span>
          )}
        </div>
      </button>
      <p className="mt-3 line-clamp-1 font-semibold text-gray-950">{product.name}</p>
      <div className={`mt-1 flex items-center gap-1 text-xs ${averageRating ? "text-amber-600" : "text-gray-400"}`}>
        <Star className={`h-3.5 w-3.5 ${averageRating ? "fill-amber-500" : ""}`} />
        {averageRating ? `${averageRating.toFixed(1)} (${totalReviews})` : "No reviews"}
      </div>
      <div className="mt-2 flex items-center justify-between"><PriceFormatter amount={product.price || 0} />{product.discount ? <span className="text-xs font-semibold text-emerald-700">{product.discount}% off</span> : null}</div>
      <p className={`mt-1 text-xs font-medium ${(product.stock || 0) > 0 ? "text-emerald-700" : "text-red-600"}`}>{(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button asChild variant="outline" size="sm" className="rounded-full"><Link href={`/product/${product.slug?.current}`}><Eye className="mr-1 h-3.5 w-3.5" />View</Link></Button>
        <Button onClick={() => buyNow(product)} size="sm" className="rounded-full bg-gray-950 hover:bg-black"><ShoppingBag className="mr-1 h-3.5 w-3.5" />Buy</Button>
      </div>
      <div className="mt-2"><AddToCartButton product={product} className="rounded-full" /></div>
    </motion.article>
  );
}

async function loadAiLibraries() {
  if (typeof window === "undefined") return;
  await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js");
}

function useTransparentFrameImage(src: string) {
  const [processedSrc, setProcessedSrc] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!src) {
      setProcessedSrc("");
      return;
    }

    getTransparentFrameImage(src).then((nextSrc) => {
      if (isMounted) setProcessedSrc(nextSrc);
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return processedSrc;
}

function getTransparentFrameImage(src: string) {
  if (transparentFrameCache.has(src)) {
    return transparentFrameCache.get(src) as Promise<string>;
  }

  const loader = new Promise<string>((resolve) => {
    if (typeof window === "undefined") return resolve("");

    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(makeFrameBackgroundTransparent(image));
    image.onerror = () => resolve("");
    image.src = src;
  });

  transparentFrameCache.set(src, loader);
  return loader;
}

function makeFrameBackgroundTransparent(image: HTMLImageElement) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  if (!sourceWidth || !sourceHeight) return "";

  const canvas = document.createElement("canvas");
  canvas.width = sourceWidth;
  canvas.height = sourceHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return "";

  context.drawImage(image, 0, 0);

  try {
    const imageData = context.getImageData(0, 0, sourceWidth, sourceHeight);
    const { data } = imageData;
    let minX = sourceWidth;
    let minY = sourceHeight;
    let maxX = 0;
    let maxY = 0;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      const maxChannel = Math.max(red, green, blue);
      const minChannel = Math.min(red, green, blue);
      const saturation = maxChannel - minChannel;
      const isBackground =
        alpha < 12 ||
        (red > 214 && green > 214 && blue > 214 && saturation < 38) ||
        (red > 232 && green > 232 && blue > 232);

      if (isBackground) {
        data[index + 3] = 0;
        continue;
      }

      const pixelIndex = index / 4;
      const x = pixelIndex % sourceWidth;
      const y = Math.floor(pixelIndex / sourceWidth);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    if (maxX <= minX || maxY <= minY) return "";

    context.putImageData(imageData, 0, 0);

    const padding = Math.round(Math.max(sourceWidth, sourceHeight) * 0.03);
    const cropX = clamp(minX - padding, 0, sourceWidth - 1);
    const cropY = clamp(minY - padding, 0, sourceHeight - 1);
    const cropWidth = clamp(maxX - minX + padding * 2, 1, sourceWidth - cropX);
    const cropHeight = clamp(maxY - minY + padding * 2, 1, sourceHeight - cropY);
    const output = document.createElement("canvas");
    output.width = cropWidth;
    output.height = cropHeight;

    const outputContext = output.getContext("2d");
    if (!outputContext) return canvas.toDataURL("image/png");

    outputContext.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    return output.toDataURL("image/png");
  } catch {
    return "";
  }
}

function loadScript(src: string) {
  if (scriptLoaders.has(src)) {
    return scriptLoaders.get(src) as Promise<void>;
  }

  const loader = new Promise<void>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existingScript?.dataset.loaded === "true") return resolve();
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => resolve();
    document.body.appendChild(script);
  });

  scriptLoaders.set(src, loader);
  return loader;
}
