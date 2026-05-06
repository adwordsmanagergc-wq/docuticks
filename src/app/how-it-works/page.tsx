import Link from "next/link";
import { ArrowRight, Send, Upload, PenLine, PlayCircle } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";
import { FormPreview } from "@/components/FormPreview";

export const metadata = { title: "How it works" };

const STEPS = [
  {
    icon: Upload,
    title: "Upload once.",
    body: "Drag your scanned PDF into DocuTicks. We render every page so you can lay fields exactly where they need to go. PDF, JPG and PNG up to 25 MB.",
  },
  {
    icon: PenLine,
    title: "Make it interactive.",
    body: "Click anywhere on the page to drop a tick box, text field, dropdown, date or signature. Mark fields as required, optional, or signer-specific. Multi-page forms supported with undo/redo and snap-to-grid.",
  },
  {
    icon: Send,
    title: "Send and receive.",
    body: "Share a unique link, or have DocuTicks email the form directly. The signer completes it on any device. The completed PDF, named [Form]_[Signer]_[Date].pdf, lands in your inbox.",
  },
];

export default function HowItWorksPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="How it works"
          title="From scanned PDF to signed in three steps."
          subtitle="Most users send their first digital form within five minutes of signing up."
        />
      </Section>

      <Section className="bg-white">
        <div className="space-y-24">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`grid items-center gap-12 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-tick">
                  Step {i + 1}
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {step.title}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-ink/65">
                  {step.body}
                </p>
              </div>
              <div className="card p-8">
                <div className="flex h-72 items-center justify-center rounded-xl bg-paper">
                  <step.icon className="h-20 w-20 text-ink/20" strokeWidth={1.2} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Demo"
          title="Watch DocuTicks in action."
          subtitle="60-second tour of the upload, editor and inbox delivery."
        />
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="card flex aspect-video items-center justify-center bg-ink text-white">
            <div className="flex flex-col items-center gap-3">
              <PlayCircle className="h-16 w-16 text-tick" strokeWidth={1.2} />
              <span className="text-sm text-white/60">
                Product walkthrough
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Before & after.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/65">
              The same scanned form, transformed into something your clients can
              fill in on their phone in under five minutes.
            </p>
            <Link href="/signup" className="btn-tick mt-6">
              Convert your first form <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <FormPreview />
        </div>
      </Section>
    </SiteShell>
  );
}
