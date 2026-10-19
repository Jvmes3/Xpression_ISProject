import fs from "fs";
import path from "path";

const root = "app";
const files = [
  "mentor/desk/page.tsx",
  "scout/desk/page.tsx",
  "moderator/desk/page.tsx",
  "administrator/desk/page.tsx",
  "administrator/applications/[id]/page.tsx",
  "creator/desk/publish/page.tsx",
  "help/page.tsx",
  "apply/page.tsx",
  "components/TicketQueue.tsx",
  "creator/desk/[id]/page.tsx",
  "account/page.tsx",
  "application/form.tsx",
];

const buttonRe = /<button className="([^"]*)" type="(?:button" disabled|submit"(?: formAction=\{[^}]+\})?)>([^<]*)<\/button>/g;

for (const rel of files) {
  const file = path.join(root, rel);
  const source = fs.readFileSync(file, "utf8");
  const next = source.replace(buttonRe, '<NotReady className="$1">$2</NotReady>');
  if (next === source) {
    console.log("NO MATCH", rel);
    continue;
  }
  const depth = rel.split("/").length - 1;
  const importPath = `${"../".repeat(depth)}components/NotReady`;
  let out = next;
  if (!out.includes("components/NotReady") && !out.includes('from "./NotReady"')) {
    const statement = rel.startsWith("components/")
      ? 'import { NotReady } from "./NotReady";\n'
      : `import { NotReady } from "${importPath}";\n`;
    out = statement + out;
  }
  fs.writeFileSync(file, out);
  console.log("updated", rel);
}
