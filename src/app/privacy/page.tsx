import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Legal"
          title="Privacy policy"
          subtitle="Last updated: 6 May 2026"
          align="left"
        />
      </Section>
      <Section className="bg-white">
        <div className="prose mx-auto max-w-3xl text-ink/80">
          <p>
            DocuTicks Pty Ltd ("DocuTicks", "we", "us") is committed to
            protecting the privacy of personal information collected through our
            services. This policy explains what we collect, how we use it, and
            your rights under the Privacy Act 1988 (Cth) and the Australian
            Privacy Principles.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-ink">
            Information we collect
          </h2>
          <p className="mt-2">
            Account information (name, email, company), form content uploaded by
            users, completed form submissions and the audit metadata
            (timestamp, IP address, user agent, signer email) attached to each
            submission.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-ink">How we use it</h2>
          <p className="mt-2">
            To deliver the service, deliver completed PDFs to the form owner,
            bill subscriptions, provide support, and maintain the security of
            the platform.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-ink">
            Where it is stored
          </h2>
          <p className="mt-2">
            All data is stored in Australia (ap-southeast-2), encrypted in
            transit and at rest. See our{" "}
            <a href="/security" className="underline">
              security overview
            </a>{" "}
            for details.
          </p>
          <h2 className="mt-8 text-xl font-semibold text-ink">Your rights</h2>
          <p className="mt-2">
            You can request access, correction, export or deletion of your data
            at any time by emailing{" "}
            <a href="mailto:privacy@docuticks.com" className="underline">
              privacy@docuticks.com
            </a>
            .
          </p>
          <p className="mt-8 text-sm text-ink/60">
            This page is a template summary. The published version will include
            full sub-processor and retention disclosures.
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
