import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Karókí er bókað hjá Pablo Discobar; iframe-útgáfan virkaði ekki.
      {
        source: "/karaoke",
        destination: "https://pablodiscobar.is/karaoke",
        permanent: false,
      },
      // Ein aðalslóð: www → non-www (canonical er macondo.is).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.macondo.is" }],
        destination: "https://macondo.is/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
