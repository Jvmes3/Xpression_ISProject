# Sprint Cycle III submission checklist

Due: **November 4, 2026**. Presentation: **November 5, 2026**.

Use the setup and presentation instructions in this sprint’s README to open each deliverable. The statuses below distinguish executed technical evidence from team actions that still need real records. The execution logs were reviewed during preparation on November 3, 2026.

| Assignment item | Deliverable or evidence | Status |
| --- | --- | --- |
| Review and update Sprint II design | `docs/DESIGN_CHANGES.md`, updated ER diagram and Data Dictionary | Complete locally; changes and added structures documented |
| Use selected database technology | PostgreSQL native SQL implementation; `evidence/setup.txt` | Passed: actual PostgreSQL schema and sample data loaded |
| Complete-system structures | Schema, `docs/schema-metadata.json`, dictionary and ER diagram | Passed coverage check: all 30 catalog tables appear in both dictionary and diagram source |
| Primary/foreign keys, types, required fields and constraints | Schema SQL, live schema metadata and `docs/BUSINESS_RULES.md` | Implemented: 30 tables, 231 columns, 180 catalog constraints and 54 foreign-key relationships |
| Meaningful sample data in every major table | `database/02_seed.sql`; `evidence/setup.txt`; `evidence/verification.txt` | Passed: all 30 tables have sample rows; includes 10 accounts, 7 works, 6 role applications, 4 invitations and 3 cases |
| Required retrieve/search query | `database/03_queries.sql`; `evidence/queries.txt` | Passed: Q1 returns Nia Brooks as an active music creator accepting commissions |
| Required related-data query | `database/03_queries.sql`; `evidence/queries.txt` | Passed: portfolio, feedback/reply, invitation/opportunity and reported-work joins return meaningful results |
| Required add operation | `database/04_demo_mutations.sql`; `evidence/demo.txt` | Passed: real inserts demonstrated for work, opportunity, invitation and report; rolled back for repeatability |
| Required modify operation | `database/04_demo_mutations.sql`; `evidence/demo.txt` | Passed: work revision, invitation acceptance and closed moderation decision demonstrated; rolled back afterward |
| Instructor-requested query readiness | `database/instructor_queries.sql` and README shell instructions | Prepared; every presenter must still practice an unscripted SELECT/filter/join |
| Three functional use cases | `docs/USE_CASES.md` and `evidence/demo.txt` | Complete: publish work; scout invitation; moderator decides reported work |
| At least three important rules | `docs/BUSINESS_RULES.md`; `database/05_verify.sql`; `evidence/verification.txt` | Passed: all 41 rules documented; 83 live checks passed, including meaningful sample rows, rejected invalid operations and successful workflows |
| Creation/population/query commands | Native SQL files and README recreation commands | Complete locally; setup, search/join and mutation execution logged |
| Updated ER diagram | `docs/ERD.svg`, `docs/ERD.png`, `docs/ERD.mmd` and role views | Created; 30-table source coverage checked against the live schema catalog |
| Updated Data Dictionary | `outputs/sprint-iii/Data Dictionary.xlsx`; `docs/DATA_DICTIONARY.md` | Created; workbook opens as a valid XLSX package and lists all 30 tables; readable dictionary coverage checked |
| Database setup/recreation instructions | Sprint README; `scripts/db.py`; `evidence/setup.txt` | Mac setup executed successfully; Windows/native alternatives documented, not executed on a Windows machine |
| Sprint III Scrum Master | `Meeting Notes.md` | Confirmed by the user: **James Henson** |
| Team roster | `Meeting Notes.md` | Confirmed by the user: James Henson, Jacob, Clemenceu and Leeyand |
| Presenter pgAdmin rehearsal | User confirmation in this session | The user reports successful pgAdmin access and database queries returning results. |
| Required meeting documentation | `Meeting Notes.md` and genuine evidence | November 2, 2026 meeting date confirmed; time, attendees, agenda, decisions, actions and evidence remain pending. Add any other actual meetings to demonstrate meetings spread throughout the sprint. |
| Meaningful contribution by every member | Actual commits and contribution evidence | **Pending team completion/evidence** |
| Every member pulls the current repository | Actual team confirmation/evidence | **Pending team completion/evidence** |
| Materials stored in GitHub | [Sprint III folder on main](https://github.com/Jvmes3/Xpression_ISProject/tree/main/Sprint%20Cycle%20III) | Sharing authorized; inspect the latest remote commit when presenting the repository materials |
| Each member pushes a meaningful contribution | Actual GitHub history | **Pending: cannot be substituted by one prepared local package** |

## Before presenting

1. Recreate and verify the database using the README commands.
2. Open the ER diagram, updated dictionary, schema and query file before the presentation starts.
3. Run retrieve/search, related-data, add and modify operations against the live PostgreSQL database.
4. Use `docs/USE_CASES.md` to explain the three selected workflows and their keys.
5. Have each presenter explain at least one constraint and one relationship without reading the SQL aloud.
6. Pull the shared `main` branch with `git pull --ff-only`, complete real team records, and record each member’s actual contribution and pull/push evidence.

For the browser guide, run `python3 -m http.server 8080 --bind 127.0.0.1 --directory "Sprint Cycle III"` from the repository root (`py` on Windows), then open **http://127.0.0.1:8080**. Each teammate runs database `setup` separately to generate their own ignored credentials.

The prepared technical deliverables and the team’s meeting/GitHub obligations have different evidence requirements. Do not claim remote storage, participation, meeting attendance or a passed database run unless that evidence actually exists.
