import Image from "next/image";

import type { RestaurantSettings } from "@/types/menu";

export function Header({ settings }: { settings: RestaurantSettings }) {
  const brunchHoursWeekdays =
    settings.brunchHoursWeekdays ?? "10:00 - 15:00";
  const brunchHoursWeekend = settings.brunchHoursWeekend ?? "9:00 - 15:00";

  return (
    <header className="menu-header">
      <div className="header-brand">
        <p className="header-kicker">sezonowe</p>
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
        <p className="header-label">branchy</p>
        <div className="hours" aria-label="Godziny otwarcia">
          <div className="hours-row">
            <span>w dni robocze</span>
            <time>{brunchHoursWeekdays}</time>
          </div>
          <div className="hours-row">
            <span>w weekendy</span>
            <time>{brunchHoursWeekend}</time>
          </div>
        </div>
      </div>
    </header>
  );
}
