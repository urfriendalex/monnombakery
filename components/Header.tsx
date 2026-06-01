import type { RestaurantSettings } from "@/types/menu";

export function Header({ settings }: { settings: RestaurantSettings }) {
  return (
    <header className="menu-header">
      <div className="header-brand">
        <p className="header-kicker">sezonowe</p>
        <h1 className="logo-wordmark" aria-label={`${settings.name} menu`}>
          menu
        </h1>
      </div>
      <div className="header-meta">
        <p className="header-label">branchy</p>
        <div className="hours" aria-label="Godziny otwarcia">
          {settings.openingHoursWeekdays ? (
            <div className="hours-row">
              <span>w dni robocze</span>
              <time>{settings.openingHoursWeekdays}</time>
            </div>
          ) : null}
          {settings.openingHoursWeekend ? (
            <div className="hours-row">
              <span>w weekendy</span>
              <time>{settings.openingHoursWeekend}</time>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
