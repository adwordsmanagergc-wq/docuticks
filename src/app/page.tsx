import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Mail,
  FileSignature,
  PenLine,
  MousePointerClick,
  Smartphone,
  Layers,
  Palette,
  ScrollText,
  Send,
  Upload,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";
import { FormPreview } from "@/components/FormPreview";

const INDUSTRIES = [
  "Real Estate",
  "Health",
  "Finance",
  "Education",
  "Trades",
  "Property Management",
];

const FEATURES = [
  {
    icon: MousePointerClick,
    title: "Smart field placement",
    body:
      "Drag tick boxes, text fields, dates and signatures onto your form in seconds.",
  },
  {
    icon: FileSignature,
    title: "Legally compliant e-signatures",
    body: "Aligned with Australia's Electronic Transactions Act 1999.",
  },
  {
    icon: ScrollText,
    title: "Auto-named files",
    body:
      "Every completed form is named [Form Name]_[Signer Name]_[Date].pdf — searchable, sortable, done.",
  },
  {
    icon: Mail,
    title: "Inbox delivery",
    body: "Submissions email straight to you and any teammates you choose.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first for signers",
    body:
      "Clients complete forms on any phone, tablet or desktop. No app required.",
  },
  {
    icon: Layers,
    title: "Reusable templates",
    body:
      "Build once, send unlimited times within your plan's active form limit.",
  },
  {
    icon: Palette,
    title: "Branded forms",
    body: "Add your logo and colours so every form looks like yours.",
  },
  {
    icon: ShieldCheck,
    title: "Secure storage",
    body: "Encrypted in transit and at rest, hosted in Australia.",
  },
  {
    icon: CheckCircle2,
    title: "Audit trail",
    body:
      "IP address, timestamp and signer email captured on every submission.",
  },
];

const STEPS = [
  {
    icon: Upload,
    title: "Upload your document",
    body: "Drag in any scanned PDF or photo of a paper form.",
  },
  {
    icon: PenLine,
    title: "Drop in fields",
    body:
      "Add tick boxes, text fields, dates, dropdowns and a signature in seconds. Save it once, use it forever.",
  },
  {
    icon: Send,
    title: "Send and forget",
    body:
      "Share a link or email it. The completed PDF lands in your inbox, automatically named with the signer's name and date.",
  },
];

const USE_CASES = [
  {
    title: "Real estate",
    body: "Tenancy applications, listing authorities, condition reports.",
  },
  {
    title: "Allied health",
    body: "New patient intake, consent forms, treatment plans.",
  },
  {
    title: "Finance & broking",
    body: "Fact finds, fee disclosures, ID verification.",
  },
  {
    title: "Trades",
    body: "Quote acceptance, safety checklists, variation orders.",
  },
  {
    title: "Education",
    body: "Enrolment, excursion permission, medical forms.",
  },
  {
    title: "Body corporates & clubs",
    body: "Membership, proxy votes, incident reports.",
  },
];

const FAQ = [
  {
    q: "What counts as an active form?",
    a: "Any template you have published and ready to send. Submissions to that template are unlimited on every plan.",
  },
  {
    q: "Are e-signatures legally binding in Australia?",
    a: "Yes. DocuTicks signatures are aligned with the Electronic Transactions Act 1999 and capture the audit trail (timestamp, IP, signer email) required to evidence intent and identity.",
  },
  {
    q: "Where is my data stored?",
    a: "All data is stored in Australia (ap-southeast-2), encrypted in transit (TLS 1.2+) and at rest (AES-256).",
  },
  {
    q: "Can my clients sign on their phone?",
    a: "Yes. Forms are mobile-first by design — no app install, no sign-up required for the person completing the form.",
  },
];

export default function HomePage() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper">
        <div className="bg-paper-grid absolute inset-0 opacity-60 fade-mask-b" />
        <div className="container-x relative pb-24 pt-20 sm:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Built for busy professionals</span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
                Turn your scanned documents into{" "}
                <span className="relative whitespace-nowrap text-tick">
                  digital
                  <svg
                    aria-hidden
                    viewBox="0 0 200 8"
                    className="absolute -bottom-2 left-0 h-2 w-full"
                  >
                    <path
                      d="M2 5 C 50 1, 150 9, 198 4"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>{" "}
                tick-and-sign forms.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
                Upload any PDF, drop in tick boxes and a signature field, and
                send it. DocuTicks emails the completed form straight back to
                you — named after the person who signed it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/signup" className="btn-tick">
                  Start free trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/how-it-works" className="btn-secondary">
                  See how it works
                </Link>
              </div>
              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/60">
                <li className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-tick" /> No credit card required
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-tick" /> 14-day free trial
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-tick" /> Cancel anytime
                </li>
              </ul>
            </div>
            <div className="relative">
              <FormPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-ink/5 bg-white">
        <div className="container-x py-8">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-ink/50">
            Trusted by real estate agencies, allied health clinics, brokers and
            trades across Australia
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {INDUSTRIES.map((label) => (
              <span key={label} className="chip">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Paper forms are slowing you down.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/65">
            You print them. You scan them. You email them. You chase them. You
            re-scan them. You file them in the wrong folder. You do it again
            next week.
          </p>
          <p className="mt-4 text-lg font-medium text-ink">
            DocuTicks ends the cycle.
          </p>
        </div>
      </Section>

      {/* How it works */}
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="How it works"
          title="From scanned PDF to signed in three steps."
          subtitle="Upload once. Drop in fields. Send a link and get the signed PDF back in your inbox — auto-named."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card relative p-7">
              <span className="absolute right-5 top-5 text-xs font-semibold text-ink/30">
                0{i + 1}
              </span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-tick">
            Try it free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Features */}
      <Section className="bg-white">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need. Nothing you don't."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Use cases */}
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Use cases"
          title="Built for the forms you send every week."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <div key={u.title} className="card p-6">
              <h3 className="font-semibold text-ink">{u.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
                {u.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/use-cases" className="btn-secondary">
            See all use cases <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Pricing teaser */}
      <Section className="bg-white">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple monthly pricing. AUD."
          subtitle="All plans include unlimited submissions, auto-named PDFs, e-signatures and inbox delivery."
        />
        <div className="mx-auto mt-14 grid max-w-3xl gap-5 md:grid-cols-2">
          <PricingTeaser
            name="Entry"
            price="$49"
            tagline="For solo professionals."
            highlights={["1–5 active forms", "Unlimited submissions", "Branded with your logo"]}
          />
          <PricingTeaser
            name="Intermediate"
            price="$89"
            tagline="For small teams and growing practices."
            highlights={["6–15 active forms", "Up to 3 team members", "Priority support"]}
            featured
          />
        </div>
        <div className="mt-8 text-center">
          <Link href="/pricing" className="btn-secondary">
            See full pricing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Testimonial */}
      <Section className="bg-ink text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-2xl leading-relaxed sm:text-3xl">
            "We replaced four different paper forms in an afternoon. Tenants now
            complete applications on their phone in under five minutes — and the
            signed PDF lands in my inbox before they've left the property."
          </p>
          <p className="mt-6 text-sm text-white/60">
            — Principal, suburban real estate agency
          </p>
        </div>
      </Section>

      {/* Security */}
      <Section className="bg-white">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Security</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Built for documents that matter.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/65">
              256-bit TLS in transit. AES-256 at rest. Australian-hosted.
              GDPR-aware. Aligned with the Australian Electronic Transactions
              Act 1999.
            </p>
            <Link href="/security" className="btn-secondary mt-6">
              Read our security overview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SecurityCard title="TLS 1.2+" body="In transit" />
            <SecurityCard title="AES-256" body="At rest" />
            <SecurityCard title="ap-southeast-2" body="Australian hosting" />
            <SecurityCard title="ETA 1999" body="Aligned" />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-paper">
        <SectionHeader eyebrow="FAQ" title="Common questions, answered." />
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
        <div className="mt-8 text-center">
          <Link href="/faq" className="link-muted text-sm">
            See all FAQs →
          </Link>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink p-12 text-center text-white shadow-soft">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tick. Sign. Done.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Start your 14-day free trial. No credit card required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="btn-tick">
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="btn border border-white/20 text-white hover:border-white/40"
            >
              Talk to sales
            </Link>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}

function PricingTeaser({
  name,
  price,
  tagline,
  highlights,
  featured,
}: {
  name: string;
  price: string;
  tagline: string;
  highlights: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`card p-7 ${
        featured ? "border-tick/40 ring-2 ring-tick/20" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">{name}</h3>
        {featured ? (
          <span className="chip border-tick/30 bg-tick/10 text-tick">
            Most popular
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-ink/60">{tagline}</p>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-4xl font-semibold text-ink">{price}</span>
        <span className="text-sm text-ink/60">/month AUD</span>
      </div>
      <ul className="mt-6 space-y-2 text-sm text-ink/75">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-tick" /> {h}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`mt-6 w-full ${featured ? "btn-tick" : "btn-secondary"}`}
      >
        Start free trial
      </Link>
    </div>
  );
}

function SecurityCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-5 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs text-ink/60">{body}</p>
    </div>
  );
}
