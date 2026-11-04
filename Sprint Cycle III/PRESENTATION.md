# Sprint III presentation walkthrough

Presentation: **November 5, 2026**. Due: **November 4, 2026**.

Sprint III Scrum Master: **James Henson**. The team confirmed a meeting on **November 2, 2026**; attendees and decisions remain to be documented from actual records.

Team: **James Henson, Jacob, Clemenceu, and Leeyand**. The user confirmed that the pgAdmin rehearsal connected successfully and the database queries returned results.

## Prepare the windows

1. Open the repository root with `main` checked out and run `git pull --ff-only` to get the [shared Sprint III folder](https://github.com/Jvmes3/Xpression_ISProject/tree/main/Sprint%20Cycle%20III).
2. Run `python3 -m http.server 8080 --bind 127.0.0.1 --directory "Sprint Cycle III"` from that root. On Windows use `py` instead of `python3`. Keep the terminal open and visit **http://127.0.0.1:8080** for the `index.html` deliverable guide. Keep it open in a browser.
3. Open **outputs → sprint-iii → Data Dictionary.xlsx** in Excel.
4. Open Terminal in `Xpression_ISProject` and run:

   ```sh
   python3 "Sprint Cycle III/scripts/db.py" setup
   python3 "Sprint Cycle III/scripts/db.py" verify
   ```

   If the database is already installed, setup keeps the existing data. Verification should finish successfully. Keep this terminal open.

5. Optional visual database viewer: open **pgAdmin 4**, register **Xpression Sprint III** using `Sprint Cycle III/.local/connection.txt`, and expand **Databases → xpression → Schemas → xpression → Tables**. See README for connection steps. Do not display the password file while screen sharing.

On Windows use `py` in place of `python3`; PostgreSQL 16 must be installed first. Follow README to set the PostgreSQL tools path.

Each teammate runs `setup` on their own computer and uses their own generated `.local/connection.txt` for pgAdmin. Credentials and the PostgreSQL data folder stay ignored by Git.

## 1. Explain the technology

Say: “We use PostgreSQL, the technology selected in Sprint 0. Our data has relationships between accounts, creative works, reviews, opportunities and moderation records. Primary keys, foreign keys, checks, unique constraints and transactions keep those records consistent. This sprint demonstrates PostgreSQL through actual SQL. Prisma is planned for the later application integration.”

## 2. Show the updated ER diagram

In the browser guide, open **Full ER diagram**. The SVG supports browser zoom. It includes all **30 tables** and their implemented foreign keys. `*` marks a NOT NULL column; PK/FK label the keys. Arrows run from referenced parent to referencing child; the editable Mermaid file records the cardinalities.

Use the smaller diagrams for explanation:

- **Publishing:** Account → Creative Work; work categories; media; comments; follows and saved work.
- **Scouting:** Scout Account → Opportunity → Invitation ← Creator Account.
- **Moderation:** Work → Work Report → Moderation Case → assigned Moderator Account.

Say: “The 22 Sprint II entities remain. Eight supporting tables complete categories, media, notifications, private conversations, comment reports and saved scout candidates. Every role is one Account record.”

Open `docs/DESIGN_CHANGES.md` if asked why a field or table changed.

## 3. Show the data dictionary and actual structure

In Excel, open the **Tables** tab, then **Columns**, **Relationships**, **Constraints**, and **Triggers**. The workbook was generated from the running PostgreSQL catalog. It documents **231 fields** with exact types, required values, keys, defaults and generation expressions. Generated constants support role-specific foreign keys and are filled by PostgreSQL.

In pgAdmin, expand the actual Tables tree. Right-click **creative_work → Properties** to show columns and constraints, or use the terminal:

```sh
python3 "Sprint Cycle III/scripts/db.py" shell
```

Then run:

```sql
\dt xpression.*
\d xpression.creative_work
\d xpression.invitation
\q
```

These backslash commands work in SQL Shell (`psql`), not pgAdmin Query Tool.

## 4. Show meaningful sample data

1. Open **Finder → Applications → PostgreSQL 16 → pgAdmin 4**. Connect to **Xpression Sprint III** using the README connection instructions if this is your first time.
2. In the left sidebar, expand **Servers → Xpression Sprint III → Databases**. Right-click the **xpression database**, then select **Query Tool**.
3. Click the Query Tool's **Open File** folder button and open `Sprint Cycle III/database/presentation_sample_data.sql`.
4. Highlight only the first SELECT, from `SELECT` through its semicolon. Click **Execute/Refresh** (F5). The **Data Output** grid shows 10 meaningful accounts, including names, roles and disciplines. Password hashes are excluded.
5. Highlight and run the remaining SELECTs one at a time. They show creative works with creator names, opportunities with scout names, invitations with the creator and opportunity, and review requests with creator/mentor/work names. Running them individually lets you explain each result before moving on.

The same five queries are included in the browser guide under **SQL source → presentation_sample_data.sql**. They change no data. Do not run the whole file at once if you want to present each result separately.

You can also inspect individual tables by expanding **Databases → xpression → Schemas → xpression → Tables** and right-clicking **creative_work**, **opportunity**, **invitation**, or **review_request → View/Edit Data → All Rows**.

For a quick Query Tool or SQL Shell demonstration, run either of these SELECTs separately:

```sql
SELECT name, role, status, discipline, open_to_commissions
FROM xpression.account ORDER BY account_id;

SELECT title, media_type, creator_id, visibility
FROM xpression.creative_work ORDER BY work_id;
```

Examples to point out: **Amara Cole** writes poetry, **Luis Ortega** creates visual art, and **Nia Brooks** makes music. **Maya Chen** and **Theo Grant** are mentors. **Elena Park** and **Marcus Bell** are scouts. **Simone Reed** moderates and **Avery Morgan** administers. The fixtures are fictional and populate every table.

## 5. Run search and related-data queries

In Terminal, from the repository root:

```sh
python3 "Sprint Cycle III/scripts/db.py" queries
```

The output labels each query:

| Query | What to explain |
| --- | --- |
| Q1 | Search active music creators open to commissions; returns Nia Brooks and her available portfolio count. |
| Q2 | Join Amara Cole’s Account to her portfolio works. This supports publication and portfolio viewing. |
| Q3 | Join accepted review requests, mentor feedback, work, creator, mentor and the creator’s reply. |
| Q4 | Join an invitation to its opportunity, scout and invited creator. |
| Q5 | Join reported work to its case, creator and moderator. |
| Q7 | Group published work by medium for an administrator report. |
| Q8 | Show current account status together with the administrator’s audit history. |

For a slower presentation, open `database/03_queries.sql` in VS Code and run one SELECT at a time in pgAdmin Query Tool. Include `SET search_path TO xpression, public;` before unqualified table names. Skip lines beginning with `\` in pgAdmin. Showing the SQL and its returned rows demonstrates the native database operations.

## 6. Demonstrate adding and modifying data

Run:

```sh
python3 "Sprint Cycle III/scripts/db.py" demo
```

**Demo A** inserts “Blue hour platform,” updates its title and feature flag, and joins it to Amara Cole. Explain that the same work ID supports the creator’s portfolio.

**Demo B** inserts a winter waterfront opportunity, links Nia through Invitation, and records her acceptance with a response time. Explain the opportunity/creator unique constraint.

**Demo C** inserts a work report, shows the case PostgreSQL opens automatically, then closes the case with a hidden decision. The query shows that the original work’s visibility changes in the same transaction.

Each demo ends in `ROLLBACK`. The additions and updates execute in the real database and can be read inside the transaction; rollback restores the original sample rows for another rehearsal. To show a change that persists after the command exits, run a separately reviewed transaction with `COMMIT` instead.

Open `docs/USE_CASES.md` for the full explanation of these **three important use cases**, including entities, relationships, stored data and application responsibilities.

## 7. Demonstrate important rules

Run:

```sh
python3 "Sprint Cycle III/scripts/db.py" verify
```

The verification script catches expected database exceptions and fails if an invalid operation unexpectedly succeeds. Explain at least three rules:

1. An account’s normalized email is unique.
2. A work must reference a real Creator account; a music work needs a SoundCloud URL.
3. The same creator cannot receive the same opportunity invitation twice.
4. Feedback must match an accepted request; each feedback permits one owner reply.
5. Each work report opens one moderation case; a closed decision applies visibility.
6. A status change names an Administrator, updates the account, and preserves append-only history.

The source workbook contains **41 rules**; `docs/BUSINESS_RULES.md` maps every one. Explain that authentication, feedback privacy, message access, and permission to execute a workflow must be enforced by the later application. A stored administrator foreign key does not identify the person at the keyboard.

## 8. Respond to an instructor query

Open another SQL Shell:

```sh
python3 "Sprint Cycle III/scripts/db.py" shell
```

Start with:

```sql
SET search_path TO xpression, public;
```

Translate the request into four choices: the table holding the requested information, any relationships needed, the WHERE filter, and any COUNT/GROUP BY/ORDER BY. Use `\d xpression.table_name` to inspect unfamiliar columns.

Practice examples are in `database/instructor_queries.sql`: partial-name search, creators with two works, unanswered invitations, review counts by mentor, never-reported work and accounts by role/status. For example, find all music work:

```sql
SELECT creator_name, title, published_at
FROM public_work_feed
WHERE media_type = 'music'
ORDER BY published_at DESC;
```

Exit with `\q`. If experimenting with writes, wrap them in `BEGIN;` and `ROLLBACK;`.

## 9. Show the repository materials and team evidence

Open the **Sprint Cycle III** folder in VS Code. Show `database/`, `docs/`, `outputs/sprint-iii/`, `scripts/`, this guide, and the setup README. Open `evidence/` to show saved execution results if useful.

Open the [Sprint III folder on main](https://github.com/Jvmes3/Xpression_ISProject/tree/main/Sprint%20Cycle%20III) and check the latest commit when showing the shared repository materials. James Henson is the confirmed Sprint III Scrum Master, and November 2, 2026 is a confirmed meeting date. Attendance, agenda, decisions and any other required meeting evidence still need actual records. Team members also need their own meaningful contributions and pull/push evidence. Sharing this folder does not establish those individual contributions. `SUBMISSION_CHECKLIST.md` records their status.

## After the presentation

Stop the isolated database when you no longer need it:

```sh
python3 "Sprint Cycle III/scripts/db.py" stop
```

The stored rows remain in `.local/pgdata`. Run `start` or `setup` next time to open them again. No application server needs to run for this presentation.
