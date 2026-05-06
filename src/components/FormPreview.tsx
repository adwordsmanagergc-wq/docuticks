import { Check, PenLine, Calendar, Type } from "lucide-react";

/**
 * Visual mockup of a DocuTicks form rendered next to a scanned page —
 * used as the hero illustration on the homepage and use-case pages.
 */
export function FormPreview() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Scanned paper */}
      <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-paper p-6 shadow-soft">
        <span className="chip absolute right-4 top-4 bg-white/80">
          Before · Scanned PDF
        </span>
        <div className="mx-auto h-[360px] w-full max-w-[320px] rotate-[-1.2deg] bg-[repeating-linear-gradient(0deg,#e5e7eb_0,#e5e7eb_1px,transparent_1px,transparent_22px)] p-5 shadow-md">
          <div className="mb-4 h-3 w-2/3 bg-ink/40" />
          <div className="mb-2 h-2 w-1/2 bg-ink/20" />
          <div className="mb-6 h-2 w-1/3 bg-ink/20" />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 border border-ink/40" />
              <span className="h-2 w-2/3 bg-ink/20" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 border border-ink/40" />
              <span className="h-2 w-1/2 bg-ink/20" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 border border-ink/40" />
              <span className="h-2 w-3/5 bg-ink/20" />
            </div>
          </div>
          <div className="mt-8 h-12 w-full border border-dashed border-ink/30" />
        </div>
      </div>

      {/* DocuTicks digital form */}
      <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
        <span className="chip absolute right-4 top-4 border-tick/20 bg-tick/10 text-tick">
          After · DocuTicks
        </span>
        <div className="mx-auto h-[360px] w-full max-w-[320px] rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-ink/50">
            Tenancy Application
          </div>
          <div className="mb-4 text-base font-semibold text-ink">
            Smith Property — 14 Kerr St
          </div>

          <Field icon={<Type className="h-3.5 w-3.5" />} label="Full name" value="Jane Smith" />
          <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Move-in date" value="12 May 2026" />

          <div className="mb-3 mt-3 space-y-2">
            <CheckRow label="I consent to a credit check" checked />
            <CheckRow label="I have included rental references" checked />
            <CheckRow label="I am the named applicant" checked />
          </div>

          <div className="mt-3 rounded-lg border border-tick/30 bg-tick/5 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-tick">
              <PenLine className="h-3 w-3" /> Signature
            </div>
            <svg viewBox="0 0 200 32" className="h-8 w-full text-ink">
              <path
                d="M2 22 C 18 6, 32 28, 50 14 S 90 30, 110 12 S 160 26, 198 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="mb-2 rounded-lg border border-ink/10 bg-paper/60 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-ink/50">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

function CheckRow({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border ${
          checked ? "border-tick bg-tick text-white" : "border-ink/30 bg-white"
        }`}
      >
        {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
      <span className="text-xs text-ink/80">{label}</span>
    </div>
  );
}
