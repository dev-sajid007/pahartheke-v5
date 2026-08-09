/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["pos.pahartheke.com"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pahartheke.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
