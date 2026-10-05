import {
  escalateTicket,
  ignoreTicket,
  replyToTicket,
  resolveTicket,
} from "../lib/actions";
import type { Ticket } from "../lib/store";

const reasons = [
  "Not enough detail to look into this",
  "This is already covered for members",
  "This is outside what a moderator can change",
  "This repeats another ticket",
];

export function TicketQueue({
  tickets,
  canEscalate,
  notice,
}: {
  tickets: Ticket[];
  canEscalate: boolean;
  notice?: string;
}) {
  return (
    <div className="task-list">
      {notice === "required" ? <p className="note">Write an answer before sending it.</p> : null}
      {notice === "reason" ? <p className="note">Choose why the ticket is being set aside. Other reason needs a short explanation.</p> : null}
      {tickets.length === 0 ? <p>No tickets are waiting here.</p> : null}
      {tickets.map((ticket) => (
        <article key={ticket.id}>
          <p className="flag">{ticket.status}</p>
          <h3>{ticket.title}</h3>
          <p className="meta-line">{ticket.name} · {ticket.email}</p>
          <p>{ticket.description}</p>
          {ticket.answer ? <p><strong>Reply.</strong> {ticket.answer}</p> : null}
          {ticket.ignoreReason ? <p><strong>Set aside because.</strong> {ticket.ignoreReason}</p> : null}
          <form className="form" action={replyToTicket}>
            <input type="hidden" name="id" value={ticket.id} />
            <label>
              Answer
              <textarea name="answer" defaultValue={ticket.answer} placeholder="A reply for the person who sent this ticket." />
            </label>
            <button className="button" type="submit">Answer</button>
          </form>
          <form className="task-actions">
            <button className="button" type="submit" formAction={resolveTicket.bind(null, ticket.id)}>Resolved</button>
            {canEscalate ? (
              <button className="button button-quiet" type="submit" formAction={escalateTicket.bind(null, ticket.id)}>Escalate to administrator</button>
            ) : null}
          </form>
          <form className="form" action={ignoreTicket}>
            <input type="hidden" name="id" value={ticket.id} />
            <label>
              If this ticket is set aside
              <select name="ignoreReason" defaultValue="">
                <option value="">Choose a reason</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
                <option value="other">Other reason</option>
              </select>
            </label>
            <label>
              Other reason
              <input name="otherReason" placeholder="Type a reason when you choose Other reason" />
            </label>
            <button className="button button-quiet" type="submit">Ignore</button>
          </form>
        </article>
      ))}
    </div>
  );
}
