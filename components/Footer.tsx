import type { RestaurantSettings } from "@/types/menu";

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
              {settings.address}
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

      <div className="decorative-logo" aria-hidden="true">
        {(settings.decorativeLogoText ?? settings.name).split("\n").map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </footer>
  );
}
