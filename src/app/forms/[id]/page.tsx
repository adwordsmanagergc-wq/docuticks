import Link from "next/link";
import {
  CheckSquare,
  Type,
  Calendar,
  ChevronDown,
  PenLine,
  ListChecks,
  Save,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";

export default async function FormEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AppShell
      pageTitle="Form editor"
      pageActions={
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm">
            <Save className="h-4 w-4" /> Save draft
          </button>
          <Link href={`/forms/${id}/share`} className="btn-tick text-sm">
            <Send className="h-4 w-4" /> Share
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[240px_1fr_280px]">
        {/* Field palette */}
        <div className="card h-fit p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            Fields
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { icon: Type, label: "Text" },
              { icon: ListChecks, label: "Multi-line" },
              { icon: CheckSquare, label: "Tick" },
              { icon: ChevronDown, label: "Dropdown" },
              { icon: Calendar, label: "Date" },
              { icon: PenLine, label: "Signature" },
            ].map((f) => (
              <button
                key={f.label}
                className="flex flex-col items-center gap-1 rounded-lg border border-ink/10 bg-white p-3 text-xs text-ink/70 hover:border-tick hover:text-ink"
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Drag a field onto the page to place it.
          </p>
        </div>

        {/* Canvas */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/10 bg-paper px-5 py-3 text-sm">
            <span className="text-ink/60">Page 1 of 2</span>
            <span className="text-ink/60">Form #{id}</span>
          </div>
          <div className="bg-paper-grid flex justify-center p-8">
            <div className="relative h-[640px] w-full max-w-[480px] overflow-hidden rounded-lg border border-ink/10 bg-white p-8 shadow-md">
              <div className="mb-4 h-3 w-2/3 bg-ink/30" />
              <div className="mb-2 h-2 w-1/2 bg-ink/15" />
              <div className="mb-8 h-2 w-1/3 bg-ink/15" />
              <div className="mb-3 h-2 w-3/4 bg-ink/15" />
              <div className="mb-3 h-2 w-2/3 bg-ink/15" />

              {/* Placed fields */}
              <div className="absolute left-8 top-32 w-44 rounded-md border border-tick/40 bg-tick/10 px-2 py-1 text-xs font-medium text-tick">
                Full name
              </div>
              <div className="absolute right-8 top-32 w-32 rounded-md border border-accent/40 bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                Date
              </div>
              <div className="absolute left-8 top-56 flex items-center gap-2 rounded-md border border-tick/40 bg-tick/10 px-2 py-1 text-xs font-medium text-tick">
                <CheckSquare className="h-3 w-3" /> Consent to credit check
              </div>
              <div className="absolute bottom-12 left-8 right-8 h-16 rounded-md border-2 border-dashed border-tick/50 bg-tick/5 p-2 text-xs font-medium text-tick">
                Signature
              </div>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="card h-fit p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            Selected: Full name
          </h3>
          <div className="mt-4 space-y-3">
            <Field label="Field label" value="Full name" />
            <Field label="Helper text" value="As it appears on your ID" />
            <div className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-xs">
              <span className="text-ink/65">Required</span>
              <span className="inline-flex h-4 w-7 items-center rounded-full bg-tick px-0.5">
                <span className="h-3 w-3 rounded-full bg-white" />
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-xs">
              <span className="text-ink/65">Used for filename</span>
              <span className="inline-flex h-4 w-7 items-center rounded-full bg-tick px-0.5">
                <span className="ml-3 h-3 w-3 rounded-full bg-white" />
              </span>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-tick/30 bg-tick/5 p-3 text-xs text-tick">
            Tip: every published form needs a "Signer name" field so the
            completed PDF can be auto-named.
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-ink/50">
        {label}
      </label>
      <input
        defaultValue={value}
        className="mt-1 w-full rounded-md border border-ink/15 bg-white px-2 py-1.5 text-xs"
      />
    </div>
  );
}
