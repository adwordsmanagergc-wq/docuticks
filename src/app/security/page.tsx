import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";
import {
  Lock,
  Server,
  ScrollText,
  Eye,
  Trash2,
  Globe,
  CheckCircle2,
} from "lucide-react";

export const metadata = { title: "Security & compliance" };

const PILLARS = [
  {
    icon: Lock,
    title: "Encryption everywhere",
    body: "TLS 1.2+ in transit. AES-256 at rest. Keys managed via AWS KMS with strict rotation.",
  },
  {
    icon: Server,
    title: "Australian-hosted",
    body: "All form data and completed PDFs are stored in ap-southeast-2 (Sydney).",
  },
  {
    icon: ScrollText,
    title: "Aligned with the ETA 1999",
    body: "Our signature workflow is aligned with Australia's Electronic Transactions Act 1999.",
  },
  {
    icon: Eye,
    title: "Privacy Act 1988 (Cth)",
    body: "DocuTicks is APP-aligned. Privacy policy and sub-processors list are published and kept current.",
  },
  {
    icon: CheckCircle2,
    title: "Audit trail on every submission",
    body: "Timestamp, IP address, user agent and signer email are captured for every submitted form.",
  },
  {
    icon: Trash2,
    title: "Data export & deletion",
    body: "Export or permanently delete your data on request. We don't hold what you don't need.",
  },
];

export default function SecurityPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Security & compliance"
          title="Built for documents that matter."
          subtitle="DocuTicks handles forms that often contain personal, financial and health information. We've built the platform around that responsibility from day one."
        />
      </Section>

      <Section className="bg-white">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-tick/10 text-tick">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-paper">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Sub-processors
          </h2>
          <p className="mt-3 text-ink/65">
            DocuTicks uses a small set of vetted sub-processors to deliver the
            service. The current list is published below and updated whenever it
            changes.
          </p>
          <ul className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
            {[
              { name: "AWS", purpose: "Hosting, storage, KMS — ap-southeast-2", region: "Australia" },
              { name: "Postmark", purpose: "Transactional email delivery", region: "United States" },
              { name: "Stripe", purpose: "Subscription billing", region: "United States / Australia" },
              { name: "Sentry", purpose: "Error reporting (no PII)", region: "United States" },
            ].map((s) => (
              <li
                key={s.name}
                className="grid grid-cols-3 gap-4 px-5 py-4 text-sm"
              >
                <span className="font-medium text-ink">{s.name}</span>
                <span className="text-ink/65">{s.purpose}</span>
                <span className="text-right text-ink/60">{s.region}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-ink/10 bg-white p-6">
            <Globe className="h-5 w-5 shrink-0 text-tick" />
            <p className="text-sm text-ink/65">
              For a copy of our security overview, sub-processor change log, or
              to report a vulnerability, email{" "}
              <a className="text-ink underline" href="mailto:security@docuticks.com">
                security@docuticks.com
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
