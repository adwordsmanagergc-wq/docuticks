import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://docuticks.com"),
  title: {
    default: "DocuTicks — Turn Scanned Documents Into Digital Tick & Sign Forms",
    template: "%s · DocuTicks",
  },
  description:
    "Upload any scanned PDF. DocuTicks turns it into an interactive tick-and-sign form. Completed forms email straight back to you, auto-named by the signer. From $49/month AUD.",
  openGraph: {
    title: "Tick. Sign. Done.",
    description:
      "The fastest way to turn scanned paperwork into digital forms your clients can complete in seconds.",
    type: "website",
    url: "https://docuticks.com",
    siteName: "DocuTicks",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tick. Sign. Done.",
    description:
      "Turn scanned PDFs into interactive tick-and-sign forms. Get the signed PDF back in your inbox.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
