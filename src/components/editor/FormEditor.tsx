"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Redo2,
  Save,
  Send,
  Sparkles,
  Trash2,
  Undo2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { PdfPage } from "@/components/editor/PdfPage";
import { FieldChip } from "@/components/editor/FieldChip";
import { FIELD_BY_TYPE, FIELD_TYPES } from "@/components/editor/fieldDefs";
import { updateFormAction } from "@/lib/actions";
import { runOcr, suggestFieldsFromWords } from "@/lib/ocr";
import type { FieldType, FormDoc, FormField } from "@/lib/types";

const SCALE = 1.4;

export function FormEditor({ initial }: { initial: FormDoc }) {
  const router = useRouter();
  const [doc, setDoc] = useState<FormDoc>(initial);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const historyRef = useRef<FormField[][]>([initial.fields]);
  const futureRef = useRef<FormField[][]>([]);

  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrToast, setOcrToast] = useState<string | null>(null);

  const updateFields = useCallback((next: FormField[]) => {
    setDoc((d) => ({ ...d, fields: next }));
    historyRef.current.push(next);
    if (historyRef.current.length > 50) historyRef.current.shift();
    futureRef.current = [];
  }, []);

  const undo = () => {
    if (historyRef.current.length < 2) return;
    const current = historyRef.current.pop();
    if (current) futureRef.current.push(current);
    const prev = historyRef.current[historyRef.current.length - 1];
    setDoc((d) => ({ ...d, fields: prev }));
  };
  const redo = () => {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push(next);
    setDoc((d) => ({ ...d, fields: next }));
  };

  const handleOcr = useCallback(async () => {
    setOcrBusy(true);
    setOcrError(null);
    setOcrToast(null);
    setOcrStatus("Loading page");
    try {
      const words = await runOcr(doc.pdfUrl, page, (status, p) => {
        setOcrStatus(`${status} (${Math.round(p * 100)}%)`);
      });
      const suggestions = suggestFieldsFromWords(words, page);
      // Keep existing fields, append suggestions; let user dedupe by hand.
      const merged = [...doc.fields, ...suggestions];
      setDoc((d) => ({ ...d, fields: merged }));
      historyRef.current.push(merged);
      if (historyRef.current.length > 50) historyRef.current.shift();
      futureRef.current = [];
      if (suggestions.length === 0) {
        setOcrToast(
          "OCR finished but no obvious labels were found. Try the high-resolution scan or place fields manually.",
        );
      } else {
        setOcrToast(`Added ${suggestions.length} suggested field${suggestions.length === 1 ? "" : "s"}.`);
      }
    } catch (e) {
      setOcrError(e instanceof Error ? e.message : "OCR failed");
    } finally {
      setOcrBusy(false);
      setOcrStatus(null);
    }
  }, [doc.pdfUrl, doc.fields, page]);

  const save = useCallback(
    async (overrides?: Partial<FormDoc>) => {
      const next = { ...doc, ...overrides };
      setSaveError(null);
      try {
        await updateFormAction(doc.id, {
          name: next.name,
          fields: next.fields,
          status: next.status,
          filenamePattern: next.filenamePattern,
        });
        setDoc(next);
        setSavedAt(Date.now());
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : "Save failed");
      }
    },
    [doc],
  );

  // Drag from palette
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [draggingType, setDraggingType] = useState<FieldType | null>(null);

  function handleOverlayClick(e: React.MouseEvent) {
    if (!draggingType) return;
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    const def = FIELD_BY_TYPE[draggingType];
    const x = (e.clientX - rect.left) / rect.width - def.defaultW / 2;
    const y = (e.clientY - rect.top) / rect.height - def.defaultH / 2;
    const field: FormField = {
      id: nanoid(6),
      type: draggingType,
      page,
      x: clamp(x, 0, 1 - def.defaultW),
      y: clamp(y, 0, 1 - def.defaultH),
      w: def.defaultW,
      h: def.defaultH,
      label: def.defaultLabel,
      required: false,
    };
    updateFields([...doc.fields, field]);
    setSelectedId(field.id);
    setDraggingType(null);
  }

  // Drag-to-move and resize
  const dragRef = useRef<{
    id: string;
    mode: "move" | "resize";
    startX: number;
    startY: number;
    field: FormField;
  } | null>(null);

  function startMove(e: React.MouseEvent, field: FormField) {
    e.stopPropagation();
    setSelectedId(field.id);
    dragRef.current = {
      id: field.id,
      mode: "move",
      startX: e.clientX,
      startY: e.clientY,
      field,
    };
  }
  function startResize(e: React.MouseEvent, field: FormField) {
    e.stopPropagation();
    setSelectedId(field.id);
    dragRef.current = {
      id: field.id,
      mode: "resize",
      startX: e.clientX,
      startY: e.clientY,
      field,
    };
  }

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const drag = dragRef.current;
      const rect = overlayRef.current?.getBoundingClientRect();
      if (!drag || !rect) return;
      const dx = (e.clientX - drag.startX) / rect.width;
      const dy = (e.clientY - drag.startY) / rect.height;
      setDoc((d) => {
        const fields = d.fields.map((f) => {
          if (f.id !== drag.id) return f;
          if (drag.mode === "move") {
            return {
              ...f,
              x: clamp(drag.field.x + dx, 0, 1 - drag.field.w),
              y: clamp(drag.field.y + dy, 0, 1 - drag.field.h),
            };
          }
          return {
            ...f,
            w: clamp(drag.field.w + dx, 0.02, 1 - drag.field.x),
            h: clamp(drag.field.h + dy, 0.015, 1 - drag.field.y),
          };
        });
        return { ...d, fields };
      });
    }
    function onUp() {
      if (!dragRef.current) return;
      dragRef.current = null;
      setDoc((d) => {
        historyRef.current.push(d.fields);
        if (historyRef.current.length > 50) historyRef.current.shift();
        futureRef.current = [];
        return d;
      });
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if ((e.key === "Backspace" || e.key === "Delete") && selectedId) {
        e.preventDefault();
        updateFields(doc.fields.filter((f) => f.id !== selectedId));
        setSelectedId(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        ((e.key === "z" && e.shiftKey) || e.key === "y")
      ) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doc, selectedId, updateFields]);

  const selected = useMemo(
    () => doc.fields.find((f) => f.id === selectedId) ?? null,
    [doc, selectedId],
  );
  const fieldsOnPage = useMemo(
    () => doc.fields.filter((f) => f.page === page),
    [doc, page],
  );
  const hasSignerName = useMemo(
    () => !!doc.fields.find((f) => f.type === "signerName"),
    [doc],
  );

  return (
    <AppShell
      pageTitle="Form editor"
      pageActions={
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-ink/50 md:inline">
            {pending
              ? "Saving…"
              : savedAt
                ? `Saved ${new Date(savedAt).toLocaleTimeString()}`
                : "Unsaved changes"}
          </span>
          <button
            onClick={() => startTransition(() => void save())}
            className="btn-secondary text-sm"
            disabled={pending}
          >
            <Save className="h-4 w-4" /> Save draft
          </button>
          <button
            onClick={() => {
              if (!hasSignerName) {
                alert(
                  "Add a 'Signer name' field before publishing — it's used to auto-name the completed PDF.",
                );
                return;
              }
              startTransition(async () => {
                await save({ status: "published" });
                router.push(`/forms/${doc.id}/share`);
              });
            }}
            className="btn-tick text-sm"
            disabled={pending}
          >
            <Send className="h-4 w-4" /> Publish & share
          </button>
        </div>
      }
    >
      {saveError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {saveError}
        </div>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[240px_1fr_300px]">
        {/* Field palette */}
        <div className="card h-fit p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            Fields
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {FIELD_TYPES.map((f) => {
              const active = draggingType === f.type;
              return (
                <button
                  key={f.type}
                  onClick={() =>
                    setDraggingType(active ? null : (f.type as FieldType))
                  }
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs transition-colors ${
                    active
                      ? "border-tick bg-tick/10 text-tick"
                      : "border-ink/10 bg-white text-ink/70 hover:border-tick"
                  }`}
                >
                  <f.icon className="h-4 w-4" />
                  {f.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-ink/55">
            {draggingType
              ? "Click anywhere on the page to drop the field."
              : "Pick a field, then click on the page to place it."}
          </p>

          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={undo}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-ink/10 px-2 py-1.5 text-xs text-ink/70 hover:border-tick"
            >
              <Undo2 className="h-3.5 w-3.5" /> Undo
            </button>
            <button
              onClick={redo}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-ink/10 px-2 py-1.5 text-xs text-ink/70 hover:border-tick"
            >
              <Redo2 className="h-3.5 w-3.5" /> Redo
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={handleOcr}
              disabled={ocrBusy}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-tick/30 bg-tick/5 px-2 py-2 text-xs font-medium text-tick hover:bg-tick/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {ocrBusy ? "Reading…" : "Smart fields (OCR this page)"}
            </button>
            {ocrStatus ? (
              <p className="mt-2 text-[11px] text-ink/55">{ocrStatus}</p>
            ) : null}
            {ocrToast ? (
              <p className="mt-2 rounded-md border border-tick/30 bg-tick/5 px-2 py-1.5 text-[11px] text-tick">
                {ocrToast}
              </p>
            ) : null}
            {ocrError ? (
              <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] text-red-700">
                {ocrError}
              </p>
            ) : null}
            <p className="mt-2 text-[11px] text-ink/45">
              Runs entirely in your browser. First run downloads a small
              language model, then it&apos;s cached.
            </p>
          </div>

          {!hasSignerName ? (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Add a Signer name field — it's used to auto-name the completed
              PDF.
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-tick/30 bg-tick/5 p-3 text-xs text-tick">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Ready to publish.
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/10 bg-paper px-5 py-3 text-sm">
            <input
              value={doc.name}
              onChange={(e) =>
                setDoc((d) => ({ ...d, name: e.target.value }))
              }
              className="bg-transparent text-sm font-medium text-ink focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded p-1 text-ink/60 hover:bg-white"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-ink/60">
                Page {page} of {doc.pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(doc.pageCount, p + 1))}
                className="rounded p-1 text-ink/60 hover:bg-white"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="bg-paper-grid flex justify-center overflow-auto p-8">
            <div
              className="relative"
              onClick={() => {
                if (!draggingType) setSelectedId(null);
              }}
            >
              <PdfPage
                pdfUrl={doc.pdfUrl}
                pageNumber={page}
                scale={SCALE}
                onSize={setPageSize}
              />
              <div
                ref={overlayRef}
                onClick={handleOverlayClick}
                className={`absolute inset-0 ${
                  draggingType ? "cursor-crosshair" : ""
                }`}
                style={{
                  width: pageSize.width || "100%",
                  height: pageSize.height || "100%",
                }}
              >
                {fieldsOnPage.map((f) => (
                  <FieldChip
                    key={f.id}
                    field={f}
                    selected={selectedId === f.id}
                    onMouseDown={(e) => startMove(e, f)}
                    onResizeMouseDown={(e) => startResize(e, f)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(f.id);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Inspector */}
        <div className="card h-fit p-5">
          {selected ? (
            <Inspector
              field={selected}
              onChange={(patch) =>
                updateFields(
                  doc.fields.map((f) =>
                    f.id === selected.id ? { ...f, ...patch } : f,
                  ),
                )
              }
              onDelete={() => {
                updateFields(doc.fields.filter((f) => f.id !== selected.id));
                setSelectedId(null);
              }}
            />
          ) : (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/50">
                Form details
              </h3>
              <div className="mt-3 space-y-3 text-xs text-ink/70">
                <div>
                  <p className="font-medium text-ink">{doc.name}</p>
                  <p className="mt-0.5 text-ink/55">
                    {doc.fields.length} fields · {doc.pageCount} pages
                  </p>
                </div>
                <div className="rounded-lg bg-paper p-3 font-mono text-[10px] text-ink/65">
                  {doc.filenamePattern}
                </div>
                <Link
                  href="/forms"
                  className="inline-flex items-center gap-1 text-ink/55 hover:text-ink"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to all forms
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Inspector({
  field,
  onChange,
  onDelete,
}: {
  field: FormField;
  onChange: (p: Partial<FormField>) => void;
  onDelete: () => void;
}) {
  const def = FIELD_BY_TYPE[field.type];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/50">
          {def.label}
        </h3>
        <button
          onClick={onDelete}
          className="text-ink/40 hover:text-red-600"
          aria-label="Delete field"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 space-y-3">
        <Mini label="Label">
          <input
            value={field.label}
            onChange={(e) => onChange({ label: e.target.value })}
            className="w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
          />
        </Mini>
        {field.type !== "tick" ? (
          <Mini label="Helper text">
            <input
              value={field.helper ?? ""}
              onChange={(e) => onChange({ helper: e.target.value })}
              className="w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
            />
          </Mini>
        ) : null}
        {field.type === "dropdown" ? (
          <Mini label="Options (one per line)">
            <textarea
              rows={4}
              value={(field.options ?? []).join("\n")}
              onChange={(e) =>
                onChange({
                  options: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
            />
          </Mini>
        ) : null}
        <label className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-xs">
          <span className="text-ink/65">Required</span>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onChange({ required: e.target.checked })}
            className="h-3.5 w-3.5 accent-tick"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Mini label="X">
            <input
              type="number"
              step="0.01"
              min={0}
              max={1}
              value={Number(field.x.toFixed(3))}
              onChange={(e) =>
                onChange({ x: clamp(Number(e.target.value), 0, 1 - field.w) })
              }
              className="w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
            />
          </Mini>
          <Mini label="Y">
            <input
              type="number"
              step="0.01"
              min={0}
              max={1}
              value={Number(field.y.toFixed(3))}
              onChange={(e) =>
                onChange({ y: clamp(Number(e.target.value), 0, 1 - field.h) })
              }
              className="w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
            />
          </Mini>
          <Mini label="Width">
            <input
              type="number"
              step="0.01"
              min={0.02}
              max={1}
              value={Number(field.w.toFixed(3))}
              onChange={(e) =>
                onChange({ w: clamp(Number(e.target.value), 0.02, 1 - field.x) })
              }
              className="w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
            />
          </Mini>
          <Mini label="Height">
            <input
              type="number"
              step="0.01"
              min={0.015}
              max={1}
              value={Number(field.h.toFixed(3))}
              onChange={(e) =>
                onChange({ h: clamp(Number(e.target.value), 0.015, 1 - field.y) })
              }
              className="w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
            />
          </Mini>
        </div>
      </div>
    </div>
  );
}

function Mini({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}
