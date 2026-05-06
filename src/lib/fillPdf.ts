"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { FormDoc } from "./types";
import { dataUrlToUint8Array } from "./pdf";

/**
 * Take the original PDF + the schema + the values from the signer and
 * produce a flattened, completed PDF as a data URL.
 *
 * Coordinates in our schema are top-left fractions of the page. pdf-lib's
 * coordinate system is bottom-left in points, so we convert.
 */
export async function fillPdf(
  doc: FormDoc,
  values: Record<string, string>,
  signatures: Record<string, string | null>,
): Promise<string> {
  const pdf = await PDFDocument.load(dataUrlToUint8Array(doc.pdfDataUrl));
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  for (const field of doc.fields) {
    const page = pages[field.page - 1];
    if (!page) continue;
    const { width, height } = page.getSize();
    const x = field.x * width;
    const w = field.w * width;
    const h = field.h * height;
    // Convert top-left origin to bottom-left.
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
          color: rgb(0.06, 0.72, 0.51), // tick green
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
      color: rgb(0.05, 0.11, 0.17), // ink
      maxWidth: w - 4,
    });
  }

  // Audit footer on the last page.
  const last = pages[pages.length - 1];
  const { width: lw } = last.getSize();
  const stamp = `Signed via DocuTicks · ${new Date().toISOString()}`;
  last.drawText(stamp, {
    x: 12,
    y: 10,
    size: 7,
    font,
    color: rgb(0.45, 0.5, 0.55),
    maxWidth: lw - 24,
  });

  const bytes = await pdf.save();
  return bytesToDataUrl(bytes, "application/pdf");
}

function bytesToDataUrl(bytes: Uint8Array, mime: string): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
