"use client";

import { PDFDocument } from "pdf-lib";

/**
 * Wrap a JPG or PNG into a single-page PDF whose page size matches the
 * image's pixel dimensions in points (1px = 1pt). This keeps the rest of
 * the editor pipeline (rendering, field placement, filling) unchanged for
 * image uploads.
 */
export async function imageFileToPdfBytes(file: File): Promise<Uint8Array> {
  const isPng = file.type === "image/png";
  const isJpg = file.type === "image/jpeg" || file.type === "image/jpg";
  if (!isPng && !isJpg) {
    throw new Error("Only JPG and PNG images can be converted.");
  }
  const ab = await file.arrayBuffer();
  const pdf = await PDFDocument.create();
  const img = isPng ? await pdf.embedPng(ab) : await pdf.embedJpg(ab);
  const page = pdf.addPage([img.width, img.height]);
  page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  return pdf.save();
}
