# Sprint Cycle V — add and update data

Scrum Master: Clemenceau Senatus

Sprint Cycle IV already signs people in and reads the MySQL database. This folder continues from that site. The same screens stay in place. Five actions now write to the database:

1. An administrator activates or deactivates an account.
2. A creator publishes a piece of creative work.
3. A creative mentor records structured feedback on a piece.
4. A talent scout creates a commission, audition, collaboration, or call.
5. A moderator updates a reported piece with a decision.

The other menu choices stay visible and say they are not completed in this sprint.

Repository: https://github.com/Jvmes3/Xpression_ISProject.git

## 1. Stop the Sprint Cycle IV site

1. Click the terminal where Sprint Cycle IV is running.
2. Press `Ctrl+C`.

Both folders use port 3000.

## 2. Open the Sprint Cycle V folder

The commands below run in `Sprint Cycle V`, the folder that contains this file and `package.json`.

```text
cd "C:\Users\New User\Desktop\Xpression-Spring-Cycle-2\Xpression_ISProject\Sprint Cycle V"
```

Change that path if the project lives somewhere else.

## 3. Use the database from the earlier sprints

Sprint Cycle V does not replace the tables. If `xpression` is already loaded, go to step 4.

If the database is missing, run the Cycle III scripts first, then the Cycle IV scripts, from their own folders:

```text
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < 01-schema.sql"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < 02-sample-data.sql"
```

From `Sprint Cycle IV`:

```text
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < sql\01-auth.sql"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < sql\02-comments.sql"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < sql\03-unsent-thread.sql"
```

If root has a password, add `-p` after `-u root`.

## 4. Create the local settings file

```text
copy .env.example .env.local
```

The copy uses `mysql://root@localhost:3306/xpression`. If root has a password, put that password in `DATABASE_URL` before you continue.

## 5. Install and start the site

```text
npm.cmd install
npm.cmd run dev
```

Open the address the terminal prints. It is often `http://localhost:3000`.

## 6. Create the moderator and the administrator

Leave the site running. In a second terminal opened in this same folder:

```text
npm.cmd run create-administrator
npm.cmd run create-moderator
```

Use a different email for each one. The password needs at least 8 characters, 1 capital letter, 1 number, and 1 special character.

## Default sample accounts

These are the people already stored in the sample SQL. Sign in with the email and password on each row.

| Role | Name | User | Password |
| --- | --- | --- | --- |
| Creator | Amara Cole | amara.cole@xpression.example | Xpression1! |
| Creator | Luis Ortega | luis.ortega@xpression.example | Xpression1! |
| Creator | Nia Brooks | nia.brooks@xpression.example | Xpression1! |
| Creator | Jordan Lee | jordan.lee@xpression.example | Xpression1! |
| Creative Mentor | Elena Voss | elena.voss@xpression.example | Xpression1! |
| Talent Scout | Marcus Hale | marcus.hale@xpression.example | Xpression1! |
| Moderator | Priya Shah | priya.shah@xpression.example | Xpression1! |
| Administrator | Ada Lowe | ada.lowe@xpression.example | Xpression1! |

These eight accounts are part of the application. The first time the site runs, it adds them to sign-in and, when the `xpression` database is available, adds any of these rows that are missing. A new computer can sign in with this table. Accounts someone creates on one computer stay on that computer.

## 7. Sign in and try the five actions

Administrator: sign in, open Accounts, and activate or deactivate someone else. The card shows the status before you click. After the page reloads, the card shows the new status. Clicking the status the account already has is refused. An administrator cannot change their own account. A deactivated account cannot sign in. The sign-in page says the account has been deactivated. Activate it again and the same email can sign in.

Creator, mentor, and talent scout: Apply, submit, sign in as the administrator, approve the application, then sign in with the role email and temporary password and set a new password.

Creator: open Publish, add a title and a description, and publish. The piece appears on the feed. Publishing music with the sample link left blank is refused.

Mentor: open Structured feedback, choose a piece, and fill in all three boxes. Leaving one box empty is refused.

Talent scout: open Create an opportunity, add a title and a start date, and save. An end date before the start date is refused.

Moderator: sign in with the moderator account, open a reported piece, write findings, choose an action, and save. The card shows the action before and after. Empty findings are refused. Hidden or removed work leaves the feed.

## 8. Show the rows in MySQL

```text
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 -e ""USE xpression; SELECT account_id, name, status FROM account; SELECT work_id, title, media_type FROM creative_work ORDER BY work_id DESC LIMIT 5; SELECT feedback_id, work_id, strengths FROM mentor_feedback ORDER BY feedback_id DESC LIMIT 5; SELECT opportunity_id, title, starts_on, description FROM opportunity ORDER BY opportunity_id DESC LIMIT 5; SELECT case_id, action_taken, status, findings FROM moderation_case;"""
```

## 9. Demonstration video

Record the video from the running site. Store the file at `Demonstration/Sprint Cycle V Demonstration.mp4`. If the file is too large for GitHub, put a link the instructor can open in `Demonstration/VIDEO.md` instead.

The video shows the site running, a sign-in for each of the five roles, all five actions, the new or changed rows in MySQL, one invalid case, and one screen that already worked in Sprint Cycle IV. For an account status change and a moderation decision, show the value before the click and the value after the page reloads.

## 10. Stop the site

Press `Ctrl+C` in the terminal that is running `npm.cmd run dev`.
