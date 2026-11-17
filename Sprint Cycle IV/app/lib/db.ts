import type { RowDataPacket } from "mysql2";
import mysql from "mysql2/promise";

declare global {
  var xpressionPool: mysql.Pool | undefined;
}

export function db() {
  if (!global.xpressionPool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
    global.xpressionPool = mysql.createPool(url);
  }
  return global.xpressionPool;
}

export type SqlRow = RowDataPacket;

export function likeTerm(value: string) {
  return `%${value.trim().replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
}
