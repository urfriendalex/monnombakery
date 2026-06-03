import type { RestaurantSettings } from "@/types/menu";
import Image from "next/image";

export function Footer({ settings }: { settings: RestaurantSettings }) {
  return (
    <footer className="menu-footer">
      {settings.footerNote ? (
        <p className="footer-note">{settings.footerNote}</p>
      ) : null}

      <div className="footer-grid">
        <section aria-labelledby="address-heading">
          <h2 id="address-heading">Adres</h2>
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
        </section>
      </div>

      <Image
        className="decorative-logo"
        src="/logo/logo.svg"
        alt=""
        aria-hidden="true"
        width={360}
        height={240}
      />
    </footer>
  );
}
