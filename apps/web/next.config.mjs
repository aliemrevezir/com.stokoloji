/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace paketleri ham TS olarak gelir; Next bunları transpile etsin.
  transpilePackages: ['@stokoloji/api-client', '@stokoloji/ui'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '1337' },
      { protocol: 'http', hostname: 'cms', port: '1337' },
    ],
  },
};

export default nextConfig;
