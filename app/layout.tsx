import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { profile } from "@/content/projects";
import "./globals.css";

// Headings and the name only. One weight keeps the file small; body text stays on the system font.
const display = Bricolage_Grotesque({ weight: "600", subsets: ["latin"], variable: "--font-bricolage", display: "swap" });

const siteTitle = `${profile.name} · ${profile.title} and ${profile.secondTitle.toLowerCase()}`;
const siteDescription =
  "I build software that solves the business problem, then check that it did. Case studies: a delivery marketplace through five versions, real-time ambulance dispatch, and school management across more than ten schools.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: siteTitle, template: `%s · ${profile.name}` },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: siteTitle,
    description: siteDescription,
    url: "/",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${profile.name}, ${profile.title}` }],
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: ["/og.jpg"] },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: profile.siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin],
  alumniOf: "Federal University of Technology, Akure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={display.variable}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="mx-auto max-w-5xl px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
