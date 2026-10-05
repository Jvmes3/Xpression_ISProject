# Sprint Cycle I

This folder is Sprint Cycle I. It holds the running site, including `package.json`, and the list for this sprint.

Official repository: https://github.com/Jvmes3/Xpression_ISProject.git

Scrum Master: James Henson

## How to present

| Item | Location |
| --- | --- |
| Step-by-step presentation | `README.md` in this folder |
| Screen designs | `ui-mockups/index.html` |
| Why each screen exists | `UI Specification.md` |
| Decision log | `Meeting Notes.md` |

## Running site

These pages are in the `app` folder in this sprint. The presentation README in this folder walks through them.

| Item | Location |
| --- | --- |
| Home | `app/page.tsx` |
| Signed-in name, role, and the role's own links | `app/components/SiteHeader.tsx` |
| Apply, sign-in, and profile | `app/apply/page.tsx`, `app/sign-in/page.tsx`, `app/profile/page.tsx` |
| Application form, saved draft, and submitted answers | `app/application/` |
| Application status, including the wait message and the Xpression login | `app/account/page.tsx` |
| Creator workspace: explore and publish | `app/creator/desk/` |
| Mentor workspace: requests and structured feedback | `app/mentor/desk/` |
| Talent Scout workspace: search, portfolio, message, and invite | `app/scout/desk/` |
| Moderator desk, including Undo and help tickets | `app/moderator/desk/page.tsx` |
| Moderator and administrator teams | `app/moderator/page.tsx`, `app/administrator/page.tsx` |
| Help tickets for members | `app/help/page.tsx` |
| Administrator desk, including the full application | `app/administrator/desk/page.tsx`, `app/administrator/applications/[id]/page.tsx` |
| Email and password rules, including 1 number | `app/lib/credentials.mjs` |
| Local accounts, applications, reports, and posts | `data/xpression.json`, seeded from `data/seed.json` |
| Terminal commands for moderator and administrator accounts | `npm run create-moderator` and `npm run create-administrator` |

## Screen designs in this folder

| Item | Location |
| --- | --- |
| Sign-in, registration, forgot password, and account outcomes | `ui-mockups/sign-in.html`, `register.html`, `forgot-password.html`, `account-created.html`, `account-pending.html` |
| Application in progress, pending, approved, form, and answers | `ui-mockups/applicant-start.html`, `applicant-draft.html`, `applicant-pending.html`, `applicant-approved.html`, `application-form.html`, `application-answers.html` |
| Role landings | `ui-mockups/landing-creator.html`, `landing-mentor.html`, `landing-scout.html`, `landing-moderator.html`, `landing-admin.html` |
| Creator use cases | `ui-mockups/creator-feed.html`, `creator-work-detail.html`, `creator-publish.html`, `creator-publish-confirm.html` |
| Mentor use cases | `ui-mockups/mentor-requests.html`, `mentor-request-detail.html`, `mentor-feedback.html`, `mentor-feedback-sent.html` |
| Talent Scout use cases | `ui-mockups/scout-search.html`, `scout-portfolio.html`, `scout-message.html`, `scout-invite.html` |
| Moderator use cases | `ui-mockups/mod-queue.html`, `mod-case.html`, `mod-nominations.html`, `mod-nomination.html` |
| Administrator use cases | `ui-mockups/admin-users.html`, `admin-user-detail.html`, `admin-report-criteria.html`, `admin-report-results.html` |

## Included behavior

- [x] Home, five role entrances, and Apply
- [x] Sign-in for an applicant, a moderator, and an administrator
- [x] Password rule: 8 characters, 1 capital letter, 1 number, and 1 special character
- [x] Application stays in progress until Submit application
- [x] A blank application cannot be submitted. A sample link may be left blank
- [x] Pending, approved, and rejected status
- [x] Approved role opens that role's workspace
- [x] The signed-in name stays in the dark bar, and the role links stay after leaving the workspace
- [x] Two use cases for Creator, Mentor, Talent Scout, Moderator, and Administrator
- [x] Moderator and administrator actions can be undone
- [x] Administrator can open every question and answer
- [x] No PostgreSQL or Prisma

