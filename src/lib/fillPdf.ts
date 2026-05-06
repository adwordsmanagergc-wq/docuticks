"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FormDoc } from "./types";
import { fetchPdfBytes } from "./pdf";

/**
 * Take the original PDF (fetched from the server) + the schema + the values
 * from the signer and produce a flattened, completed PDF as a Uint8Array.
 *
 * Coordinates in our schema are top-left fractions of the page. pdf-lib's
 * coordinate system is bottom-left in points, so we convert.
 */
export async function fillPdf(
  doc: FormDoc,
  values: Record<string, string>,
  signatures: Record<string, string | null>,
): Promise<Uint8Array> {
  const original = await fetchPdfBytes(doc.pdfUrl);
  const pdf = await PDFDocument.load(original);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  for (const field of doc.fields) {
    const page = pages[field.page - 1];
    if (!page) continue;
    const { width, height } = page.getSize();
    const x = field.x * width;
    const w = field.w * width;
    const h = field.h * height;
    const y = height - field.y * height - h;

    if (field.type === "signature" || field.type === "initials") {
      const sigDataUrl = signatures[field.id];
      if (!sigDataUrl) continue;
      const png = await pdf.embedPng(sigDataUrl);
      page.drawImage(png, { x, y, width: w, height: h });
      continue;
    }

    if (field.type === "tick") {
      if (values[field.id] === "true") {
        page.drawText("X", {
          x: x + 1,
          y: y + 1,
          size: Math.min(h, w) * 0.9,
          font,
          color: rgb(0.06, 0.72, 0.51),
        });
      }
      continue;
    }

    const value = values[field.id];
    if (!value) continue;
    const fontSize = Math.max(8, Math.min(h * 0.7, 14));
    page.drawText(String(value), {
      x: x + 2,
      y: y + (h - fontSize) / 2 + 1,
      size: fontSize,
      font,
      color: rgb(0.05, 0.11, 0.17),
      maxWidth: w - 4,
    });
  }

  const last = pages[pages.length - 1];
  const { width: lw } = last.getSize();
  last.drawText(
    `Signed via DocuTicks · ${new Date().toISOString()}`,
    {
      x: 12,
      y: 10,
      size: 7,
      font,
      color: rgb(0.45, 0.5, 0.55),
      maxWidth: lw - 24,
    },
  );

  return pdf.save();
}

export function downloadBlob(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
