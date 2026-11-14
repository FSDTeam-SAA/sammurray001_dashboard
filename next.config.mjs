import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatar.iran.liara.run",
      "res.cloudinary.com"   // <-- ADD THIS
    ],
  },
};

export default nextConfig;
