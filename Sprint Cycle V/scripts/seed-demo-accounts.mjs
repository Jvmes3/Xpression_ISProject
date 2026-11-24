import crypto from "crypto";
import fs from "fs";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "data", "xpression.json");
const seedPath = path.join(root, "data", "seed.json");
const password = "Xpression1!";

const people = [
  { name: "Amara Cole", email: "amara.cole@xpression.example", appRole: "Creator", media: ["Writing"], discipline: "Poetry" },
  { name: "Luis Ortega", email: "luis.ortega@xpression.example", appRole: "Creator", media: ["Visual art"], discipline: "Painting" },
  { name: "Nia Brooks", email: "nia.brooks@xpression.example", appRole: "Creator", media: ["Music"], discipline: "Songwriting" },
  { name: "Jordan Lee", email: "jordan.lee@xpression.example", appRole: "Creator", media: ["Writing"], discipline: "Essays" },
  { name: "Elena Voss", email: "elena.voss@xpression.example", appRole: "Creative Mentor", media: ["Writing", "Visual art", "Music"], discipline: "" },
  { name: "Marcus Hale", email: "marcus.hale@xpression.example", appRole: "Talent Scout", media: ["Visual art", "Music"], discipline: "" },
  { name: "Priya Shah", email: "priya.shah@xpression.example", staff: "moderator" },
  { name: "Ada Lowe", email: "ada.lowe@xpression.example", staff: "administrator" },
];

function hashPassword(value, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, passwordHash: crypto.scryptSync(value, salt, 32).toString("hex") };
}

function checkPassword(value, salt, passwordHash) {
  const actual = Buffer.from(hashPassword(value, salt).passwordHash, "hex");
  const expected = Buffer.from(passwordHash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function readDatabase() {
  if (!fs.existsSync(filePath)) {
    const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
    return { accounts: [], ...seed };
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed.accounts)) parsed.accounts = [];
  return parsed;
}

function applicationFor(person, login) {
  return {
    status: "approved",
    role: person.appRole,
    name: person.name,
    age: "21",
    reason: `${person.name} is a sample ${person.appRole} already stored in the database.`,
    credentials: person.discipline,
    experience: person.appRole === "Creative Mentor" ? "Structured feedback on writing, visual art, and music." : "",
    selectedMedia: person.media,
    areas: person.media.map((media) => ({
      id: crypto.randomUUID(),
      media,
      label: person.discipline || media,
      detail: "",
      sample: "",
    })),
    organization: person.appRole === "Talent Scout" ? "Independent" : "",
    opportunities: "",
    proof: "",
    xpressionEmail: person.email,
    xpressionPassword: "",
    xpressionSalt: login.salt,
    xpressionPasswordHash: login.passwordHash,
    mustChangePassword: false,
  };
}

const db = readDatabase();
const login = hashPassword(password);
const unused = hashPassword(crypto.randomBytes(24).toString("hex"));

for (const person of people) {
  const email = person.email.toLowerCase();
  let account = db.accounts.find(
    (item) => item.email === email || item.application?.xpressionEmail === email,
  );
  if (!account) {
    account = {
      id: crypto.randomUUID(),
      email,
      sessionToken: "",
      createdAt: new Date().toISOString(),
    };
    db.accounts.push(account);
  }
  account.email = email;
  account.status = "active";
  account.displayName = person.name;
  account.background = person.discipline || person.appRole || person.staff;
  account.sessionToken = "";
  if (person.staff) {
    account.role = person.staff;
    account.passwordHash = login.passwordHash;
    account.salt = login.salt;
    account.application = null;
    account.sessionKind = "role";
  } else {
    account.role = "applicant";
    account.passwordHash = unused.passwordHash;
    account.salt = unused.salt;
    account.application = applicationFor(person, login);
    account.sessionKind = "role";
  }
}

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, JSON.stringify(db, null, 2));

const envPath = path.join(root, ".env.local");
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const databaseUrl = envText.split(/\r?\n/).find((line) => line.startsWith("DATABASE_URL="))?.slice("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "")
  || "mysql://root@localhost:3306/xpression";
const connection = await mysql.createConnection(databaseUrl);
const mysqlHash = await bcrypt.hash(password, 10);
const missing = [];
for (const person of people) {
  const [result] = await connection.query(
    "UPDATE account SET password_hash = ? WHERE email = ?",
    [mysqlHash, person.email],
  );
  if (!result.affectedRows) missing.push(person.email);
}
await connection.end();

const failed = [];
for (const person of people) {
  const account = db.accounts.find((item) => item.email === person.email);
  const staffOk = person.staff && checkPassword(password, account.salt, account.passwordHash);
  const roleOk = !person.staff && account.application?.status === "approved"
    && checkPassword(password, account.application.xpressionSalt, account.application.xpressionPasswordHash);
  if (!staffOk && !roleOk) failed.push(person.email);
}

if (missing.length || failed.length) {
  console.error(missing.length ? `Missing in MySQL: ${missing.join(", ")}` : "");
  console.error(failed.length ? `Sign-in check failed: ${failed.join(", ")}` : "");
  process.exit(1);
}

console.log("Sample accounts can sign in.");
console.log("Password for every sample account: Xpression1!");
