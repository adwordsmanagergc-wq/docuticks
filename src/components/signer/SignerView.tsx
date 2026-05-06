"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { PdfPage } from "@/components/editor/PdfPage";
import { SignaturePad } from "@/components/signer/SignaturePad";
import { Logo } from "@/components/Logo";
import type { FormDoc, FormField } from "@/lib/types";
import { downloadBlob, fillPdf } from "@/lib/fillPdf";
import { formatFilename } from "@/lib/filename";
import { submitFormAction } from "@/lib/actions";

const SCALE = 1.4;

export function SignerView({ doc }: { doc: FormDoc }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [values, setValues] = useState<Record<string, string>>({});
  const [signatures, setSignatures] = useState<Record<string, string | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{
    filename: string;
    bytes: Uint8Array;
  } | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  const allRequiredFilled = useMemo(() => {
    return doc.fields.every((f) => {
      if (!f.required) return true;
      if (f.type === "signature" || f.type === "initials")
        return !!signatures[f.id];
      if (f.type === "tick") return values[f.id] === "true";
      return Boolean(values[f.id]?.trim());
    });
  }, [doc, values, signatures]);

  const fieldsOnPage = doc.fields.filter((f) => f.page === page);

  if (done) {
    return (
      <div className="min-h-screen bg-paper">
        <Topbar formName={doc.name} />
        <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tick/15 text-tick">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold text-ink">
            Submitted. Thank you.
          </h1>
          <p className="mt-2 max-w-md text-ink/65">
            Your completed form has been delivered to the form owner. You can
            also download it for your records.
          </p>
          <p className="mt-2 font-mono text-xs text-ink/55">{done.filename}</p>
          <button
            onClick={() => downloadBlob(done.bytes, done.filename)}
            className="btn-tick mt-6"
          >
            Download my copy
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const signerNameField = doc.fields.find((f) => f.type === "signerName");
      const signerEmailField = doc.fields.find((f) => f.type === "signerEmail");
      const signerName = signerNameField
        ? values[signerNameField.id] || "Signer"
        : "Signer";
      const signerEmail = signerEmailField
        ? values[signerEmailField.id] || ""
        : "";
      const filename = formatFilename(doc.filenamePattern, {
        formName: doc.name,
        signerName,
      });
      const bytes = await fillPdf(doc, values, signatures);

      const fd = new FormData();
      fd.set("formId", doc.id);
      fd.set("signerName", signerName);
      fd.set("signerEmail", signerEmail);
      fd.set("filename", filename);
      fd.set("values", JSON.stringify(values));
      fd.set(
        "pdf",
        new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
        filename,
      );
      await submitFormAction(fd);
      setDone({ filename, bytes });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <Topbar formName={doc.name} />

      <div className="container-x grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-3 text-sm">
            <span className="font-medium text-ink">{doc.name}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded p-1 text-ink/60 hover:bg-paper"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-ink/60">
                Page {page} of {doc.pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(doc.pageCount, p + 1))}
                className="rounded p-1 text-ink/60 hover:bg-paper"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="bg-paper-grid flex justify-center overflow-auto p-6">
            <div className="relative">
              <PdfPage
                pdfUrl={doc.pdfUrl}
                pageNumber={page}
                scale={SCALE}
                onSize={setPageSize}
              />
              <div
                className="absolute inset-0"
                style={{
                  width: pageSize.width || "100%",
                  height: pageSize.height || "100%",
                }}
              >
                {fieldsOnPage.map((f) => (
                  <SignerFieldOverlay
                    key={f.id}
                    field={f}
                    value={values[f.id] ?? ""}
                    signature={signatures[f.id] ?? null}
                    active={activeFieldId === f.id}
                    onActivate={() => setActiveFieldId(f.id)}
                    onChange={(v) =>
                      setValues((s) => ({ ...s, [f.id]: v }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Your details</h2>
            <p className="mt-1 text-xs text-ink/55">
              Complete each field. Required fields are marked *. The form will
              be auto-named with your name and today's date.
            </p>
          </div>

          {fieldsOnPage
            .filter(
              (f) =>
                f.type === "signature" ||
                f.type === "initials" ||
                activeFieldId === f.id,
            )
            .map((f) => (
              <FieldEditor
                key={f.id}
                field={f}
                value={values[f.id] ?? ""}
                signature={signatures[f.id] ?? null}
                onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))}
                onSign={(s) =>
                  setSignatures((prev) => ({ ...prev, [f.id]: s }))
                }
              />
            ))}

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            onClick={handleSubmit}
            disabled={!allRequiredFilled || submitting}
            className="btn-tick w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit form"}
          </button>
          <p className="text-center text-[11px] text-ink/45">
            By submitting you consent to your signature being attached to this
            form under the Electronic Transactions Act 1999.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Topbar({ formName }: { formName: string }) {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="container-x flex h-14 items-center justify-between">
        <Logo />
        <span className="hidden text-xs text-ink/55 sm:inline">
          You're completing: <span className="text-ink">{formName}</span>
        </span>
      </div>
    </header>
  );
}

function SignerFieldOverlay({
  field,
  value,
  signature,
  active,
  onActivate,
  onChange,
}: {
  field: FormField;
  value: string;
  signature: string | null;
  active: boolean;
  onActivate: () => void;
  onChange: (v: string) => void;
}) {
  const baseStyle: React.CSSProperties = {
    left: `${field.x * 100}%`,
    top: `${field.y * 100}%`,
    width: `${field.w * 100}%`,
    height: `${field.h * 100}%`,
  };

  if (field.type === "tick") {
    return (
      <button
        onClick={() => onChange(value === "true" ? "" : "true")}
        style={baseStyle}
        className={`absolute flex items-center justify-center rounded border ${
          value === "true"
            ? "border-tick bg-tick text-white"
            : "border-tick/50 bg-white"
        }`}
        aria-label={field.label}
      >
        {value === "true" ? "✓" : ""}
      </button>
    );
  }

  if (field.type === "signature" || field.type === "initials") {
    return (
      <div
        style={baseStyle}
        className={`absolute flex items-center justify-center rounded-md border-2 border-dashed ${
          signature ? "border-tick bg-white" : "border-tick/40 bg-tick/5"
        }`}
      >
        {signature ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={signature} alt="signature" className="h-full w-full object-contain" />
        ) : (
          <span className="text-[10px] font-medium text-tick">
            {field.type === "signature" ? "Sign in panel →" : "Initials →"}
          </span>
        )}
      </div>
    );
  }

  if (field.type === "dropdown") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onActivate}
        style={baseStyle}
        className={`absolute rounded-md border px-1 text-[11px] ${
          active ? "border-tick" : "border-ink/20"
        } bg-white`}
      >
        <option value="">{field.label}</option>
        {(field.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "date") {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onActivate}
        style={baseStyle}
        className={`absolute rounded-md border px-1 text-[11px] ${
          active ? "border-tick" : "border-ink/20"
        } bg-white`}
      />
    );
  }

  if (field.type === "multiline") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onActivate}
        placeholder={field.label}
        style={baseStyle}
        className={`absolute resize-none rounded-md border p-1 text-[11px] leading-tight ${
          active ? "border-tick" : "border-ink/20"
        } bg-white`}
      />
    );
  }

  return (
    <input
      type={field.type === "signerEmail" ? "email" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onActivate}
      placeholder={field.label}
      style={baseStyle}
      className={`absolute rounded-md border px-1 text-[11px] ${
        active ? "border-tick" : "border-ink/20"
      } bg-white`}
    />
  );
}

function FieldEditor({
  field,
  value,
  signature,
  onChange,
  onSign,
}: {
  field: FormField;
  value: string;
  signature: string | null;
  onChange: (v: string) => void;
  onSign: (s: string | null) => void;
}) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-ink">
        {field.label}
        {field.required ? <span className="ml-1 text-tick">*</span> : null}
      </h3>
      {field.helper ? (
        <p className="mt-1 text-xs text-ink/55">{field.helper}</p>
      ) : null}

      <div className="mt-3">
        {field.type === "signature" || field.type === "initials" ? (
          <SignaturePad value={signature} onChange={onSign} />
        ) : field.type === "multiline" ? (
          <textarea
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-tick focus:outline-none"
          />
        ) : field.type === "tick" ? (
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={value === "true"}
              onChange={(e) => onChange(e.target.checked ? "true" : "")}
              className="h-4 w-4 accent-tick"
            />
            {field.label}
          </label>
        ) : field.type === "dropdown" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-tick focus:outline-none"
          >
            <option value="">Choose…</option>
            {(field.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={
              field.type === "signerEmail"
                ? "email"
                : field.type === "date"
                  ? "date"
                  : "text"
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-tick focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
