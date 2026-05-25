import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onReveal: () => void;
  children: ReactNode;
  cardClassName?: string;
  hint?: string;
  surfaceFrom?: string;
  surfaceTo?: string;
  hintColor?: string;
  minHeight?: number;
}

const REVEAL_PIXEL_THRESHOLD = 0.18;
const REVEAL_AREA_THRESHOLD = 0.3;
const REVEAL_LIFT_THRESHOLD = 0.12;
const BRUSH_RADIUS = 38;
const BRUSH_WIDTH = 76;
const INPUT_GRACE_MS = 280;

export function ScratchCard({
  onReveal,
  children,
  cardClassName = 'host-secret-card',
  hint = 'SCRATCH TO REVEAL',
  surfaceFrom = '#8957e5',
  surfaceTo = '#3a1a8a',
  hintColor = '#ffd866',
  minHeight = 360
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const revealed = useRef(false);
  const scratchedArea = useRef(0);
  const totalArea = useRef(1);
  const lastCheck = useRef(0);
  const isInitialized = useRef(false);
  const mountedAt = useRef(0);
  const [fading, setFading] = useState(false);
  const [interacted, setInteracted] = useState(false);

  function paint() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    totalArea.current = rect.width * rect.height;

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, surfaceFrom);
    grad.addColorStop(1, surfaceTo);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    for (let i = -10; i < rect.width; i += 14) {
      for (let j = -10; j < rect.height; j += 14) {
        if (((i + j) / 14) % 2 < 1) ctx.fillRect(i, j, 6, 6);
      }
    }

    ctx.fillStyle = hintColor;
    ctx.font = 'bold 22px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hint, rect.width / 2, rect.height / 2 - 14);
    ctx.font = '13px Fredoka, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillText('drag across to scratch', rect.width / 2, rect.height / 2 + 18);

    ctx.strokeStyle = hintColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const cx = rect.width / 2;
    const cy = rect.height / 2 + 50;
    ctx.beginPath();
    ctx.moveTo(cx - 22, cy);
    ctx.lineTo(cx + 22, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 14, cy - 8);
    ctx.lineTo(cx + 22, cy);
    ctx.lineTo(cx + 14, cy + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy - 8);
    ctx.lineTo(cx - 22, cy);
    ctx.lineTo(cx - 14, cy + 8);
    ctx.stroke();
  }

  useEffect(() => {
    scratchedArea.current = 0;
    revealed.current = false;
    isDrawing.current = false;
    lastPoint.current = null;
    isInitialized.current = false;
    mountedAt.current = Date.now();

    paint();
    isInitialized.current = true;

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (!revealed.current && scratchedArea.current === 0) paint();
    });
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint, hintColor, surfaceFrom, surfaceTo]);

  function inGracePeriod() {
    return Date.now() - mountedAt.current < INPUT_GRACE_MS;
  }

  function getPos(e: React.PointerEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function triggerReveal() {
    if (revealed.current) return;
    if (!isInitialized.current) return;
    revealed.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFading(true);
    onReveal();
  }

  function scratchAt(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    if (lastPoint.current) {
      const dx = x - lastPoint.current.x;
      const dy = y - lastPoint.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      scratchedArea.current += dist * BRUSH_WIDTH;
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = BRUSH_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    } else {
      scratchedArea.current += Math.PI * BRUSH_RADIUS * BRUSH_RADIUS;
    }
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    lastPoint.current = { x, y };
  }

  function checkPixelReveal() {
    if (revealed.current) return false;
    if (!isInitialized.current) return false;
    if (totalArea.current <= 1) return false;
    if (scratchedArea.current <= 0) return false;
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    const w = canvas.width;
    const h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 32) {
      if (data[i] < 16) transparent++;
      total++;
    }
    return total > 0 && transparent / total > REVEAL_PIXEL_THRESHOLD;
  }

  function maybeReveal(force: boolean) {
    if (revealed.current) return;
    if (!isInitialized.current) return;
    if (scratchedArea.current / totalArea.current > REVEAL_AREA_THRESHOLD) {
      triggerReveal();
      return;
    }
    const now = Date.now();
    if (!force && now - lastCheck.current < 160) return;
    lastCheck.current = now;
    if (checkPixelReveal()) triggerReveal();
  }

  function handleDown(e: React.PointerEvent) {
    if (revealed.current) return;
    if (!isInitialized.current) return;
    if (inGracePeriod()) return;
    isDrawing.current = true;
    setInteracted(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    lastPoint.current = null;
    const p = getPos(e);
    scratchAt(p.x, p.y);
  }
  function handleMove(e: React.PointerEvent) {
    if (!isDrawing.current || revealed.current) return;
    const p = getPos(e);
    scratchAt(p.x, p.y);
    maybeReveal(false);
  }
  function handleUp() {
    const wasDrawing = isDrawing.current;
    isDrawing.current = false;
    lastPoint.current = null;
    if (revealed.current) return;
    if (!wasDrawing) return;
    if (scratchedArea.current <= 0) return;
    if (totalArea.current > 1 && scratchedArea.current / totalArea.current > REVEAL_LIFT_THRESHOLD) {
      triggerReveal();
      return;
    }
    maybeReveal(true);
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        className={cardClassName}
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight,
          width: '100%',
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '100%' }}>{children}</div>
        <canvas
          ref={canvasRef}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerLeave={handleUp}
          onPointerCancel={handleUp}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            touchAction: 'none',
            cursor: 'grab',
            opacity: fading ? 0 : 1,
            transition: 'opacity 320ms ease',
            pointerEvents: fading ? 'none' : 'auto'
          }}
        />
      </div>
      {interacted && !revealed.current && !fading && (
        <button
          type="button"
          onClick={triggerReveal}
          style={{
            display: 'block',
            margin: '8px auto 0',
            background: 'transparent',
            border: 0,
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'underline',
            fontSize: 13,
            fontFamily: 'Fredoka, sans-serif',
            cursor: 'pointer'
          }}
        >
          tap here if it won't reveal
        </button>
      )}
    </div>
  );
}
