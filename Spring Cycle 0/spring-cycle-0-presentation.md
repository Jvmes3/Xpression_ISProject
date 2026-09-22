# Sprint Cycle 0 presentation — Xpression

## Outline and timing

1. Project overview — purpose and five user roles
2. Development technology
3. GitHub repository, README, and structure
4. Individual GitHub readiness
5. Team process
6. Problems and questions

---

## 1. Project overview

Xpression is a community platform for creative work: publish, discover, discuss, and organize writing, visual art, and music. Creators build portfolios and receive constructive feedback. Additional roles support mentoring, talent scouting, moderation, and administration.

Sprint Cycle 0 is **team setup only**. No product features, authentication, database tables, or final UI.

### Major user roles (five)

1. **Creator** — Publish writing, visual art, and music; manage a portfolio; browse the feed; comment; follow creators; save work; report content.
2. **Creative Mentor/Critic** — Discover work; provide structured reviews; manage review requests; nominate featured work; message creators; report content.
3. **Talent Scout/Commissioner** — Search creators and portfolios; save candidates; contact creators; create/manage opportunities and invitations; track responses.
4. **Community Moderator** — Review reports; manage moderation cases; warn/restrict users; review featured-work nominations; escalate serious issues.
5. **Administrator** — Manage accounts, roles, permissions, approvals, categories, platform content, escalated reports, analytics, and system configuration.

---

## 2. Development technology

Final stack (C++ and Python were considered earlier and are **not** used):

| Area | Choice |
| --- | --- |
| Programming language | TypeScript |
| Framework | Next.js |
| UI library | React |
| Runtime | Node.js 20+ |
| Database | PostgreSQL |
| ORM | Prisma |
| IDE | VS Code |
| Version control / collaboration | Git / GitHub |

How we will run it later: Next.js on Node.js locally in VS Code; Prisma talks to PostgreSQL. Cycle 0 does not run the app yet.

---

## 3. GitHub repository, README, and structure 

Show live:

- [Team repository](https://github.com/Jvmes3/Xpression_ISProject)
- [README](README.md) — purpose, stack table, clone/setup notes, and folder tree
- [Cycle 0 checklist](Spring%20Cycle%200%20Checklist.md)
- [Meeting notes](Meeting%20Notes.md)
- [Presentation outline](spring-cycle-0-presentation.md)
- [Team roles](Team%20Roles/)
- [Screenshots and meeting pictures](Screenshots%20%26%20Meeting%20Pictures/)
- Basic structure: meeting notes, checklist, presentation, team roles, and screenshots folder
- Insights → contributors / commit history as evidence that **every** member has pushed

---

## 4. Individual GitHub readiness

Every member should have cloned, pulled, committed, and pushed. Be ready to show:

| Member | GitHub | At least one pushed contribution |
| --- | --- | --- |
| James Henson | Jvmes3 | Initial commit, README structure, meeting pictures |
| Clemenceau Senatus | Clemenceau1 | README, presentation, checklist, roles |
| Leeyand Blot Jr | Leeyand | Checklist, technology docs, meeting notes/roles |
| Jacob Fitchett | jacobfitch | Meeting notes, presentation, role files |

**Still unresolved:** labeled clone/pull screenshots for each person are not in the repo yet. Commits on GitHub already prove push. Meeting photographs are in `Meeting Pictures/`.

---

## 5. Team process

- **Scrum Master — James Henson.** Coordinates meetings, tracks progress, records decisions, and communicates with the instructor.
- **Full Stack — Clemenceau Senatus.** Keeps deadlines visible and follows up on assigned tasks; works across frontend and backend when implementation starts.
- **Backend Developer — Leeyand Blot Jr.** Database, server functions, and APIs connected to the frontend.
- **Frontend Developer — Jacob Fitchett.** User interface, page layout, and client-side components.

---

## 6. Problems and questions

### Development-environment problems that still need to be resolved

**Yes — the team still needs to resolve these before Cycle I coding:**

1. Verify **Visual Studio Code & Node.js 20+** is on every machine.
2. Collect **labeled clone/pull screenshots** if the instructor requires them (commit/push evidence already exists).
3. Decide **PostgreSQL** hosting (local vs. shared hosted) and create one team database.
4. Set up **Next.js + TypeScript + Prisma** (intentionally not done in Cycle 0).

None of these block this presentation. They must be closed before feature work.

### Functional-requirement questions to clarify during development

1. **Account roles:** Must each account have only one of the five roles, or may one person use multiple roles? The requirements describe five distinct sign-in roles, so we need to know whether role switching is allowed.
2. **Registration and approval:** Which roles may register immediately? Should Creative Mentor/Critic and Talent Scout/Commissioner accounts remain pending until an Administrator approves them, or are they allowed to use the platform without approval? (For example is this like a sort of application system where they must apply for the role and wait to be approved?)
3. **Feedback and reviews:** What is the difference between a normal comment and a structured Mentor review? Must every structured review include strengths, areas for improvement, and recommendations, and must a Creator request the review first?
4. **Messaging permissions:** Which role combinations are allowed to send private messages? In particular, may Creators, Mentors, and Talent Scouts contact one another freely, or only after a review request or opportunity invitation?
5. **Featured work and moderation authority:** Who makes the final decision on Mentor nominations for featured work? Which actions may a Moderator take independently, and which actions, such as permanent suspension or banning, require an Administrator?
6. **Required project scope:** Which requirements are mandatory for the first implementation, and which may be postponed to later cycles? Specifically, are Talent Scout opportunities, Mentor reviews, messaging, notifications, analytics, copyright/fraud escalation, and GIF support all required for the course project?


### Core requirements (reference; do not implement in Cycle 0)

- User registration and authentication, except for Administrators.
- User profiles and creator portfolios.
- Feed displaying recent creative work.
- Filter creative work by writing, visual art, and music.
- Publish, organize, feature, and archive creative work.
- Comments and optional GIFs.
- Structured mentor reviews with strengths, improvements, and recommendations.
- Search creators and creative work.
- Follow creators and save/bookmark work.
- Mentor review requests and review history.
- Talent opportunities, invitations, and response tracking.
- Messaging between permitted roles.
- Content and user reporting.
- Moderation cases, warnings, restrictions, and administrator bans.
- Copyright and fraud escalation.
- Notifications.
- Administrator management and analytics.
- Music posts may use SoundCloud permalinks.