"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  height?: number;
}

/**
 * Lightweight in-browser signature pad. Strokes are drawn on a canvas and
 * exported as a transparent PNG data URL for embedding in the final PDF.
 */
export function SignaturePad({ value, onChange, height = 120 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0E1B2C";
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, height);
      img.src = value;
    } else {
      ctx.clearRect(0, 0, rect.width, height);
    }
  }, [value, height]);

  function pos(e: React.PointerEvent) {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        style={{ height, touchAction: "none" }}
        className="w-full cursor-crosshair rounded-lg border border-ink/15 bg-white"
        onPointerDown={(e) => {
          (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
          drawingRef.current = true;
          lastRef.current = pos(e);
        }}
        onPointerMove={(e) => {
          if (!drawingRef.current) return;
          const ctx = canvasRef.current?.getContext("2d");
          if (!ctx) return;
          const p = pos(e);
          const last = lastRef.current ?? p;
          ctx.beginPath();
          ctx.moveTo(last.x, last.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          lastRef.current = p;
        }}
        onPointerUp={() => {
          if (!drawingRef.current) return;
          drawingRef.current = false;
          lastRef.current = null;
          const data = canvasRef.current?.toDataURL("image/png") ?? null;
          onChange(data);
        }}
        onPointerLeave={() => {
          drawingRef.current = false;
          lastRef.current = null;
        }}
      />
      <div className="flex justify-between text-xs text-ink/55">
        <span>Sign with your finger or mouse.</span>
        <button
          type="button"
          onClick={() => {
            const ctx = canvasRef.current?.getContext("2d");
            const c = canvasRef.current;
            if (ctx && c) ctx.clearRect(0, 0, c.width, c.height);
            onChange(null);
          }}
          className="text-ink/60 hover:text-ink"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
