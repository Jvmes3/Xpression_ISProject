# Sprint Cycle I presentation — Xpression

Suggested length: about 10–12 minutes. Product features do not need to run.

## Outline

1. Interface approach
2. Sign-in
3. Role landing pages
4. Two use cases per role
5. Why the use cases differ
6. How the screens support the requirements
7. Run the splash screen
8. Splash code on GitHub
9. Cycle I materials on GitHub

---

## 1. Interface approach (about 1 minute)

Xpression uses one visual system for every role: a warm paper background, a serif wordmark, and a sidebar that changes with the signed-in role.

Sprint Cycle I delivers the screen designs in `Sprint Cycle I/ui-mockups/`. The Next.js app also runs the application record, sign-in, and the moderator and administrator desks. There is no PostgreSQL database. Accounts are stored in `data/xpression.json`.

Open the walkthrough from `ui-mockups/index.html`.

## 2. Sign-in (about 1 minute)

Show `sign-in.html`.

- Applicants create a login with their own email, such as a Gmail address, and a password. They use that same login later to check the application.
- If they have not started, the screen says Begin application.
- If they started and did not submit, it shows the role and an in-progress status, and they can edit.
- If it is pending, it says the application is still being processed.
- If it is approved, they can open that role, and further down the page they see an Xpression email and password.
- `application-form.html` asks name, age, reason, credentials, and extra questions for Creator, Mentor, or Talent Scout.
- A submitted application opens the answers. An unfinished one opens the form.
- Administrators and moderators are not on the public form. Create them with `npm run create-administrator` and `npm run create-moderator`, then sign in with those emails and passwords.
- Choosing more than one answer under "What do you make?" or "What do you review?" asks the applicant to list each kind of work. The questions follow that list.
- Leaving the form after Begin application does not submit it.

## 3. Landing page for each role (about 2 minutes)

Show one home quickly, then the others:

| Role | Screen | What the home emphasizes |
| --- | --- | --- |
| Creator | `landing-creator.html` | Explore, publish, portfolio, feedback, saved work |
| Creative Mentor | `landing-mentor.html` | Requests, structured feedback, nominations, history |
| Talent Scout | `landing-scout.html` | Search, portfolios, messages, opportunities |
| Community Moderator | `landing-moderator.html` | Reports, cases, featured nominations |
| Administrator | `landing-admin.html` | Users, approvals, categories, analytics, settings |

Cards marked “Designed this sprint” open mockups. Cards marked “Later sprint” are visible navigation only.

## 4. Two use cases per role (about 4 minutes)

| Role | Use case | Screens |
| --- | --- | --- |
| Creator | Explore Creative Work | `creator-feed.html`, `creator-work-detail.html` |
| Creator | Publish Creative Work | `creator-publish.html`, `creator-publish-confirm.html` |
| Mentor | Manage Review Requests | `mentor-requests.html`, `mentor-request-detail.html` |
| Mentor | Provide Structured Feedback | `mentor-feedback.html`, `mentor-feedback-sent.html` |
| Talent Scout | Search and review a portfolio | `scout-search.html`, `scout-portfolio.html` |
| Talent Scout | Contact and invite | `scout-message.html`, `scout-invite.html` |
| Moderator | Review reported work | `mod-queue.html`, `mod-case.html` |
| Moderator | Review featured nominations | `mod-nominations.html`, `mod-nomination.html` |
| Administrator | Manage user accounts | `admin-users.html`, `admin-user-detail.html` |
| Administrator | Generate a report | `admin-report-criteria.html`, `admin-report-results.html` |

On the music detail page, point out the SoundCloud frame, comments, and the optional GIF. On publish, point out the permalink field. On the mentor form, point out strengths, improvements, and recommendations.

## 5. Why these use cases differ (about 1 minute)

The set is not five copies of a feed.

- Creator: browse and a create form
- Mentor: an approval decision and a structured review form
- Talent Scout: search, a portfolio profile, a message thread, and a dated invitation
- Moderator: a moderation decision and a separate featured-content approval
- Administrator: an account update and an analytics report

## 6. Requirements (about 1 minute)

Use `UI Specification.md` if someone asks for a specific requirement. The short version:

- All roles can see a path to register, sign in, and sign out.
- The feed filters writing, visual art, and music.
- A published work is described as part of the creator’s portfolio.
- A work can be opened with its feedback.
- Mentors accept requests and file a structured review.
- Scouts search creators, open a portfolio, message, and invite.
- Moderators decide reports and featured nominations.
- Administrators search users, change account status, and lay out a usage report.

Say clearly that these are layouts. Buttons on the mockups do not save anything.

## 7. Run the home screen (about 1 minute)

From the repository root:

```text
npm install
npm run dev
```

Open the address printed next to `Local:` in the terminal. That is usually http://localhost:3000. If the terminal says port 3000 is in use, open the other address it prints.

Show the logo, the Xpression title, the five role links, Apply, and the three-line menu. Click one role and show that role's home. Open the menu and show Sign in. Say that none of these save an account or a post.

## 8. Splash code on GitHub

After the push, open the repository and show `app/page.tsx`, `app/layout.tsx`, and `public/logo.svg` on `main`.

## 9. Cycle I materials on GitHub

Show the `Sprint Cycle I` folder: `ui-mockups/`, `Meeting Notes.md`, `UI Specification.md`, and this outline.

## Speaking roles

| Person | Section |
| --- | --- |
| James Henson | Approach, meetings, GitHub folders |
| Jacob Fitchett | Sign-in, role homes, and the mockup walkthrough |
| Leeyand Blot Jr | How screens map to requirements, and what was left unbuilt |
| Clemenceau Senatus | Run the splash screen and show `app/` |
