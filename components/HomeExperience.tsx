import Link from "next/link";

import { FaqDisclosure } from "@/components/FaqDisclosure";
import { Footer } from "@/components/Footer";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { SiteShell } from "@/components/SiteShell";
import { localizedPath, ui, type Locale } from "@/lib/i18n";
import { absoluteUrl, siteName, siteUpdatedAt } from "@/lib/seo";
import { getMenuPageData } from "@/lib/sanity/queries";

export async function HomeExperience({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  const { settings } = await getMenuPageData(locale);
  const homePath = localizedPath(locale, "/");
  const menuPath = localizedPath(locale, "/menu");
  const description = settings.seoDescription ?? copy.homeDescription;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: siteName,
    url: absoluteUrl(homePath),
    description,
    image: absoluteUrl("/menu/photos/sniadanie-losos.jpeg"),
    address: settings.address,
    telephone: settings.phone,
    email: settings.email,
    sameAs: [settings.instagramUrl].filter(Boolean),
    dateModified: siteUpdatedAt,
    inLanguage: locale,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: [
      {
        "@type": "Question",
        name: copy.faqMenuQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${copy.faqMenuAnswer} menu: ${absoluteUrl(menuPath)}.`,
        },
      },
      {
        "@type": "Question",
        name: copy.faqLocationQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: settings.address
            ? `${copy.faqLocationPrefix} ${settings.address}.`
            : copy.faqLocationFallback,
        },
      },
      {
        "@type": "Question",
        name: copy.faqNewsQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${copy.faqNewsAnswer} ${copy.faqNewsInstagram} Instagram.`,
        },
      },
    ],
  };

  return (
    <SiteShell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <main aria-label="Start" className="landing-stack">
        <LanguageSwitch locale={locale} path="/" placement="home" />
        <Link className="landing-intro landing-intro-link" href={menuPath} aria-labelledby="landing-heading">
          <p className="landing-kicker">mon nom bakery</p>
          <h1 id="landing-heading">{copy.homeHeading}</h1>
          <p className="landing-description">{settings.description ?? copy.homeDescription}</p>
        </Link>

        <nav className="landing-actions" aria-label={copy.quickLinks}>
          <Link className="landing-link landing-link-primary" href={menuPath}>
            <span>Menu</span><span aria-hidden="true">/01</span>
          </Link>
          {settings.mapUrl ? (
            <a className="landing-link" href={settings.mapUrl} target="_blank" rel="noreferrer">
              <span>Google Maps</span><span aria-hidden="true">/02</span>
            </a>
          ) : null}
          {settings.instagramUrl ? (
            <a className="landing-link" href={settings.instagramUrl} target="_blank" rel="noreferrer">
              <span>Instagram</span><span aria-hidden="true">/03</span>
            </a>
          ) : null}
          <a className="landing-link landing-link-tip" href="https://globaltips.io/t/313459?app" target="_blank" rel="noreferrer">
            <span>{copy.leaveTip}</span><span aria-hidden="true">/04</span>
          </a>
        </nav>

        <section className="landing-info" aria-labelledby="info-heading">
          <h2 id="info-heading">Info</h2>
          <div className="landing-info-grid">
            {settings.address ? <p><span>{copy.address}</span>{settings.address}</p> : null}
            {settings.openingHoursWeekdays ? <p><span>{copy.weekdays}</span>{settings.openingHoursWeekdays}</p> : null}
            {settings.openingHoursWeekend ? <p><span>{copy.weekend}</span>{settings.openingHoursWeekend}</p> : null}
          </div>
        </section>

        <FaqDisclosure address={settings.address} mapUrl={settings.mapUrl} instagramUrl={settings.instagramUrl} locale={locale} />
      </main>
      <Footer settings={settings} locale={locale} path="/" />
    </SiteShell>
  );
}
