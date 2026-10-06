import { hasSprintData, readDatabase, type AccountRole } from "../lib/store";

export function StaffList({
  id,
  title,
  role,
}: {
  id: string;
  title: string;
  role: Extract<AccountRole, "moderator" | "administrator">;
}) {
  if (!hasSprintData()) {
    return (
      <section id={id} className="panel">
        <h2>{title}</h2>
        <p className="note">This will be added in a future sprint cycle.</p>
      </section>
    );
  }

  const people = readDatabase().accounts.filter(
    (account) => account.role === role && account.status !== "banned" && account.status !== "deactivated",
  );

  return (
    <section id={id} className="panel">
      <h2>{title}</h2>
      {people.length === 0 ? <p>No one is listed on this team yet.</p> : null}
      <div className="task-list">
        {people.map((person) => (
          <article key={person.id}>
            <h3>{person.displayName?.trim() || person.email}</h3>
            <p className="meta-line">{person.email}</p>
            <p>{person.background?.trim() || "Background has not been added for this account."}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
