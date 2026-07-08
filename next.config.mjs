/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/bornbytheword-blog',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
