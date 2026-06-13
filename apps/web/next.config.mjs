// next/image için izinli uzak host'lar: localhost + docker (cms) + prod Strapi.
// Prod host'u NEXT_PUBLIC_STRAPI_URL'den türetilir (build-time okunur).
const remotePatterns = [
  { protocol: 'http', hostname: 'localhost', port: '1337' },
  { protocol: 'http', hostname: 'cms', port: '1337' },
];

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
if (strapiUrl) {
  try {
    const u = new URL(strapiUrl);
    remotePatterns.push({
      protocol: u.protocol.replace(':', ''),
      hostname: u.hostname,
      port: u.port || '',
    });
  } catch {
    // geçersiz URL → sessizce atla (yalnız varsayılan host'lar kalır).
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace paketleri ham TS olarak gelir; Next bunları transpile etsin.
  transpilePackages: ['@stokoloji/api-client', '@stokoloji/ui'],
  images: { remotePatterns },
};

export default nextConfig;
