import { readFileSync } from "fs";
import path from "path";
import type { NextConfig } from "next";

function databaseUrl() {
  const current = process.env.DATABASE_URL?.replace(/^\uFEFF/, "").trim();
  if (current) return current;
  let dir = process.cwd();
  for (let i = 0; i < 4; i += 1) {
    for (const name of [".env.local", ".env"]) {
      try {
        const text = readFileSync(path.join(dir, name), "utf8").replace(/^\uFEFF/, "");
        for (const line of text.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("DATABASE_URL=")) continue;
          const value = trimmed.slice("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "");
          if (value) return value;
        }
      } catch {
        // The next folder up may hold the file.
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return "mysql://root@localhost:3306/xpression";
}

process.env.DATABASE_URL = databaseUrl();

const nextConfig: NextConfig = {
  devIndicators: false,
};

export default nextConfig;
