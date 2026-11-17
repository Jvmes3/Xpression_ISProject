# Sprint Cycle IV — run the application

Scrum Master: Leeyand Blot

Sprint Cycle I already opens the site. In that folder, `npm.cmd install` and `npm.cmd run dev` show the home page and the role pages, and the sign-in screen stays on the sign-in page. This folder continues from that site. The same screens now sign people in, take applications, and open one working retrieval for each role. Those retrievals read the MySQL database from Sprint Cycle III.

Follow the steps in order. Each step is one action.

Repository: https://github.com/Jvmes3/Xpression_ISProject.git

The commands from step 4 on run in this folder, `Sprint Cycle IV`, which contains `package.json`.

## 1. Stop the Sprint Cycle I site

1. Click the terminal where Sprint Cycle I is running `npm run dev`.
2. Press `Ctrl+C`.
3. Close that site in the browser.

Both folders use port 3000. The Cycle IV site starts after the Cycle I site has stopped.

## 2. Load the Sprint Cycle III database

Sprint Cycle I did not use MySQL. This site does. The database name is `xpression`. If you already ran `Sprint Cycle III\sql\01-schema.sql` and `02-sample-data.sql`, go to step 3.

1. Open `Sprint Cycle III\sql`.
2. Click the address bar, type `powershell`, and press Enter.
3. MySQL must be running. If root has a password, add `-p` after `-u root`.

```text
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < 01-schema.sql"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < 02-sample-data.sql"
```

Those two files create the tables and the sample pieces, reports, and account rows. The names in that sample, such as Amara Cole, are what the searches return. Sign-in uses the accounts created in the steps below.

## 3. Open the Sprint Cycle IV folder

1. Open the folder named `Sprint Cycle IV` inside `Xpression_ISProject`.
2. Confirm you can see `package.json` in that folder.
3. Click the address bar, type `powershell`, and press Enter.

If the terminal is already open and you are somewhere else, type:

```text
cd "C:\Users\New User\Desktop\Xpression-Spring-Cycle-2\Xpression_ISProject\Sprint Cycle IV"
```

Change that path if the project lives somewhere else.

If `node` is not recognized, install Node.js 20 or newer from https://nodejs.org, close the terminal, and open it again in this folder. Sprint Cycle I used the same install.

## 4. Add the Sprint Cycle IV database changes

Stay in `Sprint Cycle IV`. These three files change the Cycle III database so this site can store a password, nest a reply, and show likes on the Unsent letter thread. Run them again any time you recreate the Cycle III database.

```text
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < sql\01-auth.sql"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < sql\02-comments.sql"
cmd /c "`"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe`" -u root --default-character-set=utf8mb4 < sql\03-unsent-thread.sql"
```

If `root` has a password, add `-p` after `-u root`.

## 5. Create the local settings file

In the same folder:

```text
copy .env.example .env.local
```

`.env.local` points the site at MySQL. The copy uses `mysql://root@localhost:3306/xpression`. If root has a password, open `.env.local` and put that password in `DATABASE_URL` before you continue.

## 6. Install and start the site

This folder has its own `package.json`. The install from Sprint Cycle I stays in that folder. Run install here too.

1. Type `npm.cmd install` and press Enter. Wait until it finishes.
2. Type `npm.cmd run dev` and press Enter.
3. Leave this window open.
4. Find the line that starts with `Local:`.
5. Open that address in the browser. It is often `http://localhost:3000`. If the terminal prints another port, open that address instead.

The home page is the same kind of page as Sprint Cycle I, with Apply and the Writing, Visual art, and Music cards.

## 7. Create the moderator and the administrator

Sprint Cycle I did not save a sign-in. This site does. Moderator and administrator accounts are created in a second terminal, while the site keeps running.

1. Open `Sprint Cycle IV` again.
2. Click the address bar, type `powershell`, and press Enter.
3. Type `npm.cmd run create-administrator` and press Enter.
4. Answer each prompt. The password needs at least 8 characters, 1 capital letter, 1 number, and 1 special character.
5. When that account is saved, type `npm.cmd run create-moderator` and press Enter.
6. Answer the prompts again, with a different email.

The prompts are First name, Last name, Email, Password, Confirm password, and Background. The window prints the email when it finishes. The password is not printed again.

## 8. Sign in

1. On the site, click **Sign in**.
2. Enter the administrator email and password from step 7.
3. You land on the administrator side. **Accounts** lists the rows in the database, including the sample rows from Sprint Cycle III.

A password that does not match stays on Sign in. The page says the email and password do not match.

## 9. Open a Creator, Mentor, or Talent Scout account

These three roles start from Apply. The application login is separate from the role login.

1. Click the **Xpression** logo to return home.
2. Click **Apply**.
3. Enter an email you already have, then a password, then confirm it. Click **Continue**.
4. Choose Creator, Creative Mentor, or Talent Scout.
5. Fill in the page, including what you mainly make. Click **Submit application**.
6. Sign out, then sign in again with the administrator account from step 7.
7. Open that application and click **Approve**.
8. The page shows a role email and a temporary password. Keep both.
9. Sign out. Sign in with that role email and the temporary password.
10. The site opens **Change password** and **Confirm password**. Enter a new password in both fields.

After that, the new password is the one for that role. A creator opens the community feed. A mentor opens Discover work. A talent scout searches creators and opens a portfolio. A moderator, signed in with the account from step 7, opens reported creative work.

The other sections stay on those desks and say they are not completed in this sprint.

## 10. Stop the site

1. Click the terminal where `npm run dev` is running.
2. Press `Ctrl+C`.

Next time, open `Sprint Cycle IV` and run `npm.cmd run dev` again. Run `npm.cmd install` again only if someone adds a new tool. Run the three SQL files in step 4 again only if the Cycle III database was recreated.
