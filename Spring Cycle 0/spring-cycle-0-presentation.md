# Sprint Cycle 0 presentation — Xpression
## Outline

1. Project Overview
2. Selected technology and how we run it
3. README and setup
4. Team process
5. Requirement 
6. Questions/Items Requiring Clarification

---

## 1. Project Overview (30 seconds)

Xpression is a community platform for creative work: publish, discover, discuss, and organize writing, visual art, and music. Portfolios, constructive feedback, and (as course extensions) Mentor, Talent Scout, Moderator, and Administrator roles sit on top of that core.

Sprint Cycle 0 is **team setup only**. No product features.

## 2. Selected technology and how we run it (2 minutes)

- **Programming Language:** C++ or Python — programming language being considered for the application
- **Frontend Framework:** Next.js — framework used to build the web application
- **UI Library:** React — creates the interactive user interface and components
- **Database:** PostgreSQL — stores users, posts, and other persistent application data
- **Database ORM:** Prisma — connects Next.js to PostgreSQL and simplifies database operations
- **Development Environment:** VS Code — team code editor
- **Runtime:** Node.js 20+ — runs the Next.js application locally
- **Version Control:** Git — tracks code changes
- **Repository / Collaboration:** GitHub — stores the repository and supports team collaboration

## 3. README and setup (1 minute)

## 4. Team process (30 seconds)

Scrum Master:

Full Stack: **Clemenceau Senatus**. Schedules meetings, keeps everyone on track with deadlines, and makes sure tasks are assigned and followed up on.

Back-End Developer: **Leeyand Blot Jr**. Establishes the database, functions, and connects the APIs to the Front-End.

Front-End Developer: **Jacob Fitchett**. Designs the user interface, handles page layout, and makes sure users can interact with the application easily.

...:

## 5. Requirement 

### System Roles

1. **Creator** — Publish writing, visual art, and music; manage a portfolio; browse the feed; comment; follow creators; save work; report content.
2. **Creative Mentor/Critic** — Discover work; provide structured reviews; manage review requests; nominate featured work; message creators; report content.
3. **Talent Scout/Commissioner** — Search creators and portfolios; save candidates; contact creators; create/manage opportunities and invitations; track responses.
4. **Community Moderator** — Review reports; manage moderation cases; warn/restrict users; review featured-work nominations; escalate serious issues.
5. **Administrator** — Manage accounts, roles, permissions, approvals, categories, platform content, escalated reports, analytics, and system configuration.

### Core Requirements

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


## 6. Questions/Items Requiring Clarification

- Whether users can hold multiple roles.
- How the initial Administrator account is created.
- Approval process for Mentor and Scout accounts.
- Which role combinations are allowed to communicate.
- GIF implementation and content restrictions.
- Media file types and size limits.
- Feed ranking rules.
- Difference between mentor reviews and comments.
- Review-request rules and limits.
- Featured-work approval and duration.
- Opportunity visibility and whether creators can apply without invitations.
- Moderator permissions versus Administrator bans.
- Required analytics for the project.
- Whether guests can browse the feed.
- Timing of the database design relative to Sprint Cycle 0.
