const nextConfig = {
  transpilePackages: ["@hello-pangea/dnd"],
};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "undraw.co",
        pathname: "/illustrations/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;
