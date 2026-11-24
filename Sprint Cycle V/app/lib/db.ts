import { readFileSync } from "fs";
import path from "path";
import type { RowDataPacket } from "mysql2";
import mysql from "mysql2/promise";

declare global {
  var xpressionPool: mysql.Pool | undefined;
}

const localUrl = "mysql://root@localhost:3306/xpression";

function urlFromFile(file: string) {
  try {
    const text = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("DATABASE_URL=")) continue;
      const value = trimmed.slice("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "");
      if (value) return value;
    }
  } catch {
    return "";
  }
  return "";
}

export function databaseUrl() {
  const fromEnv = process.env.DATABASE_URL?.replace(/^\uFEFF/, "").trim();
  if (fromEnv) return fromEnv;
  let dir = process.cwd();
  for (let i = 0; i < 6; i += 1) {
    const url = urlFromFile(path.join(dir, ".env.local")) || urlFromFile(path.join(dir, ".env"));
    if (url) return url;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return localUrl;
}

export function db() {
  if (!global.xpressionPool) {
    const url = databaseUrl();
    process.env.DATABASE_URL = url;
    global.xpressionPool = mysql.createPool(url);
  }
  return global.xpressionPool;
}

export type SqlRow = RowDataPacket;

export function likeTerm(value: string) {
  return `%${value.trim().replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}
