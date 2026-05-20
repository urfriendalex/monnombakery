import type { RestaurantSettings } from "@/types/menu";

export function Header({ settings }: { settings: RestaurantSettings }) {
  return (
    <header className="menu-header">
      <h1 className="logo-wordmark" aria-label={settings.name}>
        {settings.name}
      </h1>
      <div className="header-meta">
        <div>
          <p className="header-label">Menu</p>
        </div>
        <div className="hours" aria-label="Godziny otwarcia">
          {settings.openingHoursWeekdays ? (
            <div className="hours-row">
              <span aria-hidden="true" />
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
