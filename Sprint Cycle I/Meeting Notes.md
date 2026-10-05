# Meeting notes — Sprint Cycle I

Scrum Master: Clemenceau Senatus

The notes below are the sprint decision log, dated across the cycle so the work is not bunched at the deadline. Attendees listed for each meeting are the four team members. Change a date or an attendee if a real meeting differed before you submit.

## Sep 24, 2026 — Sprint planning

| Field | Value |
| --- | --- |
| Sprint | Cycle I — user interface design and splash screen |
| Purpose | Prioritize Front-End of application |

### Agenda

1. Confirm Cycle I scope against the functional requirements
2. Choose a Scrum Master
3. Agree on design assumptions that Cycle 0 left open
4. Assign the sign-in flow, role homes, use-case screens, and splash screen

### Decisions

1. **Scrum Master:** Clemenceau Senatus.
2. **Build only the splash screen.** No authentication, database, Prisma, or use-case behavior.
3. **Mockups are static HTML** in `Sprint Cycle I/ui-mockups/`. They are not Next.js pages.
4. **Stack stays Cycle 0:** TypeScript, Next.js (App Router), React, Node.js 20+.
5. **One role per account** for navigation. After sign-in, the account role selects the landing page.
6. **Registration:** Creator, Creative Mentor, and Talent Scout may apply. Creator accounts can sign in immediately. Mentor and Talent Scout accounts stay pending until an Administrator approves them. Moderators are assigned by an Administrator. Administrators are system-created.
7. **Two use cases per role**, chosen so the screens are not all feeds:
   - Creator: Explore Creative Work; Publish Creative Work
   - Mentor: Manage Review Requests; Provide Structured Feedback
   - Talent Scout: Search for Creators and Review Creator Portfolio; Contact Creator and Invite Creator to Opportunity
   - Moderator: Review Reported Creative Work; Review Featured-Work Nominations
   - Administrator: Manage User Accounts; Generate Analytics and Reports

### Action items

| Owner | Action | Status |
| --- | --- | --- |
| Jacob Fitchett | Draft the visual system and screen layouts | Done in `ui-mockups/` |
| Clemenceau Senatus | Set up the Next.js splash at the repository root | Done |
| Leeyand Blot Jr | Map each screen to a functional requirement and keep the database out of this cycle | Done in `UI Specification.md` |
| James Henson | Notes and checklist | Done |

## Sep 23, 2026 — Sign-in and role homes

### Agenda

1. Review sign-in, registration, and the two account outcomes
2. Review a landing page for each of the five roles
3. Mark which landing actions are drawn this sprint and which wait

### Decisions

1. Sign-in collects email, password, and create-account paths.
2. Registration shows only Creator, Mentor, and Talent Scout. The approval rule is visible on the form.
3. Each landing page lists the major functions for that role. Only the selected use cases link to designed screens. Other functions are labeled for a later sprint.
4. Sample people used on the mockups: Amara Cole (Creator), Helen Park (Mentor), Marcus Adeyemi (Talent Scout), Priya Shah (Moderator), Jordan Ellis (Administrator).

## Sep 29, 2026 — Use-case screens

### Agenda

1. Walk two use cases for each role
2. Check that screen types differ across the set
3. Check writing, visual art, and music, plus SoundCloud, comments, and an optional GIF, appear where the requirements need them

### Decisions

1. Creator explore uses a filterable feed and a music detail page with a SoundCloud frame, comments, and a GIF on one comment.
2. Publish uses a create form (music example with a permalink) and a confirmation that the post joins the portfolio.
3. Mentor requests are an approval queue and an accept/decline detail. Feedback is a structured form (strengths, improvements, recommendations) and a saved confirmation.
4. Talent Scout search opens a portfolio profile. Contact is a message thread. Invite is an opportunity form with dates.
5. Moderator reports use a queue and a case with keep / hide / remove / escalate. Featured nominations use a separate approval queue and decision.
6. Administrator users use search and an account-status form. Analytics uses criteria and a results layout. Figures on the results screen are sample layout data, not a live query.

## Oct 1, 2026 — Splash screen and presentation

### Agenda

1. Run the Next.js splash screen
2. Confirm it does not implement product features
3. Rehearse the presentation order

### Decisions

1. Splash route is `/` only: name, logo, tagline, description, and placeholder navigation (About, Help, Contact, Sign in).
2. Placeholder links scroll to short notes on the same page.
3. PostgreSQL hosting and Prisma remain open from Cycle 0. They are not required to run this screen.
4. Every teammate still needs to pull the repository and run `npm install` and `npm run dev` on their own machine.
5. Presentation order follows `sprint-cycle-i-presentation.md`.

## Still open

These do not block Cycle I. They should be settled before feature work.

1. Confirm Node.js 20+ and VS Code on every teammate’s machine.
2. Choose local or hosted PostgreSQL before the sprint that adds data.
3. Instructor answers still open from Cycle 0: one role versus multiple roles, whether a structured review must be requested first, which roles may message each other, and which moderator actions require an Administrator. The mockups follow the assumptions in the Sep 18 notes.
