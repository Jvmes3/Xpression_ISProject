# Sprint Cycle I — present the site

Follow the steps in order. Each step is one action.

The terminal commands run in this folder, `Sprint Cycle I`, which contains `package.json`.

Repository: https://github.com/Jvmes3/Xpression_ISProject.git

Scrum Master: Clemenceau Senatus

## 1. Open the right folder

1. Open the folder named `Sprint Cycle I` inside `Xpression_ISProject`.
2. Confirm you can see `package.json` in that folder.
3. Click the address bar, type `powershell`, and press Enter.

If the terminal is already open and you are somewhere else, type:

```text
cd "C:\Users\New User\Desktop\Xpression-Sprint-Cycle-1\Xpression_ISProject\Sprint Cycle I"
```

Change that path if the project lives somewhere else.

If `node` is not recognized, install Node.js 20 or newer from https://nodejs.org, close the terminal, and open it again in this folder.

## 2. Create an administrator and a moderator

Stay in `Sprint Cycle I`.

1. Type `npm.cmd run create-administrator` and press Enter.
2. Type the administrator's name, such as `Ada Lowe`, and press Enter.
3. Type an email with @ and a domain, such as `admin@xpression.com` or `name@school.edu`, and press Enter.
4. Type a password of at least 8 characters, with 1 capital letter, 1 number, and 1 special character, and press Enter.
5. Type the same password again, and press Enter.
6. Type a background, such as school, training, or the work they do, and press Enter.
7. Type `npm.cmd run create-moderator` and press Enter.
8. Type a different name, email, password, and background the same way.

Run either command again to add another administrator or another moderator. Each person needs their own email.

Write the emails and passwords down. The terminal does not show the password again.

## 3. Install and start the site

1. Type `npm.cmd install` and press Enter. Wait until it finishes.
2. Type `npm.cmd run dev` and press Enter.
3. Leave this window open.
4. Find the line that starts with `Local:`.
5. Open that address in the browser. It is often `http://localhost:3000`. If the terminal prints another port, open that address instead.

## 4. Home screen

1. Click the **Xpression** logo at the top left.
2. You are on the home screen. It introduces writing, visual art, and music.
3. Before anyone is signed in, the dark bar shows **Sign in**. Press the 3 lines at the top right to see **About**, **Help**, and **Contact**.

## 5. Role homes

Click each name in the bar under the title. Read the cards on that page, then go back with the logo.

1. Click **Creator**. Open **Explore creative work**, then open one piece. Go back and open **Publish work**.
2. Click **Mentor**. Open **Review requests**, then open **Structured feedback**.
3. Click **Talent Scout**. Open **Search creators**, then **Review a portfolio**. The contact and invitation cards are the second pair of screens.
4. Click **Moderator**. The cards are the moderator tasks. You will open them after you sign in as the moderator.
5. Click **Administrator**. The cards are the administrator tasks. You will open them after you sign in as the administrator.

## 6. Menu

1. Click the three lines at the top right.
2. Click **Your application** before you have an account. The page asks you to sign in with the email and password from Apply.
3. Click **Sign in**, **About**, **Help**, **Contact**, **Profile**, **Notifications**, and **Messages** one at a time. **Help** opens a ticket. **Contact** links to the moderator team and the administrator team.
4. Profile, Notifications, and Messages are the shared pages every role can open.

## 7. Apply

1. Click **Apply**.
2. Type an email with @ and a domain, such as `youremail@gmail.com`.
3. Type a password of at least 8 characters, with 1 capital letter, 1 number, and 1 special character, then type it again.
4. Click **Continue**.
5. The page says **Begin application**. The application is not submitted yet.
6. Click **Begin application**.
7. Type a name, an age, a reason, and credentials. Put school or training in credentials.
8. Choose **Creator**, **Creative Mentor**, or **Talent Scout**.
9. Under **What do you make?**, **What do you review?**, or **What work are you looking for?**, check Writing, Visual art, or Music.
10. Check a second box. A list appears. Type what you are applying for on each line, such as poetry and jazz. The questions under each line match that kind of work.
11. Click **Creator** in the top bar. The application stays in progress. It is not submitted.
12. Open the three-line menu and click **Your application**. The status says **Not submitted**. Click the application to keep editing.
13. Click **Submit application**. A blank form stays on the page. A sample link can be left blank, and a blank sample is not listed with the answers.
14. The page says: "Your application is still being processed. Please wait until our team has reviewed your application."
15. Click the application. The answers are visible and cannot be edited.
16. Open the menu and click **Sign out**.

## 8. Sign in as the applicant again

1. Open the menu and click **Sign in**.
2. Use the same email and password from Apply.
3. The status is still pending, with the same wait message.

## 9. Sign in as the administrator

1. Sign out.
2. Click **Sign in**.
3. Use the administrator email and password from step 2.
4. You land on the administrator desk. The dark bar shows the administrator name and **Your desk**. The links under the title become the administrator pages, and they stay there after you go back to the home screen. Click each one:

- **Applications.** Find the application you submitted. Click **See full application** to read every question and answer. Click **Approve**. **Undo decision** returns an approved or rejected application to pending.
- **Accounts.** Search by email or name. The buttons activate, suspend, ban, or deactivate an account.
- **Roles.** This list is the moderators and administrators you created in the terminal.
- **Categories.** Writing, Visual art, and Music are already there. Add a category, or save a rename.
- **Content.** Show, hide, or remove a post.
- **Reported activity.** Escalated moderator cases show up here.
- **Analytics.** Click **Generate report**.
- **Settings.** Change comments, GIFs, the upload note, or the moderation rule, then click **Save settings**.

5. Sign out.

## 10. Sign in as the applicant after approval

1. Sign in with the Apply email and password.
2. The status says **Approved**.
3. Click **Open** on the role workspace. That page is the role they were approved for, with two tasks for that role.
4. Go back, scroll down, and read **Your Xpression login**. That email ends in `@xpression.com` and has its own password.
5. Sign out.
6. Sign in with the `@xpression.com` email and password. That opens the same role workspace. The dark bar shows the person's name and role, and the links under the title become that role's pages. Those links stay after you click the logo and go back.
7. Sign in again with the original email when you want the application record.

## 11. Sign in as the moderator

1. Sign out.
2. Sign in with the moderator email and password from step 2.
3. You land on the moderator desk. The dark bar shows the moderator name and **Your desk**. The links under the title stay available after you leave the desk. Click each one:

- **Reported work.** Click **Keep available**, **Hide**, or **Remove**. **Undo** puts the report back to open.
- **Comments and GIFs.** Keep the reply, or remove it. **Undo** clears that choice.
- **Reported users.** Click **Warn**, **Restrict**, or **Escalate to administrator**. **Undo** clears a warning, restriction, or escalation.
- **Cases.** Type findings and an action, choose a status, and click **Save case**. Choose **open** and save again to reopen a case.
- **Featured nominations.** Click **Approve for featured** or **Decline**. **Undo** returns the nomination to pending.

4. Sign out.

## 12. Sprint Cycle I screen designs

These files are the detailed use-case screens. The running site stays open.

1. In this folder, open `ui-mockups`, then double-click `index.html`.
2. Click **Creator**, **Mentor**, **Talent Scout**, **Moderator**, and **Administrator** to show each role home.
3. Scroll to the use-case lists and click these pairs:

- Creator: **Community feed**, then **Work detail**. Then **Publish work**, then **Published**.
- Mentor: **Review requests**, then **Request decision**. Then **Structured feedback**, then **Feedback recorded**.
- Talent Scout: **Find creators**, then **Creator portfolio**. Then **Message creator**, then **Invite to opportunity**.
- Moderator: **Reported work**, then **Moderation case**. Then **Featured nominations**, then **Nomination review**.
- Administrator: **User search**, then **Account status**. Then **Report criteria**, then **Report results**.

4. Under Sign-in, also open **Forgot password** and **Account ready**.

## 13. Stop the site

1. Click the terminal where `npm run dev` is running.
2. Press `Ctrl+C`.

Next time, open `Sprint Cycle I` and run `npm run dev` again. You only run `npm install` again if someone adds a new tool.
