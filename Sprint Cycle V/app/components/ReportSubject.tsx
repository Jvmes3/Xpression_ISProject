import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { moderateAccount } from "../lib/actions";
import { db } from "../lib/db";
import { readDatabase } from "../lib/store";

export function reportSubjectTitle(kind: "post" | "comment", name: string) {
  const text = name.replace(/\s+/g, " ").trim();
  const subject = text
    ? text.length > 80 ? `${text.slice(0, 77)}...` : text
    : kind === "comment" ? "Comment" : "Post";
  return `Reports under ${subject}`;
}

async function personHref(accountId: number) {
  if (!Number.isInteger(accountId) || accountId <= 0) return "";
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT email, role FROM account WHERE account_id = ? LIMIT 1`,
    [accountId],
  );
  const row = rows[0];
  if (!row) return "";
  if (String(row.role) === "Creator") return `/profile/${accountId}`;
  const email = String(row.email || "").trim().toLowerCase();
  const person = readDatabase().accounts.find((account) => {
    const own = account.email.toLowerCase() === email;
    const login = account.application?.xpressionEmail?.toLowerCase() === email;
    return (own || login) && account.status !== "banned" && account.status !== "deactivated";
  });
  return person ? `/profile/${person.id}` : "";
}

export async function ReportSubject({
  title,
  person,
  accountId,
  back,
}: {
  title: string;
  person: string;
  accountId: number;
  back: string;
}) {
  const href = await personHref(accountId);
  return (
    <>
      <h1>{title}</h1>
      <div className="report-subject">
        <p className="report-person">{href ? <Link href={href}>{person}</Link> : person}</p>
        <form className="task-actions" action={moderateAccount}>
          <input type="hidden" name="accountId" value={accountId} />
          <input type="hidden" name="back" value={back} />
          <button className="button button-quiet" type="submit" name="task" value="warn">Warn</button>
          <button className="button button-quiet" type="submit" name="task" value="kick">Kick</button>
          <button className="button button-quiet" type="submit" name="task" value="ban">Ban</button>
        </form>
      </div>
    </>
  );
}
