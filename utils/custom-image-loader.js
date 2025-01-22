import nextConfig from "../next.config.mjs";
import path from "path";

export default function myImageLoader({ src, width }) {
  if (nextConfig.basePath && path.isAbsolute(src)) {
    return `${nextConfig.basePath}${src}?width=${width}`;
  }
  return `${src}?width=${width}`;
}
