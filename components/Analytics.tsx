import { GoogleTagManager } from "@next/third-parties/google";

export const GTM_ID = "GTM-T6FD36L2";

/**
 * Google Tag Manager, requested by SEO. Renders the loader script in <head>
 * (via `@next/third-parties`) plus the standard <noscript> iframe fallback
 * in <body>. Skipped in development and on /studio so admin sessions don't
 * pollute the stats.
 */
export function AnalyticsHead({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <GoogleTagManager gtmId={GTM_ID} />;
}

export function AnalyticsBody({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
