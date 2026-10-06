import crypto from "crypto";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import { credentialError, emailRule, passwordRule } from "../app/lib/credentials.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "data", "xpression.json");
const seedPath = path.join(root, "data", "seed.json");

const roleArg = process.argv[2];
const labels = {
  moderator: "Community Moderator",
  administrator: "Administrator",
};

if (!labels[roleArg]) {
  console.error("Usage: node scripts/create-account.mjs moderator");
  console.error("       node scripts/create-account.mjs administrator");
  console.error("Optional: --name \"Ada Lowe\" --email you@example.com --password your-password --background \"MFA, Florida A&M University\"");
  process.exit(1);
}

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.scryptSync(password, salt, 32).toString("hex");
  return { salt, passwordHash };
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

function writeDatabase(db) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const displayName = arg("--name") || (await ask("Name: "));
const email = (arg("--email") || (await ask("Email: "))).trim().toLowerCase();
const password = arg("--password") || (await ask("Password: "));
const confirm = arg("--password") || (await ask("Confirm password: "));
const background = arg("--background") || (await ask("Background: "));

if (!displayName || !background) {
  console.error("A name and a background are required. Background can be education, training, or the work this person does.");
  process.exit(1);
}

const problem = credentialError(email, password);
if (problem === "email") {
  console.error(emailRule);
  process.exit(1);
}
if (problem === "password") {
  console.error(passwordRule);
  process.exit(1);
}
if (password !== confirm) {
  console.error("The passwords do not match.");
  process.exit(1);
}

const db = readDatabase();
const taken = db.accounts.some(
  (account) => account.email === email || account.application?.xpressionEmail === email,
);
if (taken) {
  console.error("That email is already an account. Choose a different email.");
  process.exit(1);
}

const { salt, passwordHash } = hashPassword(password);
db.accounts.push({
  id: crypto.randomUUID(),
  email,
  passwordHash,
  salt,
  role: roleArg,
  status: "active",
  displayName,
  background,
  application: null,
  sessionToken: "",
  createdAt: new Date().toISOString(),
});
writeDatabase(db);

console.log("");
console.log(`${labels[roleArg]} account saved.`);
console.log(`Name: ${displayName}`);
console.log(`Email: ${email}`);
console.log(`Background: ${background}`);
console.log("Sign in with this email and password on the Sign in page.");
console.log("The password is not shown again. It is stored only as a hash in data/xpression.json.");
