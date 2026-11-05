# Sprint Cycle III — presentation steps

Database: MySQL, name `xpression`.

Do this part first, then follow the numbered steps in order.

## Recreate the database

1. Open `Sprint Cycle III\sql`.
2. Click the address bar, type `powershell`, and press Enter.

```text
cd "C:\Users\New User\Desktop\Xpression-Spring-Cycle-2\Xpression_ISProject\Sprint Cycle III\sql"
```

3. MySQL must be running. If root has a password, add `-p` after `-u root`.

```text
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < 01-schema.sql"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < 02-sample-data.sql"
```

4. Open a session and leave it open. Paste the SQL in the steps below into this window.

```text
& "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root --default-character-set=utf8mb4
```

```sql
USE xpression;
```

5. Show every table. This is the first SQL command. Compare the names with the sheet names in `Data Dictionary.xlsx`.

```sql
SHOW TABLES;
```

| MySQL table | Data dictionary sheet |
| --- | --- |
| `account` | Account |
| `creative_work` | Creative Work |
| `review_request` | Review Request |
| `mentor_feedback` | Mentor Feedback |
| `feedback_reply` | Feedback Reply |
| `nomination` | Nomination |
| `scout_message` | Scout Message |
| `opportunity` | Opportunity |
| `invitation` | Invitation |
| `work_report` | Work Report |
| `moderation_case` | Moderation Case |
| `user_report` | User Report |
| `account_restriction` | Account Restriction |
| `status_change` | Status Change |
| `role_application` | Role Application |
| `analytics_report` | Analytics Report |
| `comment` | Comment |
| `follow` | Follow |
| `saved_work` | Saved Work |
| `help_ticket` | Help Ticket |
| `category` | Category |
| `platform_setting` | Platform Setting |

`SHOW TABLES` also lists `creator_portfolio` and `reported_work`. Those two are views, not sheets in the data dictionary.

`01-schema.sql` creates the tables, keys, and constraints. `02-sample-data.sql` loads the sample rows. Running them again drops `xpression` and rebuilds it.

## 1. Database technology

MySQL. Xpression stores creators, pieces, invitations, and reports that point at each other, so the database uses tables, primary keys, and foreign keys. The commands in this file are the SQL that creates, loads, and queries it.

## 2. Updated ER diagram

Open `Sprint Cycle III\ERD\ERD.png`. It is the crow's foot diagram of the MySQL tables. Each box lists that table's columns, including the primary key and foreign keys. The other pictures in that folder are the crow's foot diagrams for each role.

The data dictionary is `Sprint Cycle III\Data Dictionary\Data Dictionary.xlsx`. Each sheet is one table. The fields are listed first, and the rows under them are the sample people and pieces. The business rules are `Sprint Cycle III\Business Rules\Business Rules.xlsx`. The groups match the PDF: Identity, Creator, Mentor, Talent Scout, Moderator, Administrator, and Later requirements.

## 3. Database structure

```sql
SHOW TABLES;
```

| Table | What it stores |
| --- | --- |
| `account` | One person and one role |
| `creative_work` | A published piece. `creator_id` points at `account` |
| `review_request` | A creator asks a mentor to review a piece |
| `mentor_feedback` | Strengths, improvements, and a recommendation |
| `feedback_reply` | The creator's reply to one feedback |
| `nomination` | A mentor nominates a piece. A moderator may decide it |
| `scout_message` | A message from a talent scout to a creator |
| `opportunity` | A call created by a talent scout |
| `invitation` | One creator invited to one opportunity |
| `work_report` | A report on one piece |
| `moderation_case` | The moderator's decision on one report |
| `user_report` | A report on one account |
| `account_restriction` | Warn, restrict, or refer that report for a ban |
| `status_change` | An administrator changes an account status |
| `role_application` | An application to become a Mentor or Talent Scout |
| `analytics_report` | A report an administrator generated |
| `comment` | A comment on one piece. A GIF link is optional |
| `follow` | One account follows one creator |
| `saved_work` | One account saves one piece |
| `help_ticket` | A help request from one account |
| `category` | A genre or tag, such as Poetry |
| `platform_setting` | A platform setting, such as comments open |

`creator_portfolio` and `reported_work` are views. They are saved joins, not extra entities. The rows in MySQL are the same rows written in `Data Dictionary.xlsx`.

## 4. Sample data

```sql
SELECT name, role, discipline FROM account ORDER BY account_id;
```

```sql
SELECT creator_name, title, media_type, featured FROM creator_portfolio ORDER BY published_at;
```

Amara Cole, Luis Ortega, Nia Brooks, and Jordan Lee are creators. Elena Voss is the mentor. Marcus Hale is the talent scout. Priya Shah is the moderator. Ada Lowe is the administrator. Jordan Lee is suspended. The invitations, reports, feedback, and comments point at these people and these pieces.

## 5. Scripts

The files in `Sprint Cycle III\sql` are the operations:

| File | What it does |
| --- | --- |
| `01-schema.sql` | Creates the database |
| `02-sample-data.sql` | Loads the sample rows |
| `03-queries.sql` | Search and related-data queries |
| `04-changes.sql` | Adds a piece and features another |
| `05-rules.sql` | Shows rules rejecting bad inserts |

## 6. Retrieve / search

Posts that belong to Amara Cole:

```sql
SELECT title, media_type, featured, published_at
FROM creator_portfolio
WHERE creator_name = 'Amara Cole'
ORDER BY published_at;
```

## 7. Related data

Who was invited to Winter listening night:

```sql
SELECT o.title AS opportunity, a.name AS creator, i.status, i.invited_at
FROM invitation AS i
JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
JOIN account AS a ON a.account_id = i.creator_id
WHERE o.title = 'Winter listening night'
ORDER BY i.invited_at;
```

## 8. Add data

```sql
INSERT INTO creative_work (
  creator_id, title, media_type, description, soundcloud_url, featured, archived, published_at
)
SELECT account_id, 'Platform notes', 'Writing',
  'A short essay about the last train and the notebook Amara keeps for it.',
  NULL, FALSE, FALSE, '2026-11-03 16:00:00'
FROM account
WHERE email = 'amara.cole@xpression.example';
```

```sql
SELECT a.name AS creator, w.title, w.media_type, w.published_at
FROM creative_work AS w
JOIN account AS a ON a.account_id = w.creator_id
WHERE w.title = 'Platform notes';
```

## 9. Modify data

```sql
SELECT work_id, title, featured FROM creative_work WHERE title = 'Night bus';
```

```sql
UPDATE creative_work SET featured = TRUE WHERE title = 'Night bus';
```

```sql
SELECT work_id, title, featured FROM creative_work WHERE title = 'Night bus';
```

The same `work_id` comes back. Featuring the piece updates that row.

## 10. Instructor query

Use one of these if the instructor asks for a query that was not in the steps above. Each one returns rows.

```sql
SELECT title, media_type, soundcloud_url
FROM creator_portfolio
WHERE creator_name = 'Nia Brooks';
```

```sql
SELECT o.title, o.starts_on
FROM opportunity AS o
JOIN account AS s ON s.account_id = o.scout_id
WHERE s.name = 'Marcus Hale';
```

```sql
SELECT title, action_taken, case_status, moderator_name
FROM reported_work
WHERE moderator_name = 'Priya Shah';
```

To remove the piece added in step 8, then show the posts Amara still has:

```sql
DELETE FROM creative_work WHERE title = 'Platform notes';
```

```sql
SELECT title, published_at
FROM creator_portfolio
WHERE creator_name = 'Amara Cole'
ORDER BY published_at;
```

## 11. Three use cases

### Publish Creative Work

`account` and `creative_work`. One creator has many pieces through `creator_id`. The piece stores title, media type, description, SoundCloud URL when it is music, and `published_at`. Step 6 shows Amara's pieces. Step 8 adds one.

### Invite Creator to Opportunity

`account`, `opportunity`, and `invitation`. The scout is `scout_id` on the opportunity. The invitation stores the opportunity, the creator, the status, and `invited_at`. One opportunity can invite many creators. The same creator is invited once.

```sql
SELECT s.name AS scout, o.title, c.name AS creator, i.status
FROM invitation AS i
JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
JOIN account AS s ON s.account_id = o.scout_id
JOIN account AS c ON c.account_id = i.creator_id
WHERE o.title = 'Riverfront mural call';
```

### Review Reported Creative Work

`creative_work`, `work_report`, `moderation_case`, and the moderator's `account`. A piece can have many reports. One report has one case. The case stores findings, the action taken, and the status.

```sql
SELECT title, reason, reporter_name, findings, action_taken, case_status, moderator_name
FROM reported_work
WHERE title = 'Studio wall study'
ORDER BY reported_at;
```

## 12. Three database rules

From the `sql` folder:

```text
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 --table < 05-rules.sql"
```

1. Email is unique. A second account cannot use `amara.cole@xpression.example`.
2. A piece must belong to a Creator. Marcus Hale is a Talent Scout, so a piece cannot be stored on his account.
3. One creator is invited to the same opportunity only once.

The same script also rejects a music piece with no SoundCloud URL, and a second case on the same report. The other rules in `Business Rules.pdf` are enforced on the tables they belong to. For example, feedback is stored only after the review request is accepted, and only an administrator can change an account status.

## 13. GitHub

https://github.com/Jvmes3/Xpression_ISProject.git

Folder `Sprint Cycle III` contains the SQL scripts, this setup, `ERD\ERD.png`, `Data Dictionary\Data Dictionary.xlsx`, and `Business Rules\Business Rules.xlsx`.

