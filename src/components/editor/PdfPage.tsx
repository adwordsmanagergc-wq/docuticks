"use client";

import { useEffect, useRef, useState } from "react";
import { dataUrlToUint8Array, loadPdfJs } from "@/lib/pdf";

interface Props {
  pdfDataUrl: string;
  pageNumber: number;
  scale?: number;
  onSize?: (size: { width: number; height: number }) => void;
}

/**
 * Renders a single PDF page into a canvas. Reports the rendered pixel size
 * so an overlay layer can be positioned absolutely on top of it.
 */
export function PdfPage({ pdfDataUrl, pageNumber, scale = 1.4, onSize }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;

    (async () => {
      try {
        const pdfjs = await loadPdfJs();
        const data = dataUrlToUint8Array(pdfDataUrl);
        const doc = await pdfjs.getDocument({ data }).promise;
        if (cancelled) return;
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        renderTask = page.render({ canvasContext: ctx, viewport }) as unknown as {
          cancel: () => void;
          promise: Promise<void>;
        };
        await renderTask.promise;
        if (cancelled) return;
        const next = { width: viewport.width, height: viewport.height };
        setSize(next);
        onSize?.(next);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e);
          setError(msg);
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        renderTask?.cancel();
      } catch {
        /* noop */
      }
    };
  }, [pdfDataUrl, pageNumber, scale, onSize]);

  return (
    <div
      className="relative inline-block bg-white shadow-md"
      style={{ width: size.width || undefined, height: size.height || undefined }}
    >
      <canvas ref={canvasRef} />
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-red-600">
          Failed to render PDF: {error}
        </div>
      ) : null}
    </div>
  );
}
