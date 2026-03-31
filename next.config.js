/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tr.rbxcdn.com',   // Roblox avatar CDN
      },
      {
        protocol: 'https',
        hostname: '**.rbxcdn.com',   // wildcard for all Roblox CDN subdomains
      },
    ],
  },
};

module.exports = nextConfig;
