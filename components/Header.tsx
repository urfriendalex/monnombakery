import Image from "next/image";

import type { RestaurantSettings } from "@/types/menu";
import { ui, type Locale } from "@/lib/i18n";

export function Header({ settings, locale }: { settings: RestaurantSettings; locale: Locale }) {
  const copy = ui[locale];
  const brunchHoursWeekdays =
    settings.brunchHoursWeekdays ?? "10:00 - 15:00";
  const brunchHoursWeekend = settings.brunchHoursWeekend ?? "9:00 - 15:00";

  return (
    <header className="menu-header">
      <div className="header-brand">
        <p className="header-kicker">{copy.seasonal}</p>
        <Image
          className="logo-wordmark"
          src="/menu/text/menu-right.svg"
          alt={`${settings.name} menu`}
          width={528}
          height={147}
          priority
        />
      </div>
      <div className="header-meta">
        <p className="header-label">{copy.brunches}</p>
        <div className="hours" aria-label={copy.openingHours}>
          <div className="hours-row">
            <span>{copy.weekdays}</span>
            <time>{brunchHoursWeekdays}</time>
          </div>
          <div className="hours-row">
            <span>{copy.weekend}</span>
            <time>{brunchHoursWeekend}</time>
          </div>
        </div>
      </div>
    </header>
  );
}
