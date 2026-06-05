import type { Metadata } from "next";
import Link from "next/link";

import { FaqDisclosure } from "@/components/FaqDisclosure";
import { Footer } from "@/components/Footer";
import { SiteShell } from "@/components/SiteShell";
import {
  absoluteUrl,
  siteDescription,
  siteName,
  siteUpdatedAt,
} from "@/lib/seo";
import { getMenuPageData } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Sezonowe sniadania, kawa i wypieki w Warszawie",
  description: siteDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${siteName} - sezonowe sniadania, kawa i wypieki`,
    description: siteDescription,
    url: absoluteUrl("/"),
    images: [
      {
        url: absoluteUrl("/menu/photos/sniadanie-losos.jpeg"),
        width: 1200,
        height: 630,
        alt: "Sniadanie z lososiem i awokado w Mon Nom Bakery",
      },
    ],
  },
};

export default async function Home() {
  const { settings } = await getMenuPageData();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: siteName,
    url: absoluteUrl("/"),
    description: siteDescription,
    image: absoluteUrl("/menu/photos/sniadanie-losos.jpeg"),
    address: settings.address,
    telephone: settings.phone,
    email: settings.email,
    sameAs: [settings.instagramUrl].filter(Boolean),
    dateModified: siteUpdatedAt,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Gdzie sprawdzic aktualne menu Mon Nom Bakery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Aktualne dania, ceny i kategorie sa dostepne na stronie menu: ${absoluteUrl("/menu")}.`,
        },
      },
      {
        "@type": "Question",
        name: "Gdzie jest Mon Nom Bakery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: settings.address
            ? `Mon Nom Bakery znajduje sie pod adresem ${settings.address}.`
            : "Adres Mon Nom Bakery jest podany w sekcji informacyjnej na stronie.",
        },
      },
      {
        "@type": "Question",
        name: "Gdzie pojawiaja sie nowosci Mon Nom Bakery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nowe pozycje, aktualnosci i informacje o menu pojawiaja sie na stronie menu oraz na Instagramie Mon Nom Bakery.",
        },
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main aria-label="Start" className="landing-stack">
        <Link
          className="landing-intro landing-intro-link"
          href="/menu"
          aria-labelledby="landing-heading"
        >
          <p className="landing-kicker">mon nom bakery</p>
          <h1 id="landing-heading">brunch kawa wypieki</h1>
          {settings.description ? (
            <p className="landing-description">{settings.description}</p>
          ) : (
            <p className="landing-description">
              Sezonowa piekarnia i sniadaniownia z codziennym menu, kawa i
              rzeczami do zabrania po drodze.
            </p>
          )}
        </Link>

        <nav className="landing-actions" aria-label="Szybkie linki">
          <Link className="landing-link landing-link-primary" href="/menu">
            <span>Menu</span>
            <span aria-hidden="true">/01</span>
          </Link>
          {settings.mapUrl ? (
            <a
              className="landing-link"
              href={settings.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>Google Maps</span>
              <span aria-hidden="true">/02</span>
            </a>
          ) : null}
          {settings.instagramUrl ? (
            <a
              className="landing-link"
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>Instagram</span>
              <span aria-hidden="true">/03</span>
            </a>
          ) : null}
        </nav>

        <section className="landing-info" aria-labelledby="info-heading">
          <h2 id="info-heading">Info</h2>
          <div className="landing-info-grid">
            {settings.address ? (
              <p>
                <span>Adres</span>
                {settings.address}
              </p>
            ) : null}
            {settings.openingHoursWeekdays ? (
              <p>
                <span>Dni robocze</span>
                {settings.openingHoursWeekdays}
              </p>
            ) : null}
            {settings.openingHoursWeekend ? (
              <p>
                <span>Weekend</span>
                {settings.openingHoursWeekend}
              </p>
            ) : null}
          </div>
        </section>

        <FaqDisclosure
          address={settings.address}
          mapUrl={settings.mapUrl}
          instagramUrl={settings.instagramUrl}
        />
      </main>
      <Footer settings={settings} />
    </SiteShell>
  );
}
