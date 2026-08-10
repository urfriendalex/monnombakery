import Link from "next/link";

import {
  alternateLocale,
  localizedPath,
  ui,
  type Locale,
} from "@/lib/i18n";

export function LanguageSwitch({
  locale,
  path,
  placement,
}: {
  locale: Locale;
  path: "/" | "/menu";
  placement: "home" | "footer";
}) {
  const alternate = alternateLocale(locale);

  return (
    <nav
      className={`language-switch language-switch-${placement}`}
      aria-label={ui[locale].languageSwitchLabel}
    >
      <span aria-current="page">{locale.toUpperCase()}</span>
      <span aria-hidden="true">/</span>
      <Link href={localizedPath(alternate, path)} hrefLang={alternate}>
        {alternate.toUpperCase()}
        <span className="sr-only"> — {ui[alternate].languageName}</span>
      </Link>
    </nav>
  );
}
