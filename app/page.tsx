import Link from "next/link";

import { Footer } from "@/components/Footer";
import { SiteShell } from "@/components/SiteShell";
import { getMenuPageData } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { settings } = await getMenuPageData();

  return (
    <SiteShell>
      <main aria-label="Start" className="landing-stack">
        <section className="landing-intro" aria-labelledby="landing-heading">
          <p className="landing-kicker">mon nom bakery</p>
          <h1 id="landing-heading">brunch, kawa, wypieki</h1>
          {settings.description ? (
            <p className="landing-description">{settings.description}</p>
          ) : (
            <p className="landing-description">
              Sezonowa piekarnia i sniadaniownia z codziennym menu, kawa i
              rzeczami do zabrania po drodze.
            </p>
          )}
        </section>

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
      </main>
      <Footer settings={settings} />
    </SiteShell>
  );
}
