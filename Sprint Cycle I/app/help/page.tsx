import Link from "next/link";
import { fileTicket } from "../lib/actions";
import { emailRule } from "../lib/credentials.mjs";
import { currentAccount } from "../lib/session";
import { LaterSprint } from "../components/LaterSprint";
import { hasSprintData, readDatabase, type Ticket } from "../lib/store";

export const dynamic = "force-dynamic";

function statusLine(ticket: Ticket) {
  if (ticket.status === "answered") return "A moderator replied. The ticket is still open until it is marked resolved.";
  if (ticket.status === "resolved") return "This ticket is resolved.";
  if (ticket.status === "ignored") return "This ticket was set aside.";
  if (ticket.status === "escalated") return "A moderator sent this ticket to an administrator.";
  return "A moderator has this ticket.";
}

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string; sent?: string }>;
}) {
  if (!hasSprintData()) return <LaterSprint title="Help" />;

  const { email = "", error, sent } = await searchParams;
  const account = await currentAccount();
  const lookup = (email || account?.email || "").trim().toLowerCase();
  const tickets = lookup
    ? readDatabase().tickets.filter((ticket) => ticket.email === lookup)
    : [];

  return (
    <main className="page">
      <p className="eyebrow">Help</p>
      <h1>Send a ticket</h1>
      <p className="lede">
        Describe what is getting in the way. A moderator can reply, mark it resolved, or tell you why it was set aside.
      </p>
      <form className="form panel" action={fileTicket}>
        <label>
          Your name
          <input name="name" defaultValue={account?.application?.name || account?.displayName || ""} placeholder="Jordan Hale" />
        </label>
        <label>
          Email
          <input type="email" name="email" defaultValue={lookup} placeholder="youremail@gmail.com" />
        </label>
        <label>
          Title
          <input name="title" placeholder="I cannot open my portfolio" />
        </label>
        <label>
          Description
          <textarea name="description" placeholder="What happened, and what you expected to happen." />
        </label>
        {error === "required" ? <p className="note">Add your name, a title, and a description.</p> : null}
        {error === "email" ? <p className="note">{emailRule}</p> : null}
        {sent ? <p className="note">Your ticket was sent. The status is listed below.</p> : null}
        <button className="button" type="submit">Send ticket</button>
      </form>

      <section className="panel">
        <h2>Your tickets</h2>
        <p>Use the email on the ticket to see where it stands.</p>
        <form className="task-actions" method="get">
          <label>
            Email
            <input type="email" name="email" defaultValue={lookup} placeholder="youremail@gmail.com" />
          </label>
          <button className="button" type="submit">Check tickets</button>
        </form>
        {lookup && tickets.length === 0 ? <p>No tickets for {lookup} yet.</p> : null}
        <div className="task-list">
          {tickets.map((ticket) => (
            <article key={ticket.id}>
              <p className="flag">{ticket.status}</p>
              <h3>{ticket.title}</h3>
              <p>{statusLine(ticket)}</p>
              <p>{ticket.description}</p>
              {ticket.answer ? <p><strong>Reply.</strong> {ticket.answer}</p> : null}
              {ticket.ignoreReason ? <p><strong>Reason.</strong> {ticket.ignoreReason}</p> : null}
            </article>
          ))}
        </div>
      </section>
      <p className="more">
        <Link href="/#contact">Contact the moderator and administrator teams</Link>
      </p>
    </main>
  );
}
