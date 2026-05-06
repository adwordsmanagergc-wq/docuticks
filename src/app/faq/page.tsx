import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = { title: "FAQ" };

const SECTIONS = [
  {
    heading: "Getting started",
    items: [
      {
        q: "Do I need a credit card to start the trial?",
        a: "No. Start your 14-day trial with just an email address. We'll only ask for payment if you choose to continue at the end of the trial.",
      },
      {
        q: "How long does it take to convert my first form?",
        a: "Most users upload a scanned PDF, place fields and send their first form in under five minutes.",
      },
      {
        q: "Can I import my existing PDFs?",
        a: "Yes. Drag and drop any PDF, JPG or PNG up to 25 MB and DocuTicks will render every page so you can place fields directly on top.",
      },
    ],
  },
  {
    heading: "Plans & billing",
    items: [
      {
        q: "What counts as an active form?",
        a: "Any template you have published and ready to send. Submissions to that template are unlimited on every plan.",
      },
      {
        q: "What happens if I exceed my form limit?",
        a: "We'll prompt you to archive a form or upgrade — nothing breaks, no surprise bills.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You retain access until the end of your billing period and can export everything before you go.",
      },
    ],
  },
  {
    heading: "Signing & legality",
    items: [
      {
        q: "Are e-signatures legally binding in Australia?",
        a: "Yes. DocuTicks signatures are aligned with the Electronic Transactions Act 1999 and capture the audit trail (timestamp, IP, signer email) required to evidence intent and identity.",
      },
      {
        q: "Does the signer need to create an account?",
        a: "No. Signers complete forms via a unique link on any device, no installation or signup required.",
      },
      {
        q: "Can I require multiple signers on one form?",
        a: "Per-signer fields and routing are on the roadmap. For now, multi-party forms are best handled by sending one form per signer.",
      },
    ],
  },
  {
    heading: "Privacy & security",
    items: [
      {
        q: "Where is my data stored?",
        a: "All data is stored in Australia (ap-southeast-2), encrypted in transit (TLS 1.2+) and at rest (AES-256).",
      },
      {
        q: "Who can see completed forms?",
        a: "Only you and any teammates you've invited as recipients on Intermediate plans. DocuTicks staff do not access form content unless you grant explicit permission for support.",
      },
      {
        q: "Can I delete a completed submission?",
        a: "Yes. Submissions can be permanently deleted at any time from the Submissions screen.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="FAQ"
          title="Everything you might want to ask."
          subtitle="Still curious? Email hello@docuticks.com — we reply quickly."
        />
      </Section>
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl space-y-12">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-tick">
                {section.heading}
              </h2>
              <div className="mt-4 divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
                {section.items.map((item) => (
                  <details key={item.q} className="group p-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-ink">
                      {item.q}
                      <span className="text-ink/40 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
