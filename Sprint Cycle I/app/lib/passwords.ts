import crypto from "crypto";

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.scryptSync(password, salt, 32).toString("hex");
  return { salt, passwordHash };
}

export function checkPassword(password: string, salt: string, passwordHash: string) {
  if (!salt || !passwordHash) return false;
  const actual = Buffer.from(hashPassword(password, salt).passwordHash, "hex");
  const expected = Buffer.from(passwordHash, "hex");
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

const words = ["Harbor", "Cedar", "Lumen", "North", "Quilt", "Amber", "Maple", "Coral", "Birch", "Solstice"];

export function readablePassword() {
  const word = words[crypto.randomInt(words.length)];
  const number = crypto.randomInt(1000, 10000);
  return `${word}-${number}`;
}
