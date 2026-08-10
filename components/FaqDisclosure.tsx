"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { localizedPath, ui, type Locale } from "@/lib/i18n";

type FaqDisclosureProps = {
  address?: string;
  mapUrl?: string;
  instagramUrl?: string;
  locale: Locale;
};

export function FaqDisclosure({
  address,
  mapUrl,
  instagramUrl,
  locale,
}: FaqDisclosureProps) {
  const copy = ui[locale];
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
          <span>{isOpen ? copy.faqCollapse : copy.faqExpand}</span>
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
            <h2>{copy.faqMenuQuestion}</h2>
            <p>
              {copy.faqMenuAnswer}{" "}
              <Link href={localizedPath(locale, "/menu")}>menu</Link>.
            </p>
          </article>
          <article>
            <h2>{copy.faqLocationQuestion}</h2>
            <p>
              {address
                ? `${copy.faqLocationPrefix} ${address}.`
                : copy.faqLocationFallback}
              {mapUrl ? (
                <>
                  {" "}
                  <a href={mapUrl} target="_blank" rel="noreferrer">
                    {copy.faqDirections}
                  </a>
                  .
                </>
              ) : null}
            </p>
          </article>
          <article>
            <h2>{copy.faqNewsQuestion}</h2>
            <p>
              {copy.faqNewsAnswer}
              {instagramUrl ? (
                <>
                  {" "}
                  {copy.faqNewsInstagram}{" "}
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
