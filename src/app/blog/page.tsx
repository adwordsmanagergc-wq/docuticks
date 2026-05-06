import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Section, SectionHeader } from "@/components/Section";

export const metadata = { title: "Blog" };

const POSTS = [
  {
    slug: "scanned-pdf-to-fillable-form",
    title: "How to turn a scanned PDF into a fillable form",
    excerpt:
      "A 5-minute walkthrough: from a crinkled paper scan to a digital form your clients can complete on their phone.",
    readTime: "4 min read",
    category: "Guide",
  },
  {
    slug: "are-e-signatures-legally-binding-in-australia",
    title: "Are e-signatures legally binding in Australia?",
    excerpt:
      "What the Electronic Transactions Act 1999 actually says, and what your e-signature workflow needs to capture.",
    readTime: "6 min read",
    category: "Compliance",
  },
  {
    slug: "5-paper-forms-real-estate-agents-should-digitise",
    title: "5 paper forms every real estate agent should digitise",
    excerpt:
      "From listing authorities to condition reports, the paperwork costing you the most billable hours every week.",
    readTime: "5 min read",
    category: "Real estate",
  },
  {
    slug: "docuticks-vs-docusign-for-small-business",
    title: "DocuTicks vs DocuSign for small business",
    excerpt:
      "When the heavyweight e-signature tool is overkill, and what to use instead for repeat client paperwork.",
    readTime: "7 min read",
    category: "Comparison",
  },
];

export default function BlogPage() {
  return (
    <SiteShell>
      <Section className="bg-paper">
        <SectionHeader
          eyebrow="Blog"
          title="Practical writing on going paperless."
          subtitle="Plain-English guides on digital forms, e-signatures and Australian compliance."
        />
      </Section>
      <Section className="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card group flex flex-col p-7 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="chip w-fit border-tick/30 bg-tick/10 text-tick">
                {post.category}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-ink group-hover:text-ink-800">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {post.excerpt}
              </p>
              <span className="mt-6 text-xs text-ink/50">{post.readTime}</span>
            </Link>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
