# Meeting notes — Sprint Cycle 0 kickoff

| Field | Value |
| --- | --- |
| Date | 9/11/2026 |
| Sprint | Cycle 0 — Team setup and project preparation |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Location / format | Classroom / in person |

## Purpose

Prepare the team to begin development: review functional requirements, select technology, establish the shared GitHub repository, and verify that every member can clone, pull, commit, and push. No product functionality in this sprint.

## Agenda

1. Review functional requirements (five user roles and major use cases)
2. Select language, framework, database, environment, and other major tools
3. Create shared GitHub repository and collaborator access
4. Initial repository structure
5. Individual Git workflow and verification evidence
6. Cycle 0 demonstration plan and instructor questions

## Decisions

1. **Official repository:** https://github.com/Jvmes3/Xpression_ISProject.git
2. **Technology (final):** TypeScript, Next.js, React, Node.js 20+, PostgreSQL, Prisma, VS Code, Git/GitHub. C++ and Python are **not** part of the stack.
3. **Scrum Master (Cycle 0):** James Henson
4. **No implementation this sprint:** no use cases, auth, product tables, or final UI.
5. **Individual contributions:** each member adds their role and at least one commit to the team repository.

## Requirements discussion

The team reviewed the **five** system roles (Creator, Creative Mentor/Critic, Talent Scout/Commissioner, Community Moderator, Administrator) and the major use cases (publish, feed/filter, portfolio, comments/GIFs, SoundCloud music posts, mentor reviews, scout opportunities, moderation, admin configuration).

Open questions for the instructor are listed in `spring-cycle-0-presentation.md`.

## Unresolved development-environment problems

The team **still needs to resolve** the following before Sprint Cycle I coding. Cycle 0 did not require a running app.

1. Confirm **Visual Studio Code & Node.js 20+** is installed on every teammate’s machine (`node -v`).
2. Choose how **PostgreSQL** will be hosted (local install vs. a shared hosted instance) and create one database the whole team can use.
3. Initialize the **Next.js + TypeScript** app and **Prisma** against that database.
4. Agree on a testing approach for Cycle I .

These items do **not** block the Cycle 0 presentation, but they must be finished before feature work.

## Action items

| Owner | Action | Status |
| --- | --- | --- |
| James Henson | Created repo, invited team members | Done |
| Clemenceau Senatus | README and Edit presentation materials | Done |
| Jacob Fitchett | Team roles and meeting notes | Done |
| Leeyand Blot Jr | Selected technology documentation | Done |
