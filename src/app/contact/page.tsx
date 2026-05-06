import { Mail, MessageSquare, Headphones } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Contact"
          title="Talk to a real person."
          subtitle="We're a small Australian team and we reply quickly — usually within one business day."
        />
      </Section>
      <Section className="bg-white">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <ContactCard
              icon={Mail}
              title="General enquiries"
              detail="hello@docuticks.com"
              body="Anything about the product, billing or partnerships."
            />
            <ContactCard
              icon={Headphones}
              title="Customer support"
              detail="support@docuticks.com"
              body="Already a customer? We'll respond same business day."
            />
            <ContactCard
              icon={MessageSquare}
              title="Sales (Pro plans)"
              detail="sales@docuticks.com"
              body="Looking for 16+ active forms, SSO, API access or a procurement chat?"
            />
          </div>

          <form className="card space-y-4 p-7">
            <h3 className="text-lg font-semibold text-ink">Send us a message</h3>
            <Field label="Your name" placeholder="Jane Smith" />
            <Field label="Email" type="email" placeholder="jane@example.com" />
            <Field label="Company / industry" placeholder="Smith Property" />
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-ink/50">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="How can we help?"
                className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-tick focus:outline-none"
              />
            </div>
            <button type="button" className="btn-tick w-full">
              Send message
            </button>
            <p className="text-xs text-ink/50">
              We'll only use your details to respond to your enquiry. See our
              privacy policy.
            </p>
          </form>
        </div>
      </Section>
    </SiteShell>
  );
}

function ContactCard({
  icon: Icon,
  title,
  detail,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  body: string;
}) {
  return (
    <div className="card flex items-start gap-4 p-6">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tick/10 text-tick">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink">{detail}</p>
        <p className="mt-1 text-sm text-ink/60">{body}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-ink/50">
        {label}
      </label>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm focus:border-tick focus:outline-none"
      />
    </div>
  );
}
