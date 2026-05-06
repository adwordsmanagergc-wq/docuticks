"use client";

import type * as PdfJsTypes from "pdfjs-dist";

let pdfjsPromise: Promise<typeof PdfJsTypes> | null = null;

export function loadPdfJs(): Promise<typeof PdfJsTypes> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PDF.js is browser-only"));
  }
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${mod.version}/build/pdf.worker.min.mjs`;
      return mod;
    });
  }
  return pdfjsPromise;
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

export async function fetchPdfBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Could not load PDF (${res.status})`);
  return new Uint8Array(await res.arrayBuffer());
}
