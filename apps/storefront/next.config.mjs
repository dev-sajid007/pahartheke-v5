/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  allowedDevOrigins: ["v3.pahartheke.com"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pahartheke.com" },
      { protocol: "https", hostname: "posapi.pahartheke.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;

