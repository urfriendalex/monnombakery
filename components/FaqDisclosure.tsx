"use client";

import Link from "next/link";
import { useId, useState } from "react";

type FaqDisclosureProps = {
  address?: string;
  mapUrl?: string;
  instagramUrl?: string;
};

export function FaqDisclosure({
  address,
  mapUrl,
  instagramUrl,
}: FaqDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <section className="landing-info landing-faq">
      <div className="landing-faq-row">
        <span>FAQ</span>
        <button
          className="faq-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>{isOpen ? "Zwin" : "Rozwin"}</span>
          <span aria-hidden="true">{isOpen ? "-" : "+"}</span>
        </button>
      </div>
      <div
        id={panelId}
        className="landing-faq-panel"
        data-open={isOpen}
        aria-hidden={!isOpen}
        inert={isOpen ? undefined : true}
      >
        <div className="landing-faq-list">
          <article>
            <h2>Gdzie sprawdzic aktualne menu Mon Nom Bakery?</h2>
            <p>
              Aktualne dania, ceny i kategorie znajdziesz na stronie{" "}
              <Link href="/menu">menu</Link>.
            </p>
          </article>
          <article>
            <h2>Gdzie jest Mon Nom Bakery?</h2>
            <p>
              {address
                ? `Mon Nom Bakery znajduje sie pod adresem ${address}.`
                : "Adres lokalu jest podany w sekcji informacyjnej na stronie."}
              {mapUrl ? (
                <>
                  {" "}
                  <a href={mapUrl} target="_blank" rel="noreferrer">
                    Zobacz trase w Google Maps
                  </a>
                  .
                </>
              ) : null}
            </p>
          </article>
          <article>
            <h2>Gdzie pojawiaja sie nowosci Mon Nom Bakery?</h2>
            <p>
              Nowe pozycje i aktualnosci pojawiaja sie na stronie menu
              {instagramUrl ? (
                <>
                  {" "}
                  oraz na{" "}
                  <a href={instagramUrl} target="_blank" rel="noreferrer">
                    Instagramie
                  </a>
                </>
              ) : null}
              .
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
