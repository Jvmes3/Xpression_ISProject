# Sprint Cycle I — present the site

Sign-in is a screen in this sprint. Buttons that would complete a feature show: "This feature has not been implemented yet and will be done in a future sprint cycle." The working sign-in, applications, and role actions are saved in `Sprint Cycle III`.

Open a role from the bar, then use the **Role page >>** link at the bottom of that role's home. That link opens the role's own screens so they can be compared with the Sprint Cycle II database design.

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

## 2. Install and start the site

1. Type `npm.cmd install` and press Enter. Wait until it finishes.
2. Type `npm.cmd run dev` and press Enter.
3. Leave this window open.
4. Find the line that starts with `Local:`.
5. Open that address in the browser. It is often `http://localhost:3000`. If the terminal prints another port, open that address instead.

## 3. Home screen

1. Click the **Xpression** logo at the top left.
2. You are on the home screen. It introduces writing, visual art, and music.
3. The dark bar shows **Sign in**. That screen is part of the design. Submitting it stays on the sign-in page. Press the 3 lines at the top right to see **About**, **Help**, and **Contact**.

## 4. Role homes

Click each name in the bar under the title. Read the cards on that page. At the bottom, click the role link. It reads **Creator page >>**, **Mentor page >>**, **Talent Scout page >>**, **Moderator page >>**, or **Administrator page >>**. That link opens the role's own page.

1. Click **Creator**, then **Creator page >>**. The page has publish work, my portfolio, and feedback on my work.
2. Click **Mentor**, then **Mentor page >>**. The page has review requests, structured feedback, and nominate featured work.
3. Click **Talent Scout**, then **Talent Scout page >>**. The page has search creators, contact a creator, and invite to an opportunity.
4. Click **Moderator**, then **Moderator page >>**. The page has reported work, featured nominations, and reported users.
5. Click **Administrator**, then **Administrator page >>**. The page has user accounts, specialized-account approval, and an analytics report.

## 5. Menu

1. Click the three lines at the top right.
2. Click **Your application**. The page shows the application sign-in screen. Submitting it does not open an account in this sprint.
3. Click **Sign in**, **About**, **Help**, **Contact**, **Profile**, **Notifications**, and **Messages** one at a time. **Help** opens a ticket. **Contact** links to the moderator team and the administrator team.
4. Profile, Notifications, and Messages are the shared pages every role can open.

## 6. Sprint Cycle I screen designs

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

## 7. Stop the site

1. Click the terminal where `npm run dev` is running.
2. Press `Ctrl+C`.

Next time, open `Sprint Cycle I` and run `npm run dev` again. You only run `npm install` again if someone adds a new tool.
