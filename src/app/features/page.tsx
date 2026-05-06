import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileSignature,
  Layers,
  Mail,
  MousePointerClick,
  Palette,
  ScrollText,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = { title: "Features" };

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Smart field placement",
    body: "Drag tick boxes, text fields, dates, dropdowns and signatures onto your form in seconds. Snap-to-grid keeps every field clean.",
  },
  {
    icon: FileSignature,
    title: "Legally compliant e-signatures",
    body: "Aligned with Australia's Electronic Transactions Act 1999. Each signature is hashed and embedded with a timestamp and IP for the audit trail.",
  },
  {
    icon: ScrollText,
    title: "Auto-named files",
    body: "Every completed form arrives as [Form Name]_[Signer Name]_[Date].pdf — no more renaming, no more lost files.",
  },
  {
    icon: Mail,
    title: "Inbox delivery",
    body: "Submissions email straight to you. On Intermediate, add up to three teammates as recipients per form.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first for signers",
    body: "Forms render beautifully on any phone, tablet or desktop. No app install, no signup for the person completing the form.",
  },
  {
    icon: Layers,
    title: "Reusable templates",
    body: "Build a form once, send unlimited times within your active form limit. Duplicate to spin up variants in seconds.",
  },
  {
    icon: Palette,
    title: "Branded forms",
    body: "Add your logo and brand colour. Customise the email subject and message every signer receives.",
  },
  {
    icon: ShieldCheck,
    title: "Secure storage",
    body: "Encrypted in transit (TLS 1.2+) and at rest (AES-256). Hosted in Australia (ap-southeast-2).",
  },
  {
    icon: CheckCircle2,
    title: "Audit trail",
    body: "Every submission captures the IP address, timestamp, signer email and user agent. Exportable on demand.",
  },
];

export default function FeaturesPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Features"
          title="The form builder that respects your time."
          subtitle="DocuTicks does the boring parts — chasing, naming, filing — so you can stop touching the same paperwork twice."
        />
      </Section>
      <Section className="bg-white">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-tick/10 text-tick">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section className="bg-paper">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink p-12 text-center text-white">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Try every feature free for 14 days.
          </h2>
          <p className="mt-4 text-white/70">No credit card required.</p>
          <Link href="/signup" className="btn-tick mt-8">
            Create free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
