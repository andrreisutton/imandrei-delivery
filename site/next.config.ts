import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.mzstatic.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/partners", destination: "/affiliates", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value:
              /* studioraine.art and its 1:1 mirror frame this site on the portfolio
               (2026-10-20). Without them here the stage loads, follows
               andrei.studioraine.art's 308 to this domain, and the browser
               blocks the frame, so the entry renders as a dead black box. */
            "frame-ancestors 'self' https://studioraine.art https://studio-raine.com https://*.sanity.studio https://www.sanity.io http://localhost:3333",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
