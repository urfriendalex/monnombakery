import Image from "next/image";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <Image
        className="shell-logo"
        src="/logo/logo-dash.svg"
        alt="Mon Nom Bakery"
        width={361}
        height={61}
        priority
      />
      {children}
    </div>
  );
}
