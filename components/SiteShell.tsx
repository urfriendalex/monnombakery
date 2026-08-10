import Image from "next/image";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

export function SiteShell({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <div className="site-shell">
      <Link className="shell-logo-link" href={localizedPath(locale, "/")} aria-label="Mon Nom Bakery">
        <Image
          className="shell-logo"
          src="/logo/logo-dash.svg"
          alt=""
          aria-hidden="true"
          width={361}
          height={61}
          priority
        />
      </Link>
      {children}
    </div>
  );
}
