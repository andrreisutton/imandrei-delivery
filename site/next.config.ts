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
              "frame-ancestors 'self' https://*.sanity.studio https://www.sanity.io http://localhost:3333",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
