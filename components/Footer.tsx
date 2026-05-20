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
          {settings.address ? <p>{settings.address}</p> : null}
        </section>
        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading">Kontakt</h2>
          {settings.phone ? <p>{settings.phone}</p> : null}
          {settings.email ? <p>{settings.email}</p> : null}
        </section>
        <section aria-labelledby="social-heading">
          <h2 id="social-heading">Social</h2>
          {settings.instagramUrl ? (
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer">
              Instagram
            </a>
          ) : null}
        </section>
        <section aria-labelledby="reservation-heading">
          <h2 id="reservation-heading">Rezerwacje</h2>
          {settings.reservationUrl ? (
            <a href={settings.reservationUrl}>Zarezerwuj stolik</a>
          ) : (
            <p>Przyjmujemy na miejscu.</p>
          )}
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
