import type { RestaurantSettings } from "@/types/menu";
import Image from "next/image";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ui, type Locale } from "@/lib/i18n";

const FALLBACK_PHONE = "+48 800 071 475";

export function Footer({ settings, locale, path }: { settings: RestaurantSettings; locale: Locale; path: "/" | "/menu" }) {
  const copy = ui[locale];
  const phone = settings.phone?.trim() || FALLBACK_PHONE;
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  return (
    <div className="footer-shell">
      <div className="footer-tear" aria-hidden="true" />
      <footer className="menu-footer">
        {settings.footerNote ? (
          <p className="footer-note">{settings.footerNote}</p>
        ) : null}

        <div className="footer-grid">
          <section aria-labelledby="address-heading">
            <h2 id="address-heading">{copy.address}</h2>
            {settings.address ? (
              <a href={settings.mapUrl} target="_blank" rel="noreferrer">
                {settings.address.replace(", ", ",\n")}
              </a>
            ) : null}
          </section>
          <section aria-labelledby="social-heading">
            <h2 id="social-heading">Social</h2>
            {settings.instagramUrl ? (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            ) : null}
            <a className="footer-phone" href={phoneHref}>
              {phone}
            </a>
          </section>
        </div>

        <LanguageSwitch locale={locale} path={path} placement="footer" />

        <Image
          className="decorative-logo"
          src="/logo/logo.svg"
          alt=""
          aria-hidden="true"
          width={360}
          height={240}
        />
      </footer>
    </div>
  );
}
