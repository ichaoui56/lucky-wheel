'use client';

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';

export interface Segment {
  id: string;
  label: string;
  color: string;
  type: 'image' | 'text';
  textContent?: string;
  rotation?: number;
  marginFromCenter?: number;
  imageSize?: number;
  textContainerSize?: { width?: number; height?: number };
}

interface SpinningWheelProps {
  segments?: Segment[];
  onSpinEnd?: (segment: Segment, index: number) => void;
  onSpinStart?: () => void;
  disabled?: boolean;
  onRequestSpin?: () => void;
  spinStatus?: string;
}

export interface SpinningWheelHandle {
  spin: (targetId: string, minRotations?: number) => void;
}

const generateDefaultSegments = (): Segment[] => {
  return [
    { id: "prod-1", label: "Product 1", color: "#2c2c2c", type: 'image', rotation: 0, marginFromCenter: 140, imageSize: 80 },
    { id: "text-2", label: "Another Chance", color: "#7a4f3a", type: 'text', textContent: "Another Chance!", rotation: 90, marginFromCenter: 130, textContainerSize: { width: 130, height: 35 } },
    { id: "prod-3", label: "Product 3", color: "#3a5a7a", type: 'image', rotation: 0, marginFromCenter: 150, imageSize: 80 },
    { id: "text-4", label: "200DH Card", color: "#4a7a3a", type: 'text', textContent: "200DH Card", rotation: 90, marginFromCenter: 120, textContainerSize: { width: 100, height: 35 } },
    { id: "prod-5", label: "Product 5", color: "#7a3a5a", type: 'image', rotation: 0, marginFromCenter: 150, imageSize: 70 },
    { id: "text-6", label: "Another Chance", color: "#5a3a7a", type: 'text', textContent: "Another Chance!", rotation: 90, marginFromCenter: 130, textContainerSize: { width: 130, height: 35 } },
    { id: "prod-7", label: "Product 7", color: "#7a6a3a", type: 'image', rotation: 0, marginFromCenter: 150, imageSize: 65 },
    { id: "text-8", label: "200DH Card", color: "#3a6a6a", type: 'text', textContent: "200DH Card", rotation: 90, marginFromCenter: 120, textContainerSize: { width: 105, height: 36 } },
    { id: "prod-9", label: "Product 9", color: "#6a3a7a", type: 'image', rotation: 0, marginFromCenter: 150, imageSize: 75 },
    { id: "text-10", label: "500DH Card", color: "#7a3a3a", type: 'text', textContent: "500DH Card", rotation: 90, marginFromCenter: 130, textContainerSize: { width: 115, height: 42 } },
  ];
};

const DEFAULT_SEGMENTS = generateDefaultSegments();

// Ease out - slow end
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

const SpinningWheel = forwardRef<SpinningWheelHandle, SpinningWheelProps>(({
  segments = DEFAULT_SEGMENTS,
  onSpinEnd,
  onSpinStart,
  disabled = false,
  onRequestSpin,
  spinStatus = "ONE SHOT",
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const spinningRef = useRef(false);
  const rotationRef = useRef(0); // current wheel rotation in radians
  const imageCacheRef = useRef<(HTMLImageElement | null)[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const [imagesReady, setImagesReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const N = segments.length;
  const STEP = (Math.PI * 2) / N; // angle per segment
  const FILLS = ["#FCF6ED", "#F4ECDE"];
  const STROKE = "#DCCB9E";

  // The pointer sits at the TOP of the wheel = angle -π/2 in canvas coords
  const POINTER_ANGLE = -Math.PI / 2;

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<void>[] = [];
      for (let i = 0; i < N; i++) {
        if (segments[i].type === 'image') {
          const img = new Image();
          const imageUrl = `/products/product-${i + 1}.jpg`;
          img.src = imageUrl;
          const promise = new Promise<void>((resolve) => {
            img.onload = () => { imagesLoadedRef.current[i] = true; resolve(); };
            img.onerror = () => { imagesLoadedRef.current[i] = false; resolve(); };
          });
          imagePromises.push(promise);
          imageCacheRef.current[i] = img;
        } else {
          imagesLoadedRef.current[i] = true;
        }
      }
      await Promise.all(imagePromises);
      setImagesReady(true);
    };
    loadImages();
  }, [N, segments]);

  const drawSegment = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, start: number, end: number, fill: string) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  };

  const drawTextSegment = (
    ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number,
    midAngle: number, text: string, rotation?: number,
    marginFromCenter?: number, textContainerSize?: { width?: number; height?: number }
  ) => {
    const dist = marginFromCenter !== undefined ? marginFromCenter : radius * 0.35;
    const px = cx + Math.cos(midAngle) * dist;
    const py = cy + Math.sin(midAngle) * dist;
    ctx.save();
    ctx.translate(px, py);
    let textAngle = midAngle + Math.PI / 2;
    if (rotation !== undefined) textAngle += (rotation * Math.PI) / 180;
    if (textAngle > Math.PI / 2 && textAngle < (3 * Math.PI) / 2) textAngle += Math.PI;
    ctx.rotate(textAngle);
    const fontSize = textContainerSize?.height ? Math.min(textContainerSize.height * 0.4, 20) : Math.max(radius * 0.09, 14);
    ctx.font = `bold ${fontSize}px "Georgia", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.2;
    const padding = fontSize * 0.3;
    const totalHeight = textContainerSize?.height || (lines.length * lineHeight + padding * 2);
    const maxWidth = textContainerSize?.width || (Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.strokeStyle = "#d4a840";
    ctx.lineWidth = 2;
    const bgX = -maxWidth / 2, bgY = -totalHeight / 2, r = 8;
    ctx.beginPath();
    ctx.moveTo(bgX + r, bgY);
    ctx.lineTo(bgX + maxWidth - r, bgY);
    ctx.quadraticCurveTo(bgX + maxWidth, bgY, bgX + maxWidth, bgY + r);
    ctx.lineTo(bgX + maxWidth, bgY + totalHeight - r);
    ctx.quadraticCurveTo(bgX + maxWidth, bgY + totalHeight, bgX + maxWidth - r, bgY + totalHeight);
    ctx.lineTo(bgX + r, bgY + totalHeight);
    ctx.quadraticCurveTo(bgX, bgY + totalHeight, bgX, bgY + totalHeight - r);
    ctx.lineTo(bgX, bgY + r);
    ctx.quadraticCurveTo(bgX, bgY, bgX + r, bgY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
    const gradient = ctx.createLinearGradient(0, -totalHeight / 2, 0, totalHeight / 2);
    gradient.addColorStop(0, "#2a1804");
    gradient.addColorStop(1, "#6a4020");
    ctx.fillStyle = gradient;
    const totalTextHeight = lines.length * lineHeight;
    const startY = -totalTextHeight / 2;
    lines.forEach((line, idx) => {
      ctx.fillText(line, 0, startY + idx * lineHeight + lineHeight / 2);
    });
    ctx.shadowColor = "transparent";
    ctx.restore();
  };

  const drawProductImage = (
    ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number,
    midAngle: number, segmentIndex: number, fallbackColor: string,
    rotation?: number, marginFromCenter?: number, imageSize?: number
  ) => {
    const dist = marginFromCenter !== undefined ? marginFromCenter : radius * 0.58;
    const px = cx + Math.cos(midAngle) * dist;
    const py = cy + Math.sin(midAngle) * dist;
    const size = imageSize || radius * 0.32;
    ctx.save();
    ctx.translate(px, py);
    let imageAngle = midAngle + Math.PI / 2;
    if (rotation !== undefined) imageAngle += (rotation * Math.PI) / 180;
    ctx.rotate(imageAngle);
    const img = imageCacheRef.current[segmentIndex];
    const imageLoaded = img && img.complete && img.naturalWidth > 0;
    if (imageLoaded && imagesReady) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const targetSize = size * 1.6;
      const ratio = img.naturalWidth / img.naturalHeight;
      const dw = ratio >= 1 ? targetSize : targetSize * ratio;
      const dh = ratio >= 1 ? targetSize / ratio : targetSize;
      ctx.shadowColor = "rgba(0,0,0,0.15)"; ctx.shadowBlur = 5;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      ctx.shadowColor = "transparent";
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = fallbackColor;
      ctx.fill();
    }
    ctx.restore();
  };

  const drawOuterDots = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * (radius + 12), cy + Math.sin(a) * (radius + 12), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#D4B98C";
      ctx.fill();
    }
  };

  const drawHub = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    ctx.save();
    const hr = radius * 0.12;
    ctx.beginPath();
    ctx.arc(cx, cy, hr, 0, Math.PI * 2);
    ctx.fillStyle = "#e3d4b5"; ctx.fill();
    ctx.strokeStyle = "#c9aa5f"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#aa8c54";
    const m = hr * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - m); ctx.lineTo(cx + m * 0.55, cy);
    ctx.lineTo(cx, cy + m); ctx.lineTo(cx - m * 0.55, cy);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, hr * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "#e8d8b0"; ctx.fill();
    ctx.restore();
  };

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    const { width, height } = dimensions;
    const cx = width / 2, cy = height / 2;
    const radius = Math.min(width, height) * 0.44;
    const rotation = rotationRef.current;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);
    for (let i = 0; i < N; i++) {
      drawSegment(ctx, cx, cy, radius, i * STEP, (i + 1) * STEP, FILLS[i % 2]);
    }
    for (let i = 0; i < N; i++) {
      const mid = i * STEP + STEP / 2;
      const seg = segments[i];
      if (seg.type === 'image') {
        drawProductImage(ctx, cx, cy, radius, mid, i, seg.color, seg.rotation, seg.marginFromCenter, seg.imageSize);
      } else if (seg.type === 'text' && seg.textContent) {
        drawTextSegment(ctx, cx, cy, radius, mid, seg.textContent, seg.rotation, seg.marginFromCenter, seg.textContainerSize);
      }
    }
    ctx.restore();
    drawOuterDots(ctx, cx, cy, radius);
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = "#EAD6B0"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
    ctx.stroke();
    drawHub(ctx, cx, cy, radius);
  }, [dimensions, N, STEP, segments, imagesReady]);

  /**
   * CORE TARGETING MATH
   *
   * The wheel draws segment i starting at angle (i * STEP) in the wheel's LOCAL frame.
   * The mid-angle of segment i in local frame = i * STEP + STEP/2
   *
   * When the wheel has rotation R applied, a point at local angle A
   * appears at canvas angle (A + R).
   *
   * The pointer is fixed at canvas angle POINTER_ANGLE = -π/2 (top).
   *
   * We want: midAngle_local + R_final ≡ POINTER_ANGLE  (mod 2π)
   * => R_final = POINTER_ANGLE - midAngle_local  (mod 2π)
   *
   * Then we add full extra rotations so the wheel spins visibly.
   */
  const spinToSegmentId = useCallback((targetId: string, minRotations: number = 5) => {
    if (spinningRef.current) return;

    const targetIndex = segments.findIndex(seg => seg.id === targetId);
    if (targetIndex === -1) {
      console.error(`Segment id "${targetId}" not found`);
      return;
    }

    spinningRef.current = true;
    onSpinStart?.();

    // Mid-angle of the target segment in the wheel's local (unrotated) frame
    const midAngleLocal = targetIndex * STEP + STEP / 2;

    // The exact final rotation needed so pointer lands on target mid
    // R_final = POINTER_ANGLE - midAngleLocal  (normalized to [0, 2π])
    const R_final_base = ((POINTER_ANGLE - midAngleLocal) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

    // Current rotation normalized to [0, 2π]
    const R_current = ((rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    // How much to rotate from current position to reach R_final_base
    // We always spin FORWARD (positive direction)
    let delta = R_final_base - R_current;
    if (delta <= 0) delta += Math.PI * 2; // ensure forward spin
    if (delta < 0.01) delta += Math.PI * 2; // avoid near-zero spin

    // Add the mandatory extra full rotations (always forward)
    const extraFullRotations = minRotations * Math.PI * 2;
    const totalDelta = extraFullRotations + delta;

    const startRot = rotationRef.current;
    const endRot = startRot + totalDelta;
    const duration = 5500; // ms
    const startTime = performance.now();

    console.log(`[Spin] target="${targetId}" index=${targetIndex} midLocal=${(midAngleLocal * 180 / Math.PI).toFixed(1)}° R_final=${(R_final_base * 180 / Math.PI).toFixed(1)}° delta=${(delta * 180 / Math.PI).toFixed(1)}° totalDelta=${(totalDelta * 180 / Math.PI).toFixed(1)}°`);

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(t);
      rotationRef.current = startRot + eased * totalDelta;
      drawWheel();

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        // Lock to exact target
        rotationRef.current = endRot;
        drawWheel();
        spinningRef.current = false;
        animationRef.current = null;

        // Verify landing
        const finalRot = ((endRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const landedIndex = segments.findIndex((_, i) => {
          const segStart = ((i * STEP + finalRot) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          const segEnd = (((i + 1) * STEP + finalRot) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
          const ptr = ((POINTER_ANGLE % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          if (segStart < segEnd) return ptr >= segStart && ptr < segEnd;
          return ptr >= segStart || ptr < segEnd;
        });
        console.log(`[Spin] landed on index=${landedIndex} id=${segments[landedIndex]?.id}`);
        onSpinEnd?.(segments[targetIndex], targetIndex);
      }
    };

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(animateFrame);
  }, [segments, STEP, POINTER_ANGLE, drawWheel, onSpinEnd, onSpinStart]);

  useImperativeHandle(ref, () => ({
    spin: spinToSegmentId,
  }));

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const size = Math.min(containerRef.current.clientWidth, 800);
        setDimensions({ width: size, height: size });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      canvas.style.width = `${dimensions.width}px`;
      canvas.style.height = `${dimensions.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) { ctx.scale(dpr, dpr); drawWheel(); }
    }
  }, [dimensions, drawWheel]);

  useEffect(() => {
    if (imagesReady) drawWheel();
  }, [imagesReady, drawWheel]);

  useEffect(() => {
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-6 gap-4">
      <div className="text-center mb-2">
        <div className="inline-block px-6 py-2 bg-gradient-to-r from-[#d4b898] to-[#c9a96e] rounded-full shadow-md">
          <span className="text-white font-bold text-sm tracking-wider">{spinStatus}</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{ width: dimensions.width, height: dimensions.height, zIndex: 20 }}
      >
        {/* Pointer arrow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[36px] border-l-transparent border-r-transparent" style={{ borderTopColor: "#C9A96E" }} />
        </div>
        <canvas
          ref={canvasRef}
          className={`rounded-full shadow-xl transition-all duration-200 hover:shadow-2xl ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-90'} ${isAnimating ? 'animate-pulse scale-105 shadow-3xl' : ''}`}
          style={{
            boxShadow: "0 15px 45px -12px rgba(0,0,0,0.2), 0 0 0 2px rgba(210,180,130,0.3)",
            width: '100%',
            height: '100%'
          }}
          onClick={() => {
            if (!disabled && !isAnimating) {
              setIsAnimating(true);
              onRequestSpin?.();
              setTimeout(() => setIsAnimating(false), 200); // Reset animation after 200ms
            }
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "min(350px, 75vw)", marginTop: "-20px", zIndex: 10 }}>
        <div style={{ width: "85px", height: "22px", background: "linear-gradient(180deg, #e8cdb0 0%, #d4b898 100%)", clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)" }} />
        <div style={{ width: "100%", height: "14px", background: "linear-gradient(180deg, #f0dfc8 0%, #e0c9a8 100%)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0", marginTop: "-1px" }} />
        <div style={{ width: "100%", background: "linear-gradient(180deg, #eedec8 0%, #e8cdb0 40%, #d4b898 100%)", borderRadius: "0 0 20px 20px", padding: "16px 24px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 700, letterSpacing: "0.2em", color: "#6a4020", textAlign: "center" }}>
            {spinStatus.includes("YOU WON 500 DH!") ? "YOU WON 500 DH!" : spinStatus}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(140,80,20,0.25)" }} />
            <span style={{ color: "#b09070", fontSize: "12px" }}>✦</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(140,80,20,0.25)" }} />
          </div>
        </div>
        <div style={{ width: "85%", height: "12px", background: "linear-gradient(180deg, #c8a888 0%, #b09070 100%)", borderRadius: "0 0 40% 40% / 0 0 100% 100%", marginTop: "-1px" }} />
      </div>
    </div>
  );
});

SpinningWheel.displayName = 'SpinningWheel';

export default SpinningWheel;