/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  rewrites: () => {
    return [
      {
        source: "/api/:slug*",
        destination: process.env.BACKEND_BASE ?? "http://localhost:8080",
      },
    ];
  },
  transpilePackages: ["react-daisyui"],
  reactStrictMode: true,
};

module.exports = nextConfig;
