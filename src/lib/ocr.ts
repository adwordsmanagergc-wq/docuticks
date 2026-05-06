"use client";

import { nanoid } from "nanoid";
import { fetchPdfBytes, loadPdfJs } from "./pdf";
import type { FieldType, FormField } from "./types";

export interface OcrWord {
  text: string;
  x: number; // 0..1 fraction of page width
  y: number; // 0..1 fraction of page height
  w: number;
  h: number;
}

/**
 * Render the requested page of a PDF to an offscreen canvas and run
 * Tesseract.js OCR over it. Returns words with bounding boxes normalized
 * to 0..1 fractions so they slot directly into our field schema.
 */
export async function runOcr(
  pdfUrl: string,
  pageNumber: number,
  onProgress?: (status: string, progress: number) => void,
): Promise<OcrWord[]> {
  onProgress?.("Loading page", 0.02);
  const pdfjs = await loadPdfJs();
  const data = await fetchPdfBytes(pdfUrl);
  const doc = await pdfjs.getDocument({ data }).promise;
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  await (
    page.render({ canvasContext: ctx, viewport }) as unknown as {
      promise: Promise<void>;
    }
  ).promise;

  onProgress?.("Loading OCR engine", 0.1);
  const Tesseract = await import("tesseract.js");
  const worker = await Tesseract.createWorker("eng", 1, {
    logger: (m: { status?: string; progress?: number }) => {
      if (m.status && typeof m.progress === "number") {
        onProgress?.(m.status, 0.1 + m.progress * 0.85);
      }
    },
  });

  onProgress?.("Reading text", 0.2);
  const result = await worker.recognize(canvas);
  await worker.terminate();

  const W = viewport.width;
  const H = viewport.height;

  // tesseract.js types vary across versions; treat words as a loose array.
  type TWord = { text: string; bbox: { x0: number; y0: number; x1: number; y1: number } };
  const rawWords =
    ((result.data as unknown as { words?: TWord[] }).words ?? []) as TWord[];

  return rawWords.map((w) => ({
    text: w.text,
    x: w.bbox.x0 / W,
    y: w.bbox.y0 / H,
    w: (w.bbox.x1 - w.bbox.x0) / W,
    h: (w.bbox.y1 - w.bbox.y0) / H,
  }));
}

interface Rule {
  match: RegExp;
  type: FieldType;
  width: number; // fraction of page width
  height: number; // fraction of page height
  label: string;
}

// The order of these rules matters: more specific matches first.
const RULES: Rule[] = [
  { match: /^signature[:.\s]*$/i, type: "signature", width: 0.32, height: 0.06, label: "Signature" },
  { match: /^sign(ed)?[:.\s]*$/i, type: "signature", width: 0.32, height: 0.06, label: "Signature" },
  { match: /^initials?[:.\s]*$/i, type: "initials", width: 0.08, height: 0.04, label: "Initials" },
  { match: /^date[ds]?[:.\s]*$/i, type: "date", width: 0.16, height: 0.025, label: "Date" },
  { match: /^e?-?mail[:.\s]*$/i, type: "signerEmail", width: 0.28, height: 0.025, label: "Email" },
  { match: /^name[:.\s]*$/i, type: "signerName", width: 0.28, height: 0.025, label: "Full name" },
  { match: /^applicant[:.\s]*$/i, type: "signerName", width: 0.28, height: 0.025, label: "Applicant" },
  { match: /^(phone|mobile|tel|telephone)[:.\s]*$/i, type: "text", width: 0.22, height: 0.025, label: "Phone" },
  { match: /^address[:.\s]*$/i, type: "text", width: 0.42, height: 0.025, label: "Address" },
  { match: /^suburb[:.\s]*$/i, type: "text", width: 0.25, height: 0.025, label: "Suburb" },
  { match: /^postcode[:.\s]*$/i, type: "text", width: 0.12, height: 0.025, label: "Postcode" },
  { match: /^company[:.\s]*$/i, type: "text", width: 0.32, height: 0.025, label: "Company" },
  { match: /^abn[:.\s]*$/i, type: "text", width: 0.22, height: 0.025, label: "ABN" },
  { match: /^dob[:.\s]*$/i, type: "date", width: 0.16, height: 0.025, label: "Date of birth" },
];

/**
 * Walk the OCR words, snap "First Name:" / "Full Name:" style compounds,
 * and propose fields next to each label. We dedupe by snapping to a coarse
 * grid so the same label twice on a row collapses into one suggestion.
 */
export function suggestFieldsFromWords(
  words: OcrWord[],
  page: number,
): FormField[] {
  if (words.length === 0) return [];

  // Build a "label" string per word that includes preceding-word context for
  // common compound labels.
  const enriched = words.map((w, i) => {
    const prev = words[i - 1]?.text?.toLowerCase() ?? "";
    const compound =
      /^(name|email|phone|signature)[:.\s]*$/i.test(w.text) &&
      /^(first|last|full|home|work|mobile|company|patient|client|applicant)$/.test(
        prev,
      )
        ? `${prev} ${w.text}`
        : w.text;
    return { ...w, normalized: compound };
  });

  const out: FormField[] = [];
  const seen = new Set<string>();

  for (const word of enriched) {
    if (!word.text || word.text.length < 2) continue;
    for (const rule of RULES) {
      if (rule.match.test(word.text)) {
        const x = clamp(word.x + word.w + 0.01, 0, 1 - rule.width);
        const y = clamp(word.y - 0.003, 0, 1 - rule.height);
        const key = `${rule.type}:${Math.round(x * 50)}:${Math.round(y * 50)}`;
        if (seen.has(key)) break;
        seen.add(key);
        out.push({
          id: nanoid(6),
          type: rule.type,
          page,
          x,
          y,
          w: rule.width,
          h: rule.height,
          label: deriveLabel(rule.label, word.normalized),
          required: false,
        });
        break;
      }
    }
  }
  return out;
}

function deriveLabel(fallback: string, raw: string): string {
  const cleaned = raw.replace(/[:.\s]+$/, "").trim();
  if (!cleaned) return fallback;
  return cleaned.length <= 32 ? capitalize(cleaned) : fallback;
}

function capitalize(s: string) {
  return s
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}
