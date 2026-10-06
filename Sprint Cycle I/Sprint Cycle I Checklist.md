# Sprint Cycle I

This folder is Sprint Cycle I. It holds the screen designs and the home screen.

Official repository: https://github.com/Jvmes3/Xpression_ISProject.git

Scrum Master: James Henson

## How to present

| Item | Location |
| --- | --- |
| Step-by-step presentation | `README.md` in this folder |
| Home screen | `app/page.tsx` |
| Screen designs | `ui-mockups/index.html` |
| Why each screen exists | `UI Specification.md` |
| Decision log | `Meeting Notes.md` |

## Home screen

The running screen shows the application name, logo, and a short description. Sign in, About, Help, and Contact are placeholders.

| Item | Location |
| --- | --- |
| Home | `app/page.tsx` |
| Name, logo, and placeholder navigation | `app/layout.tsx` |
| Logo file | `public/logo.svg` |

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

## Required for this sprint

- [x] Sign-in screen, plus registration, forgot password, and account outcomes
- [x] Landing page for Creator, Mentor, Talent Scout, Moderator, and Administrator
- [x] Two use cases for each role, with more than one screen type
- [x] Home screen shows the application name, logo, tagline, and placeholder navigation
- [x] The home screen does not authenticate anyone or run a use case
- [x] Designs and home-screen source are in this folder
