/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'ndyebagpfzycavdhilmw.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ndyebagpfzycavdhilmw.supabase.co',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
