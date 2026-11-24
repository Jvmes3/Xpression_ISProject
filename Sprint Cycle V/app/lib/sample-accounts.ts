import type { MediaKind, ApplicantRole } from "./application";
import { db } from "./db";

export const samplePassword = {
  salt: "xpression-sample-account",
  passwordHash: "685c468c7abd8c8648d1862eecd67a69d6def00cf61f4e7fa6b9dc04f66131d9",
};

type SamplePerson = {
  key: string;
  name: string;
  email: string;
  discipline: string;
  commissions: boolean;
  appRole?: ApplicantRole;
  media?: MediaKind[];
  staff?: "moderator" | "administrator";
};

export const samplePeople: SamplePerson[] = [
  { key: "amara-cole", name: "Amara Cole", email: "amara.cole@xpression.example", appRole: "Creator", media: ["Writing"], discipline: "Poetry", commissions: true },
  { key: "luis-ortega", name: "Luis Ortega", email: "luis.ortega@xpression.example", appRole: "Creator", media: ["Visual art"], discipline: "Painting", commissions: true },
  { key: "nia-brooks", name: "Nia Brooks", email: "nia.brooks@xpression.example", appRole: "Creator", media: ["Music"], discipline: "Songwriting", commissions: true },
  { key: "jordan-lee", name: "Jordan Lee", email: "jordan.lee@xpression.example", appRole: "Creator", media: ["Writing"], discipline: "Essays", commissions: false },
  { key: "elena-voss", name: "Elena Voss", email: "elena.voss@xpression.example", appRole: "Creative Mentor", media: ["Writing", "Visual art", "Music"], discipline: "", commissions: false },
  { key: "marcus-hale", name: "Marcus Hale", email: "marcus.hale@xpression.example", appRole: "Talent Scout", media: ["Visual art", "Music"], discipline: "", commissions: false },
  { key: "priya-shah", name: "Priya Shah", email: "priya.shah@xpression.example", staff: "moderator", discipline: "", commissions: false },
  { key: "ada-lowe", name: "Ada Lowe", email: "ada.lowe@xpression.example", staff: "administrator", discipline: "", commissions: false },
];

let ready: Promise<void> | null = null;

export function ensureSampleAccounts() {
  if (!ready) {
    ready = insertSampleAccounts().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready.catch(() => undefined);
}

async function insertSampleAccounts() {
  const values = samplePeople.map(() => "(?, ?, ?, 'active', ?, ?)").join(", ");
  const params = samplePeople.flatMap((person) => [
    person.name,
    person.email,
    person.staff === "moderator"
      ? "Moderator"
      : person.staff === "administrator"
        ? "Administrator"
        : person.appRole === "Creative Mentor"
          ? "Mentor"
          : person.appRole === "Talent Scout"
            ? "Talent Scout"
            : "Creator",
    person.discipline || null,
    person.commissions ? 1 : 0,
  ]);
  await db().query(
    `INSERT IGNORE INTO account (name, email, role, status, discipline, open_to_commissions)
     VALUES ${values}`,
    params,
  );
}
