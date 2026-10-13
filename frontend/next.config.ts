import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL)
  : null;

if (apiUrl && !["http:", "https:"].includes(apiUrl.protocol)) {
  throw new Error("NEXT_PUBLIC_API_URL must use http or https.");
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV === "development" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(apiUrl?.hostname ?? ""),
    remotePatterns: apiUrl
      ? [
          {
            protocol: apiUrl.protocol === "https:" ? "https" : "http",
            hostname: apiUrl.hostname,
            ...(apiUrl.port ? { port: apiUrl.port } : {}),
            pathname: "/uploads/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
