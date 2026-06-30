import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs", "pdf-parse", "pdf2json", "mammoth", "pdfkit"],
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'https://ai-hiring-admin-portal.vercel.app/admin',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: 'https://ai-hiring-admin-portal.vercel.app/admin/:path*',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
