# Meeting notes — Sprint Cycle III

Scrum Master: James Henson

These notes are the two meetings for this sprint. Attendees listed for each meeting are the four team members.

## Oct 29, 2026 — Sprint planning

| Field | Value |
| --- | --- |
| Sprint | Cycle III — database implementation |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Purpose | Decide how the Cycle II design will be built |

### Agenda

1. Confirm this sprint is the database, not the website
2. Choose a Scrum Master
3. Choose MySQL and where the early website code goes
4. Walk the schema against the data dictionary

### Decisions

1. **Scrum Master:** James Henson.
2. **MySQL.** The application language stays TypeScript, Next.js, React, and Node.js, with Prisma as the later connection. The database for this sprint is MySQL, because the design is tables, keys, and relationships. The database name is `xpression`.
3. **No website work in this sprint.** The sign-in and role screens already built are moved to `Website implementation sprint cycle`. They are not the Cycle III deliverable.
4. **The Cycle II design stands.** Implementation does not add or remove a field. Constraints and triggers are how the written rules are enforced. Account still has no password. Authentication is Sprint Cycle IV.
5. **SQL scripts are the implementation.** `01-schema.sql` creates the database. `02-sample-data.sql` loads it. Queries, changes, and rule checks are separate files so they can be run during the demonstration.
6. **One `account` table.** Creator, Mentor, Talent Scout, Moderator, and Administrator are values of `role`, not five tables.
7. **Invitation stays the link** between an opportunity and a creator, with a unique pair so the same creator is invited once.
8. **Every data-dictionary entity is a table.** The three use cases walked in the presentation are publish, invite, and reported work. The other tables, including feedback, comments, follows, and administrator actions, are loaded with the same people and pieces.

### Action items

| Owner | Action | Status |
| --- | --- | --- |
| Jacob Fitchett | Schema, keys, and triggers | Done in `sql/01-schema.sql` |
| James Henson | Scrum Master. Sample data and the read queries | Done in `sql/02-sample-data.sql` and `sql/03-queries.sql` |
| Leeyand Blot Jr | Rule checks against the existing business rules | Done in `sql/05-rules.sql`. The data dictionary and business rules were not rewritten. |
| Clemenceau Senatus | Setup instructions and the presentation order | Done in `README.md` and `Presentation` |

## Nov 2, 2026 — Sample data and the demonstration

| Field | Value |
| --- | --- |
| Sprint | Cycle III — database implementation |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Purpose | Load data a judge can follow, and run the demonstration queries |

### Agenda

1. Replace placeholder names with the people used in the sample data
2. Make sure every foreign key points at a real row
3. Run the search, the join, the insert, the update, and the rule checks

### Decisions

1. **Sample people.** Amara Cole, Luis Ortega, Nia Brooks, and Jordan Lee are creators. Elena Voss is the mentor. Marcus Hale is the talent scout. Priya Shah is the moderator. Ada Lowe is the administrator. Jordan's status is suspended. Maya Chen has a pending mentor application and does not have an account yet.
2. **Studio wall study is the reported piece.** It has two reports. Priya records one case for each report, and both cases keep the piece available.
3. **Three use cases:** a creator publishes a piece, a talent scout invites a creator, and a moderator decides reported work.
4. **Music rows need a SoundCloud URL.** `Harbor demo` has one. Writing and visual art do not.
5. **Search example:** posts that belong to Amara Cole. Both of her pieces come back.
6. **Related-data example:** invitations for Winter listening night, joined to the opportunity and the creator.
7. **Add example:** Amara Cole publishes `Platform notes`.
8. **Modify example:** `Night bus` is featured on the same row.
9. **Rule examples:** a duplicate email is rejected, a piece cannot be stored on Marcus Hale's account because he is a Talent Scout, and Luis cannot be invited to the mural call twice.
10. **No empty result.** Every select used in the demonstration returns at least one row. A delete is followed by a select of the creator's remaining pieces.

### Action items

| Owner | Action | Status |
| --- | --- | --- |
| All | Add photos from these meetings to `photos` when the meetings were face to face | Not yet |
| All | Pull the repository, then each member commits one meaningful part of this sprint | Not yet |
| All | Rehearse one ad hoc query from `sql/03-queries.sql` before November 5 | Not yet |
meet
