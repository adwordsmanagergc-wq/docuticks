"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadCloud, Loader2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { fileToArrayBuffer, loadPdfJs } from "@/lib/pdf";
import { imageFileToPdfBytes } from "@/lib/imageToPdf";
import { createFormAction } from "@/lib/actions";

const ACCEPTED = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export default function NewFormPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setErr("Please upload a PDF, JPG or PNG.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErr("File is too large (10 MB max).");
      return;
    }
    setErr(null);
    setBusy(true);

    let pdfFile: File;
    let baseName: string;
    try {
      if (file.type === "application/pdf") {
        pdfFile = file;
        baseName = file.name.replace(/\.pdf$/i, "");
      } else {
        const bytes = await imageFileToPdfBytes(file);
        baseName = file.name.replace(/\.(jpe?g|png)$/i, "");
        pdfFile = new File([new Uint8Array(bytes)], `${baseName}.pdf`, {
          type: "application/pdf",
        });
      }
    } catch (e) {
      console.error("image-to-pdf conversion failed", e);
      setErr(
        `Could not read that image: ${e instanceof Error ? e.message : String(e)}`,
      );
      setBusy(false);
      return;
    }

    let pageCount: number;
    try {
      const buffer = await fileToArrayBuffer(pdfFile);
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) })
        .promise;
      pageCount = doc.numPages;
    } catch (e) {
      console.error("pdf.js failed to read converted PDF", e);
      setErr(
        `Could not render that file: ${e instanceof Error ? e.message : String(e)}`,
      );
      setBusy(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.set("pdf", pdfFile, pdfFile.name);
      fd.set("name", baseName || "Untitled form");
      fd.set("pageCount", String(pageCount));
      const result = await createFormAction(fd);
      if (!result.ok) {
        setErr(result.error);
        setBusy(false);
        return;
      }
      router.push(`/forms/${result.id}`);
    } catch (e) {
      // Reaching this branch means the server action itself threw — typically
      // a transport-level failure (body size, timeout, 5xx). In production
      // Next.js redacts the message; the digest in the server logs is the
      // only way to recover the real cause.
      const message =
        e instanceof Error ? e.message : "Upload failed unexpectedly";
      const digest = (e as { digest?: string } | null)?.digest;
      console.error("createFormAction transport error", { message, digest, e });
      setErr(
        digest
          ? `Upload failed (server digest: ${digest}). Please try a smaller file or check the server logs.`
          : `Upload failed: ${message}`,
      );
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
            PDF, JPG or PNG up to 10 MB. We render every page so you can place
            fields directly on top.
          </p>

          <label
            onDragOver={(e) => e.preventDefault()}
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
                  Uploading & reading your PDF…
                </p>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-ink/40" strokeWidth={1.4} />
                <p className="text-sm font-medium text-ink">
                  Drop your file here, or click to browse
                </p>
                <p className="text-xs text-ink/50">
                  PDF, JPG or PNG. 10 MB max.
                </p>
              </>
            )}
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png"
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
            Stored in your DocuTicks workspace, encrypted at rest.
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
              Your client completes the form on any device. The signed PDF
              lands in your inbox.
            </li>
          </ol>
        </div>
      </div>
    </AppShell>
  );
}
