# Sprint Cycle I — user interface design

This sprint designs the screens and runs one home screen. The buttons on that screen are placeholders. They do not sign anyone in or save a change.

Repository: https://github.com/Jvmes3/Xpression_ISProject.git

Scrum Master: Clemenceau Senatus

The terminal commands below run in this folder, `Sprint Cycle I`, which contains `package.json`.

## 1. Open the right folder

1. Open the folder named `Sprint Cycle I` inside `Xpression_ISProject`.
2. Confirm you can see `package.json` in that folder.
3. Click the address bar, type `powershell`, and press Enter.

If the terminal is already open and you are somewhere else, type:

```text
cd "C:\Users\cleme\OneDrive\Desktop\Xpression_ISProject\Sprint Cycle I"
```

Change that path if the project lives somewhere else.

If `node` is not recognized, install Node.js 20 or newer from https://nodejs.org, close the terminal, and open it again in this folder.

## 2. Install and start the site

1. Type `npm.cmd install` and press Enter. Wait until it finishes.
2. Type `npm.cmd run dev` and press Enter.
3. Leave this window open.
4. Find the line that starts with `Local:`.
5. Open that address in the browser. It is often `http://localhost:3000`. If the terminal prints another port, open that address instead.

There is no account to create. This screen does not authenticate anyone.

## 3. Home screen

The running page shows the application name, logo, and tagline.

1. The dark bar shows the **Xpression** name and logo.
2. The page introduces writing, visual art, and music.
3. **Sign in**, **About**, **Help**, and **Contact** are placeholders. They do not open an account or save a change.

## 4. Screen designs

These files are the sign-in screen, the role homes, and the two use cases for each role. Leave the splash screen running if you want both open.

1. In this folder, open `ui-mockups`, then double-click `index.html`.
2. Click **Creator**, **Mentor**, **Talent Scout**, **Moderator**, and **Administrator** to show each role home.
3. Scroll to the use-case lists and click these pairs:

- Creator: **Community feed**, then **Work detail**. Then **Publish work**, then **Published**.
- Mentor: **Review requests**, then **Request decision**. Then **Structured feedback**, then **Feedback recorded**.
- Talent Scout: **Find creators**, then **Creator portfolio**. Then **Message creator**, then **Invite to opportunity**.
- Moderator: **Reported work**, then **Moderation case**. Then **Featured nominations**, then **Nomination review**.
- Administrator: **User search**, then **Account status**. Then **Report criteria**, then **Report results**.

4. Under Sign-in, also open **Forgot password** and **Account ready**.

`UI Specification.md` says which requirement each screen supports. The mockups are static HTML. They are not the Next.js app.

## 5. Stop the site

1. Click the terminal where `npm run dev` is running.
2. Press `Ctrl+C`.

Next time, open `Sprint Cycle I` and run `npm run dev` again. You only run `npm install` again if someone adds a new tool.
