/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['books.google.com', 'googleapis.com'], // Added googleapis.com for book covers
  },
};

export default nextConfig;
