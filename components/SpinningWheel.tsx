'use client';

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';

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
  hasWon?: boolean; // Add prop to know if user has already won
}

export interface SpinningWheelHandle {
  spin: (targetId: string, minRotations?: number) => void;
}

// Responsive segment generator that scales based on wheel size
const generateResponsiveSegments = (wheelSize: number): Segment[] => {
  // Scale factor based on wheel size (base size is 500px)
  const scaleFactor = wheelSize / 500;
  
  // Helper to scale margin from center
  const scaleMargin = (baseMargin: number) => baseMargin * scaleFactor;
  
  // Helper to scale image size
  const scaleImageSize = (baseSize: number) => baseSize * scaleFactor;
  
  // Helper to scale text container dimensions
  const scaleTextContainer = (baseWidth: number, baseHeight: number) => ({
    width: baseWidth * scaleFactor,
    height: baseHeight * scaleFactor
  });

  return [
    { 
      id: "prod-1", 
      label: "Product 1", 
      color: "#2c2c2c", 
      type: 'image', 
      rotation: 0, 
      marginFromCenter: scaleMargin(140), 
      imageSize: scaleImageSize(80) 
    },
    { 
      id: "text-2", 
      label: "Another Chance", 
      color: "#7a4f3a", 
      type: 'text', 
      textContent: "Another Chance!", 
      rotation: 90, 
      marginFromCenter: scaleMargin(130), 
      textContainerSize: scaleTextContainer(130, 35)
    },
    { 
      id: "prod-3", 
      label: "Product 3", 
      color: "#3a5a7a", 
      type: 'image', 
      rotation: 0, 
      marginFromCenter: scaleMargin(150), 
      imageSize: scaleImageSize(80) 
    },
    { 
      id: "text-4", 
      label: "200DH Card", 
      color: "#4a7a3a", 
      type: 'text', 
      textContent: "200DH Card", 
      rotation: 90, 
      marginFromCenter: scaleMargin(120), 
      textContainerSize: scaleTextContainer(100, 35)
    },
    { 
      id: "prod-5", 
      label: "Product 5", 
      color: "#7a3a5a", 
      type: 'image', 
      rotation: 0, 
      marginFromCenter: scaleMargin(150), 
      imageSize: scaleImageSize(70) 
    },
    { 
      id: "text-6", 
      label: "Another Chance", 
      color: "#5a3a7a", 
      type: 'text', 
      textContent: "Another Chance!", 
      rotation: 90, 
      marginFromCenter: scaleMargin(130), 
      textContainerSize: scaleTextContainer(130, 35)
    },
    { 
      id: "prod-7", 
      label: "Product 7", 
      color: "#7a6a3a", 
      type: 'image', 
      rotation: 0, 
      marginFromCenter: scaleMargin(150), 
      imageSize: scaleImageSize(65) 
    },
    { 
      id: "text-8", 
      label: "200DH Card", 
      color: "#3a6a6a", 
      type: 'text', 
      textContent: "200DH Card", 
      rotation: 90, 
      marginFromCenter: scaleMargin(120), 
      textContainerSize: scaleTextContainer(105, 36)
    },
    { 
      id: "prod-9", 
      label: "Product 9", 
      color: "#6a3a7a", 
      type: 'image', 
      rotation: 0, 
      marginFromCenter: scaleMargin(150), 
      imageSize: scaleImageSize(75) 
    },
    { 
      id: "text-10", 
      label: "500DH Card", 
      color: "#7a3a3a", 
      type: 'text', 
      textContent: "500DH Card", 
      rotation: 90, 
      marginFromCenter: scaleMargin(130), 
      textContainerSize: scaleTextContainer(115, 42)
    },
  ];
};

// Default segments for initial render (will be replaced when dimensions are known)
const DEFAULT_SEGMENTS = generateResponsiveSegments(500);

// Ease out - slow end
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

const SpinningWheel = forwardRef<SpinningWheelHandle, SpinningWheelProps>(({
  segments: externalSegments,
  onSpinEnd,
  onSpinStart,
  disabled = false,
  onRequestSpin,
  spinStatus = "ONE SHOT",
  hasWon = false,
}, ref) => {
  const router = useRouter();
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
  
  // Use responsive segments based on wheel size, or external segments if provided
  const segments = externalSegments || generateResponsiveSegments(dimensions.width);

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
    ctx.lineWidth = Math.max(1, dimensions.width * 0.0024); // Responsive stroke width
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
    const fontSize = textContainerSize?.height 
      ? Math.min(textContainerSize.height * 0.4, dimensions.width * 0.04) 
      : Math.max(radius * 0.09, dimensions.width * 0.028);
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
    ctx.lineWidth = Math.max(1.5, dimensions.width * 0.004);
    const bgX = -maxWidth / 2, bgY = -totalHeight / 2, r = Math.max(6, dimensions.width * 0.016);
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
    ctx.shadowBlur = Math.max(3, dimensions.width * 0.008);
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
      ctx.shadowColor = "rgba(0,0,0,0.15)"; 
      ctx.shadowBlur = Math.max(4, dimensions.width * 0.01);
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
    const dotSize = Math.max(2.5, dimensions.width * 0.007);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * (radius + dimensions.width * 0.024), cy + Math.sin(a) * (radius + dimensions.width * 0.024), dotSize, 0, Math.PI * 2);
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
    ctx.strokeStyle = "#c9aa5f"; 
    ctx.lineWidth = Math.max(1.5, dimensions.width * 0.004); 
    ctx.stroke();
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
    ctx.arc(cx, cy, radius + dimensions.width * 0.012, 0, Math.PI * 2);
    ctx.strokeStyle = "#EAD6B0"; 
    ctx.lineWidth = Math.max(2, dimensions.width * 0.005); 
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - dimensions.width * 0.004, 0, Math.PI * 2);
    ctx.stroke();
    drawHub(ctx, cx, cy, radius);
  }, [dimensions, N, STEP, segments, imagesReady]);

  const spinToSegmentId = useCallback((targetId: string, minRotations: number = 5) => {
    if (spinningRef.current) return;

    const targetIndex = segments.findIndex(seg => seg.id === targetId);
    if (targetIndex === -1) {
      console.error(`Segment id "${targetId}" not found`);
      return;
    }

    spinningRef.current = true;
    onSpinStart?.();

    const midAngleLocal = targetIndex * STEP + STEP / 2;
    const R_final_base = ((POINTER_ANGLE - midAngleLocal) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const R_current = ((rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let delta = R_final_base - R_current;
    if (delta <= 0) delta += Math.PI * 2;
    if (delta < 0.01) delta += Math.PI * 2;

    const extraFullRotations = minRotations * Math.PI * 2;
    const totalDelta = extraFullRotations + delta;
    const startRot = rotationRef.current;
    const endRot = startRot + totalDelta;
    const duration = 5500;
    const startTime = performance.now();

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(t);
      rotationRef.current = startRot + eased * totalDelta;
      drawWheel();

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        rotationRef.current = endRot;
        drawWheel();
        spinningRef.current = false;
        animationRef.current = null;
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
        const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;
        
        // Different sizing strategies for mobile vs desktop
        const isMobile = window.innerWidth < 640;
        const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;
        
        let size: number;
        
        if (isMobile) {
          // Mobile: Max 85% of parent width, capped at 400px
          const maxSize = Math.min(parentWidth - 32, 400);
          size = Math.min(maxSize, window.innerHeight * 0.45);
        } else if (isTablet) {
          // Tablet: Max 80% of parent width, capped at 500px
          const maxSize = Math.min(parentWidth - 40, 500);
          size = Math.min(maxSize, window.innerHeight * 0.5);
        } else {
          // Desktop: Fixed at 550px for optimal visibility
          size = 550;
        }
        
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
  }, [imagesReady, drawWheel, segments]);

  useEffect(() => {
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, []);

  // Calculate holder width based on wheel size
  const holderWidth = dimensions.width * 0.7;
  const topKnobWidth = dimensions.width * 0.17;
  const bottomKnobWidth = dimensions.width * 0.6;

  // Determine if we're on desktop for additional spacing
  const isDesktop = dimensions.width >= 550;

  const handleClaimPrize = () => {
    router.push('/winning-info');
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full ${isDesktop ? 'py-8' : 'py-4 md:py-6'} gap-3 md:gap-4`}>
      {/* Status Badge or Winner Button */}
      <div className={`text-center ${isDesktop ? 'mb-3' : 'mb-1 md:mb-2'}`}>
        {hasWon ? (
          // Winner button that redirects to winning-info page
          <button
            onClick={handleClaimPrize}
            className="group relative inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <svg 
              className="w-5 h-5 text-white animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span className="text-white font-bold text-sm md:text-base tracking-wider">
              🎉 CLAIM YOUR 500 DH PRIZE!
            </span>
            <svg 
              className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        ) : (
          // Regular status badge
          <div className={`inline-block ${isDesktop ? 'px-8 py-3' : 'px-4 md:px-6 py-1.5 md:py-2'} bg-gradient-to-r from-[#d4b898] to-[#c9a96e] rounded-full shadow-md`}>
            <span className={`text-white font-bold ${isDesktop ? 'text-base' : 'text-xs md:text-sm'} tracking-wider`}>
              {spinStatus}
            </span>
          </div>
        )}
      </div>

      {/* Combined Wheel and Holder Container */}
      <div 
        className="relative flex flex-col items-center px-4" 
        style={{ 
          width: '100%', 
          maxWidth: isDesktop ? dimensions.width + 64 : dimensions.width + 32 
        }}
      >
        {/* Wheel Container */}
        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ width: dimensions.width, height: dimensions.height, zIndex: 20 }}
        >
          {/* Pointer arrow at top - responsive sizing */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 md:-translate-y-3 z-10">
            <div 
              className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] sm:border-l-[15px] sm:border-r-[15px] sm:border-t-[28px] md:border-l-[20px] md:border-r-[20px] md:border-t-[36px] border-l-transparent border-r-transparent" 
              style={{ borderTopColor: hasWon ? "#10B981" : "#C9A96E" }} 
            />
          </div>
          <canvas
            ref={canvasRef}
            className={`rounded-full shadow-xl transition-all duration-200 ${!disabled && !hasWon ? 'cursor-pointer hover:shadow-2xl' : 'cursor-not-allowed opacity-90'} ${isAnimating ? 'animate-pulse scale-105 shadow-3xl' : ''}`}
            style={{
              boxShadow: isDesktop 
                ? "0 20px 60px -12px rgba(0,0,0,0.25), 0 0 0 3px rgba(210,180,130,0.4)" 
                : "0 15px 45px -12px rgba(0,0,0,0.2), 0 0 0 2px rgba(210,180,130,0.3)",
              width: '100%',
              height: '100%'
            }}
            onClick={() => {
              if (!disabled && !hasWon && !isAnimating) {
                setIsAnimating(true);
                onRequestSpin?.();
                setTimeout(() => setIsAnimating(false), 200);
              }
            }}
          />
        </div>

        {/* Decorative Holder - now responsive and attached to wheel */}
        <div 
          className="flex flex-col items-center"
          style={{ 
            width: holderWidth,
            marginTop: `-${dimensions.width * 0.04}px`,
            zIndex: 10 
          }}
        >
          {/* Top knob */}
          <div 
            style={{ 
              width: topKnobWidth, 
              height: dimensions.width * 0.044,
              background: hasWon 
                ? "linear-gradient(180deg, #e8cdb0 0%, #d4b898 100%)" 
                : "linear-gradient(180deg, #e8cdb0 0%, #d4b898 100%)", 
              clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)" 
            }} 
          />
          
          {/* Upper curved connector */}
          <div 
            style={{ 
              width: "100%", 
              height: dimensions.width * 0.028,
              background: hasWon 
                ? "linear-gradient(180deg, #e8cdb0 0%, #d4b898 100%)" 
                : "linear-gradient(180deg, #e8cdb0 0%, #d4b898 100%)", 
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0", 
              marginTop: "-1px" 
            }} 
          />
          
          {/* Main holder body with status text */}
          <div 
            style={{ 
              width: "100%", 
              background: hasWon 
                ? "linear-gradient(180deg, #eedec8 0%, #e8cdb0 40%, #d4b898 100%)" 
                : "linear-gradient(180deg, #eedec8 0%, #e8cdb0 40%, #d4b898 100%)", 
              borderRadius: isDesktop ? "0 0 24px 24px" : "0 0 16px 16px", 
              padding: isDesktop 
                ? `${dimensions.width * 0.04}px ${dimensions.width * 0.05}px ${dimensions.width * 0.045}px`
                : `${dimensions.width * 0.03}px ${dimensions.width * 0.04}px ${dimensions.width * 0.035}px`,
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: isDesktop ? `${dimensions.width * 0.018}px` : `${dimensions.width * 0.014}px`
            }}
          >
            <div 
              style={{ 
                fontFamily: "'Georgia', serif", 
                fontSize: isDesktop 
                  ? `clamp(16px, ${dimensions.width * 0.04}px, 20px)`
                  : `clamp(11px, ${dimensions.width * 0.032}px, 16px)`,
                fontWeight: 700, 
                letterSpacing: isDesktop ? "0.2em" : "0.15em", 
                color: hasWon ? "#6a4020" : "#6a4020", 
                textAlign: "center",
                whiteSpace: "nowrap"
              }}
            >
              {hasWon ? "🎊 YOU WON! 🎊" : spinStatus.includes("YOU WON 500 DH!") ? "YOU WON 500 DH!" : spinStatus}
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: isDesktop ? "12px" : "8px", width: "100%" }}>
              <div style={{ flex: 1, height: "1px", background: hasWon ? "rgba(6, 95, 70, 0.25)" : "rgba(140,80,20,0.25)" }} />
              <span style={{ color: hasWon ? "#b09070" : "#b09070", fontSize: isDesktop ? "14px" : "10px" }}>
                {hasWon ? "🏆" : "✦"}
              </span>
              <div style={{ flex: 1, height: "1px", background: hasWon ? "rgba(140,80,20,0.25)" : "rgba(140,80,20,0.25)" }} />
            </div>
          </div>
          
          {/* Bottom curved base */}
          <div 
            style={{ 
              width: bottomKnobWidth, 
              height: dimensions.width * 0.022,
              background: hasWon 
                ? "linear-gradient(180deg, #c8a888 0%, #b09070 100%)" 
                : "linear-gradient(180deg, #c8a888 0%, #b09070 100%)", 
              borderRadius: "0 0 40% 40% / 0 0 100% 100%", 
              marginTop: "-1px" 
            }} 
          />
        </div>
      </div>
    </div>
  );
});

SpinningWheel.displayName = 'SpinningWheel';

export default SpinningWheel;