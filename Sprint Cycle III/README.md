# Sprint Cycle III — Database implementation

Due **November 4, 2026**. Presentation **November 5, 2026**.

Sprint III Scrum Master: **James Henson**. Confirmed team meeting: **November 2, 2026**. Attendance, meeting details and decisions still need to be recorded from the team’s actual records.

Team: **James Henson, Jacob, Clemenceu, and Leeyand**. The user confirmed successful pgAdmin access and execution of the database queries.

Start with [PRESENTATION.md](PRESENTATION.md) for the presentation walkthrough. Open [index.html](index.html) in a browser for links to the deliverables.

This sprint implements the PostgreSQL database selected in Cycle 0. Native SQL defines, populates, queries and validates the database. PostgreSQL fits Xpression because accounts, works, feedback, opportunities and moderation records have related data that must stay consistent. Prisma remains the planned application integration layer for a later sprint. The Sprint I application is a historical UI prototype and is not the database demonstration.

## Teammate access from main

Team folder: [Sprint Cycle III on main](https://github.com/Jvmes3/Xpression_ISProject/tree/main/Sprint%20Cycle%20III). From the repository root, with `main` checked out, pull the shared files and serve the guide:

```sh
git pull --ff-only
python3 -m http.server 8080 --bind 127.0.0.1 --directory "Sprint Cycle III"
```

On Windows, use `py -m http.server 8080 --bind 127.0.0.1 --directory "Sprint Cycle III"`. Leave that terminal open and visit **http://127.0.0.1:8080**. This opens `index.html` and its deliverable links. GitHub displays the source files; this local server displays the guide as a webpage.

Each teammate runs the database `setup` command below on their own computer. It generates their own ignored `.local/connection.txt` and database credentials for pgAdmin. Do not copy another teammate’s password or PostgreSQL data folder.

## First run on this Mac

Open Terminal in the repository root and run:

```sh
python3 "Sprint Cycle III/scripts/db.py" setup
python3 "Sprint Cycle III/scripts/db.py" verify
python3 "Sprint Cycle III/scripts/db.py" queries
python3 "Sprint Cycle III/scripts/db.py" demo
```

`setup` creates a separate PostgreSQL cluster in `Sprint Cycle III/.local/pgdata`, listening only on `127.0.0.1:55433`, and loads the schema and sample data. It does not use or change an existing PostgreSQL installation's database. If the sprint schema already exists, setup keeps its current data. The add/update demo rolls back its changes and can be repeated. PostgreSQL identity sequences may advance during a rolled-back demo; gaps are normal.

Requirements: Python 3 and PostgreSQL **16** server/client tools (`psql`, `initdb`, `pg_ctl`, `createdb`). The script detects `/Library/PostgreSQL/16/bin` on this Mac. If needed, set `XPRESSION_PG_BIN` to your PostgreSQL `bin` folder. No npm packages are required for the SQL demonstration.

Windows PowerShell, from the repository root:

```powershell
$env:XPRESSION_PG_BIN = 'C:\Program Files\PostgreSQL\16\bin'
py "Sprint Cycle III/scripts/db.py" setup
py "Sprint Cycle III/scripts/db.py" verify
py "Sprint Cycle III/scripts/db.py" queries
py "Sprint Cycle III/scripts/db.py" demo
```

## Connect with pgAdmin

1. Run `python3 "Sprint Cycle III/scripts/db.py" start`.
2. In Finder, open **Applications → PostgreSQL 16 → pgAdmin 4**. In pgAdmin's left sidebar, right-click **Servers → Register → Server**. On the **General** tab, enter the name **Xpression Sprint III**.
3. Set host **127.0.0.1**, port **55433**, maintenance database **xpression**, and username **xpression_demo**.
4. Read the generated password in `.local/connection.txt` and enter it. This file stays local and is excluded from Git.
5. Expand **Databases → xpression → Schemas → xpression → Tables**.
6. For presentation sample data, right-click the **xpression database → Query Tool**. Open `database/presentation_sample_data.sql` with the Query Tool's folder/Open File button. Highlight one complete SELECT at a time, including its semicolon, and click **Execute/Refresh** (F5). Results appear under **Data Output**. The five queries show accounts, creative work, opportunities, invitations and review requests with readable names and without password hashes.
7. To inspect an individual table, right-click it → **View/Edit Data → All Rows**. Use the prepared account SELECT for presenting names and roles without credential columns.

SQL files include `psql` commands such as `\echo`. Run the full files through the supplied script or SQL Shell. In pgAdmin Query Tool, select just the SQL statements, omitting lines that start with `\`.

## Native recreation on another PostgreSQL server

Create an **empty** database named `xpression` using pgAdmin or `createdb`, then run from this folder:

```sh
psql -X -v ON_ERROR_STOP=1 -d xpression -1 -f database/01_schema.sql -f database/02_seed.sql
psql -X -v ON_ERROR_STOP=1 -d xpression -f database/05_verify.sql
psql -X -v ON_ERROR_STOP=1 -d xpression -f database/03_queries.sql
psql -X -v ON_ERROR_STOP=1 -d xpression -f database/04_demo_mutations.sql
```

Supply `-h`, `-p`, and `-U` for that server as appropriate. These scripts create the `xpression` schema and do not drop existing data. Recreate in a new empty database to obtain a pristine baseline. Do not rerun schema/seed against an already populated schema.

## Everyday commands

```sh
python3 "Sprint Cycle III/scripts/db.py" status
python3 "Sprint Cycle III/scripts/db.py" shell
python3 "Sprint Cycle III/scripts/db.py" file "Sprint Cycle III/database/instructor_queries.sql"
python3 "Sprint Cycle III/scripts/db.py" stop
```

Inside SQL Shell: `SET search_path TO xpression, public;`, `\dt xpression.*`, `\d xpression.creative_work`, and `\q` to exit. Use `BEGIN;` and `ROLLBACK;` around exploratory writes to preserve the demo data.

## Deliverables

| Item | Location |
| --- | --- |
| Updated ER diagram | [docs/ERD.svg](docs/ERD.svg), [docs/ERD.png](docs/ERD.png), editable [docs/ERD.mmd](docs/ERD.mmd) |
| Updated data dictionary | [outputs/sprint-iii/Data Dictionary.xlsx](outputs/sprint-iii/Data%20Dictionary.xlsx), [docs/DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md) |
| Database implementation | [database/01_schema.sql](database/01_schema.sql) |
| Meaningful sample data | [database/02_seed.sql](database/02_seed.sql) |
| Search and relationships | [database/03_queries.sql](database/03_queries.sql) |
| Add and modify demo | [database/04_demo_mutations.sql](database/04_demo_mutations.sql) |
| Rules and verification | [database/05_verify.sql](database/05_verify.sql), [docs/BUSINESS_RULES.md](docs/BUSINESS_RULES.md) |
| Additional instructor queries | [database/instructor_queries.sql](database/instructor_queries.sql) |
| Three use cases | [docs/USE_CASES.md](docs/USE_CASES.md) |
| Design changes | [docs/DESIGN_CHANGES.md](docs/DESIGN_CHANGES.md) |
| Executed results | [evidence/](evidence/) |
| Team and submission status | [Meeting Notes.md](Meeting%20Notes.md), [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md) |

Sharing the Sprint III folder on `main` is authorized. Complete the November 2 meeting’s attendance and decisions, add any other actual meeting evidence, and obtain each member's real contribution and pull/push evidence before claiming those team requirements are complete.

Implementation references: [PostgreSQL 16 constraints](https://www.postgresql.org/docs/16/ddl-constraints.html), [initdb](https://www.postgresql.org/docs/16/app-initdb.html), [pg_ctl](https://www.postgresql.org/docs/16/app-pg-ctl.html). The original design is preserved under `Sprint Cycle II`; the supplied workbooks are byte-identical to those repository copies.
