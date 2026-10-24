import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { ViewTransitions } from "next-view-transitions";
import { Big_Shoulders, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ExitPreview } from "@/components/exit-preview";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollProgress } from "@/components/scroll-progress";
import { StickyDm } from "@/components/sticky-dm";
import { getSiteContent } from "@/lib/content";
import { SanityLive } from "@/lib/live";
import { sanityEnabled } from "@/lib/sanity";
import { siteUrl } from "@/lib/email";

const display = Big_Shoulders({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: ["400", "700"],
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  fallback: ["-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteContent();
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${brand.name} · PowerGrade, Presets, Templates & Mixing`,
      template: `%s · ${brand.name}`,
    },
    description: brand.description,
    openGraph: {
      title: brand.name,
      description: brand.tagline,
      type: "website",
      images: [
        {
          url: "/og.png?v=20261023",
          width: 1200,
          height: 630,
          alt: `${brand.name}. Cinema color, radio vocals: PowerGrade, presets, templates, and custom mixing.`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brand.name,
      description: brand.tagline,
      images: ["/og.png?v=20261023"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [content, draft] = await Promise.all([
    getSiteContent(),
    draftMode().then((dm) => dm.isEnabled),
  ]);
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.brand.name,
    url: `${siteUrl()}/`,
    creator: {
      "@type": "Organization",
      "@id": "https://studioraine.art/#org",
      name: "Studio Raine",
      url: "https://studioraine.art",
    },
  };
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl()}/#andrei`,
    name: content.brand.name,
    url: `${siteUrl()}/`,
    description: content.brand.description,
    sameAs: [...new Set([...content.socials.map((s) => s.href), content.industry.musoUrl].filter(Boolean))],
    subjectOf: {
      "@type": "WebPage",
      url: "https://studioraine.art/#portfolio",
    },
  };
  return (
    <ViewTransitions>
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){history.scrollRestoration="manual";window.scrollTo(0,0);addEventListener("load",function(){window.scrollTo(0,0)})}}catch(e){}})();',
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-accent-ink focus:px-4 focus:py-2 focus:rounded-[8px]"
        >
          Skip to content
        </a>
        <ScrollToTop />
        <ScrollReveal />
        <ScrollProgress />
        <StickyDm />
        <Nav
          brand={{
            name: content.brand.name,
            shortName: content.brand.shortName,
            logo: content.brand.logo,
          }}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {sanityEnabled() && <SanityLive />}
        {draft && (
          <>
            <VisualEditing />
            <ExitPreview />
          </>
        )}
      </body>
    </html>
    </ViewTransitions>
  );
}
