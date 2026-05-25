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
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

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
    ctx.fillText(hint, rect.width / 2, rect.height / 2 - 10);
    ctx.font = '14px Fredoka, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('drag your finger', rect.width / 2, rect.height / 2 + 22);
    ctx.font = '28px sans-serif';
    ctx.fillText('👆', rect.width / 2, rect.height / 2 + 60);
  }, [hint, hintColor, surfaceFrom, surfaceTo]);

  function getPos(e: React.PointerEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function scratchAt(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    if (lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = 56;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    lastPoint.current = { x, y };
  }

  function checkReveal() {
    if (revealed.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;
    let transparent = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 32) {
      if (data[i] < 16) transparent++;
      total++;
    }
    if (transparent / total > 0.4) {
      revealed.current = true;
      onReveal();
      setFading(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function handleDown(e: React.PointerEvent) {
    isDrawing.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    lastPoint.current = null;
    const p = getPos(e);
    scratchAt(p.x, p.y);
  }
  function handleMove(e: React.PointerEvent) {
    if (!isDrawing.current) return;
    const p = getPos(e);
    scratchAt(p.x, p.y);
  }
  function handleUp() {
    isDrawing.current = false;
    lastPoint.current = null;
    checkReveal();
  }

  return (
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
          touchAction: 'none',
          cursor: 'grab',
          opacity: fading ? 0 : 1,
          transition: 'opacity 320ms ease',
          pointerEvents: fading ? 'none' : 'auto'
        }}
      />
    </div>
  );
}
