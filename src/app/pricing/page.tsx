import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = {
  title: "Pricing — From $49/month AUD",
  description:
    "Simple monthly plans for digital tick-and-sign forms. Entry from $49 AUD. Intermediate from $89 AUD. 14-day free trial. Cancel anytime.",
};

const PLANS = [
  {
    name: "Entry",
    price: "$49",
    period: "/month AUD",
    tagline: "For solo professionals.",
    cta: { label: "Start free trial", href: "/signup" },
    features: [
      "1–5 active forms",
      "Unlimited submissions",
      "Tick boxes, text, dates, dropdowns, signatures",
      "Auto-named completed PDFs emailed to you",
      "Branded with your logo",
      "Secure Australian hosting",
      "Email support",
    ],
  },
  {
    name: "Intermediate",
    price: "$89",
    period: "/month AUD",
    tagline: "For small teams and growing practices.",
    badge: "Most popular",
    featured: true,
    cta: { label: "Start free trial", href: "/signup" },
    features: [
      "6–15 active forms",
      "Everything in Entry, plus:",
      "Up to 3 team members on the inbox",
      "Custom email subject and message per form",
      "Priority email support",
    ],
  },
  {
    name: "Pro",
    price: "Talk to us",
    period: "",
    tagline: "For agencies, clinics and franchises.",
    cta: { label: "Contact sales", href: "/contact" },
    features: [
      "16+ active forms",
      "Multiple users with role-based access",
      "Bulk send & CSV merge",
      "API & webhook access",
      "Dedicated account manager",
    ],
  },
];

const FAQ = [
  {
    q: "What counts as an \"active form\"?",
    a: "Any template you have published and ready to send. Submissions to that template are unlimited.",
  },
  {
    q: "What happens if I exceed my form limit?",
    a: "We'll prompt you to archive a form or upgrade — nothing breaks, no surprise bills.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You retain access until the end of your billing period.",
  },
  {
    q: "Are my completed PDFs stored?",
    a: "Yes — securely, with the option to export or delete at any time.",
  },
];

export default function PricingPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Pricing"
          title="Pricing built for professionals."
          subtitle="All plans include unlimited submissions, auto-named PDFs, e-signatures and inbox delivery. Choose your plan based on how many active forms you need."
        />
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`card flex flex-col p-7 ${
                p.featured ? "border-tick/40 ring-2 ring-tick/20" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                {p.badge ? (
                  <span className="chip border-tick/30 bg-tick/10 text-tick">
                    {p.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-ink/60">{p.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-ink">
                  {p.price}
                </span>
                <span className="text-sm text-ink/60">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-ink/75">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-tick" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.cta.href}
                className={`mt-7 ${p.featured ? "btn-tick" : "btn-secondary"}`}
              >
                {p.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-ink/10 bg-paper p-8 text-sm text-ink/70">
          <ul className="grid gap-2 sm:grid-cols-2">
            <li>• All prices in AUD, GST inclusive.</li>
            <li>• 14-day free trial on every plan. No credit card required.</li>
            <li>• Cancel or change plans anytime from your billing dashboard.</li>
            <li>• Need more than 15 active forms? Talk to us about Pro.</li>
          </ul>
        </div>
      </Section>

      <Section className="bg-paper">
        <SectionHeader eyebrow="FAQ" title="Pricing questions, answered." />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
          {FAQ.map((item) => (
            <details key={item.q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-ink">
                {item.q}
                <span className="text-ink/40 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
