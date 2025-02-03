/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  basePath:
    //"/bzz/7900cc25771c5daa046a48faf0ebe0abb9bb472fc04814cc16b7740978390598",
    "",
  images: {
    loader: "custom",
    loaderFile: "./utils/custom-image-loader.js",
  },
  trailingSlash: true,
  // Orbitdb build issue: https://github.com/orbitdb/orbitdb/issues/1214
  reactStrictMode: false, // TODO: delete this when the orbitdb build issue is fixed?
  serverExternalPackages: ["classic-level"], // To fix the orbitdb build issue, it needs next.js 15+
};

export default nextConfig;
