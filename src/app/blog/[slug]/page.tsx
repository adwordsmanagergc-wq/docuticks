import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";

const POSTS: Record<
  string,
  { title: string; category: string; readTime: string; body: string[] }
> = {
  "scanned-pdf-to-fillable-form": {
    title: "How to turn a scanned PDF into a fillable form",
    category: "Guide",
    readTime: "4 min read",
    body: [
      "If you still print, sign and re-scan the same form every week, this is for you. The good news: with the right tool, you only need to do the painful bit once.",
      "Step one is uploading the original scan. DocuTicks renders every page so you can place fields exactly where they belong — no need to recreate the form from scratch.",
      "Step two is field placement. Click anywhere on the page to drop a tick box, text field, date or signature. Mark which are required, and which are optional.",
      "Step three is sending the link. Your client opens it on their phone, fills it in, signs, and the completed PDF lands in your inbox — already named with their name and the date.",
    ],
  },
  "are-e-signatures-legally-binding-in-australia": {
    title: "Are e-signatures legally binding in Australia?",
    category: "Compliance",
    readTime: "6 min read",
    body: [
      "Short answer: yes, in the vast majority of cases. The Electronic Transactions Act 1999 (Cth) and corresponding state and territory acts establish that an electronic signature can satisfy a legal requirement for a signature, provided three tests are met.",
      "Identification — the method must identify the person and indicate their intention.",
      "Reliability — the method must be as reliable as appropriate for the purpose.",
      "Consent — both parties must consent to the electronic signature.",
      "DocuTicks captures the timestamp, IP address, signer email and a hash of the signature image on every submission, so you can evidence each of these tests if challenged.",
    ],
  },
  "5-paper-forms-real-estate-agents-should-digitise": {
    title: "5 paper forms every real estate agent should digitise",
    category: "Real estate",
    readTime: "5 min read",
    body: [
      "Most agencies still rely on paper for at least five recurring forms. Here's the list — and what each one looks like once it's digital.",
      "1. Tenancy applications. The biggest time sink. Move it digital and applicants complete it on their phone in under five minutes.",
      "2. Listing authorities. Get vendors signed up faster, with the auto-named PDF in your file before you leave the appraisal.",
      "3. Condition reports. Sign-off in the moment, with a clear audit trail.",
      "4. Key release acknowledgements. Tiny form, huge friction-saver.",
      "5. Repair authorisations. Fewer phone tag rounds, more done by lunchtime.",
    ],
  },
  "docuticks-vs-docusign-for-small-business": {
    title: "DocuTicks vs DocuSign for small business",
    category: "Comparison",
    readTime: "7 min read",
    body: [
      "DocuSign is the heavyweight of the e-signature world — and that comes with a heavyweight price tag and feature surface most small businesses never use.",
      "DocuTicks is built for the specific case where you're sending the same form repeatedly: tenancy applications, intake forms, quote acceptances, enrolment forms.",
      "If you primarily need to convert scanned paperwork into reusable digital forms and have completed PDFs land in your inbox, DocuTicks is faster to set up, cheaper to run, and Australian-hosted by default.",
      "If you need advanced workflow routing across many parties, conditional logic, or deep CRM integrations, DocuSign is still the right tool.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <SiteShell>
      <article className="container-x py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        <header className="mt-8 max-w-2xl">
          <span className="chip border-tick/30 bg-tick/10 text-tick">
            {post.category}
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-ink/50">{post.readTime}</p>
        </header>
        <div className="prose prose-lg mt-10 max-w-2xl text-ink/80">
          {post.body.map((p, i) => (
            <p key={i} className="mt-5 text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
