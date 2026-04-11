/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dskmhj26c/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },

  reactStrictMode: true,

  // 👇 DODAJ TO
  allowedDevOrigins: ['192.168.1.14'], // albo '192.168.1.*'
};

module.exports = nextConfig;