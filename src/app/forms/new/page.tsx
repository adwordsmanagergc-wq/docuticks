"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { nanoid } from "nanoid";
import { UploadCloud, Loader2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { dataUrlToUint8Array, fileToDataUrl, loadPdfJs } from "@/lib/pdf";
import { formStore } from "@/lib/store";
import { DEFAULT_FILENAME_PATTERN } from "@/lib/types";

export default function NewFormPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErr("Please upload a PDF. (Image OCR coming soon.)");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: dataUrlToUint8Array(dataUrl) })
        .promise;
      const id = nanoid(8);
      const name = file.name.replace(/\.pdf$/i, "") || "Untitled form";
      formStore.upsert({
        id,
        name,
        status: "draft",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pdfDataUrl: dataUrl,
        pageCount: doc.numPages,
        fields: [],
        filenamePattern: DEFAULT_FILENAME_PATTERN,
      });
      router.push(`/forms/${id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not read PDF");
      setBusy(false);
    }
  }

  return (
    <AppShell pageTitle="New form">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-8 lg:col-span-2">
          <h2 className="text-lg font-semibold text-ink">
            Upload your scanned document
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            PDF up to 25 MB. We'll render every page so you can place fields
            directly on top.
          </p>

          <label
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              void handleFile(f ?? null);
            }}
            className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-16 text-center transition-colors ${
              busy
                ? "border-tick bg-tick/5"
                : "border-ink/15 bg-paper hover:border-tick"
            }`}
          >
            {busy ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-tick" />
                <p className="text-sm font-medium text-ink">
                  Reading your PDF…
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-ink/40" strokeWidth={1.4} />
                <p className="text-sm font-medium text-ink">
                  Drop your file here, or click to browse
                </p>
                <p className="text-xs text-ink/50">PDF only. 25 MB max.</p>
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={busy}
              onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {err ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-2 text-xs text-ink/55">
            <Sparkles className="h-3.5 w-3.5 text-tick" />
            Your file is processed entirely in this browser for the demo. No
            upload to a server.
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink">What happens next</h3>
          <ol className="mt-3 space-y-3 text-sm text-ink/65">
            <li>
              <span className="font-medium text-ink">1. We render the pages.</span>{" "}
              Every page becomes a canvas you can drop fields onto.
            </li>
            <li>
              <span className="font-medium text-ink">2. You place fields.</span>{" "}
              Drag from the palette: text, tick boxes, dates, signature.
            </li>
            <li>
              <span className="font-medium text-ink">3. Share the link.</span>{" "}
              Your client completes the form on any device.
            </li>
          </ol>
        </div>
      </div>
    </AppShell>
  );
}
