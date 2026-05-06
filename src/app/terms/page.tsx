import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Legal"
          title="Terms of service"
          subtitle="Last updated: 6 May 2026"
          align="left"
        />
      </Section>
      <Section className="bg-white">
        <div className="prose mx-auto max-w-3xl text-ink/80">
          <p>
            By using DocuTicks you agree to these terms. DocuTicks provides a
            platform for converting documents into digital tick-and-sign forms
            and storing the resulting submissions on your behalf.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-ink">Subscriptions</h2>
          <p className="mt-2">
            Plans are billed monthly in AUD (GST inclusive). You can cancel at
            any time and retain access until the end of the billing period.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-ink">Acceptable use</h2>
          <p className="mt-2">
            You agree not to use DocuTicks to send unlawful content, harass
            others, or breach any third party's intellectual property rights.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-ink">Liability</h2>
          <p className="mt-2">
            DocuTicks is provided on an "as is" basis. To the extent permitted
            by law, our liability is limited to the fees paid by you in the
            preceding twelve months.
          </p>
          <p className="mt-8 text-sm text-ink/60">
            This page is a template summary. The published version will be the
            full executed terms of service.
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
