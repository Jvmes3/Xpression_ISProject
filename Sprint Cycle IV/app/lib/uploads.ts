import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const allowed = new Set(["pdf", "png", "jpg", "jpeg", "gif", "webp", "txt"]);

export async function saveUpload(file: File) {
  const original = file.name || "file";
  const ext = original.includes(".") ? original.split(".").pop()?.toLowerCase() || "" : "";
  if (!allowed.has(ext)) {
    return { error: "Attach a PDF, PNG, JPG, GIF, WEBP, or text file." };
  }
  if (file.size <= 0 || file.size > 8 * 1024 * 1024) {
    return { error: "Choose a file that is 8 MB or smaller." };
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const stored = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  fs.writeFileSync(path.join(dir, stored), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${stored}`, filename: original };
}
