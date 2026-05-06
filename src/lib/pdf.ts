"use client";

// We dynamically import pdfjs only on the client to avoid SSR issues.
// The worker is loaded from a CDN matched to the installed pdfjs-dist version.

import type * as PdfJsTypes from "pdfjs-dist";

let pdfjsPromise: Promise<typeof PdfJsTypes> | null = null;

export function loadPdfJs(): Promise<typeof PdfJsTypes> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PDF.js is browser-only"));
  }
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then(async (mod) => {
      const version = mod.version;
      mod.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
      return mod;
    });
  }
  return pdfjsPromise;
}

export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
