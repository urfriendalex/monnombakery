import Image from "next/image";
import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <Link className="shell-logo-link" href="/" aria-label="Mon Nom Bakery">
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
