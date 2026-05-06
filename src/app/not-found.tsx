import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="eyebrow">404</span>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          We can't find that page.
        </h1>
        <p className="mt-3 max-w-md text-ink/65">
          The link may be broken, or the page may have moved. Try heading back
          to the homepage.
        </p>
        <Link href="/" className="btn-tick mt-8">
          Back to home
        </Link>
      </div>
    </SiteShell>
  );
}
