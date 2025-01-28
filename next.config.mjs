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
};

export default nextConfig;
