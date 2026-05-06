import Link from "next/link";
import {
  Building2,
  Stethoscope,
  Briefcase,
  Wrench,
  GraduationCap,
  Users,
  ArrowRight,
} from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = { title: "Use cases" };

const USE_CASES = [
  {
    icon: Building2,
    title: "Real estate",
    body: "Tenancy applications, listing authorities, condition reports, key release acknowledgements.",
    sample: "Tenancy Application_Jane-Smith_2026-05-06.pdf",
  },
  {
    icon: Stethoscope,
    title: "Allied health",
    body: "New patient intake, consent forms, treatment plans, telehealth waivers.",
    sample: "New-Patient-Intake_Liam-Chen_2026-05-06.pdf",
  },
  {
    icon: Briefcase,
    title: "Finance & broking",
    body: "Fact finds, fee disclosures, ID verification, privacy consents.",
    sample: "Client-Fact-Find_Aisha-Patel_2026-05-06.pdf",
  },
  {
    icon: Wrench,
    title: "Trades",
    body: "Quote acceptance, safety checklists, variation orders, site induction sign-offs.",
    sample: "Quote-Acceptance_Tom-Burke_2026-05-06.pdf",
  },
  {
    icon: GraduationCap,
    title: "Education",
    body: "Enrolment, excursion permission, medical forms, photography release.",
    sample: "Excursion-Permission_Olivia-Tran_2026-05-06.pdf",
  },
  {
    icon: Users,
    title: "Body corporates & clubs",
    body: "Membership, proxy votes, incident reports, AGM nominations.",
    sample: "Proxy-Vote_Marcus-Reid_2026-05-06.pdf",
  },
];

export default function UseCasesPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Use cases"
          title="The forms you send every week — finally digital."
          subtitle="DocuTicks works for any professional repeatedly chasing the same paper form."
        />
      </Section>

      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u) => (
            <div key={u.title} className="card flex flex-col p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white">
                <u.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {u.body}
              </p>
              <div className="mt-5 flex-1" />
              <div className="rounded-lg border border-dashed border-ink/15 bg-paper px-3 py-2 font-mono text-xs text-ink/70">
                {u.sample}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-paper">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink p-12 text-center text-white">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Don't see your industry?
          </h2>
          <p className="mt-4 text-white/70">
            If you send a paper form more than once a month, DocuTicks pays for
            itself in week one.
          </p>
          <Link href="/signup" className="btn-tick mt-8">
            Try it free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </SiteShell>
  );
}
