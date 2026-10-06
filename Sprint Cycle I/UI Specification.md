# UI specification — Sprint Cycle I

The mockups in `ui-mockups/` are the interface design. They are not the application. Names, counts, and report figures are sample content for layout.

## Approach

Signed-in screens share a sidebar, a search field, and a content area. The sidebar lists only what that role is allowed to do. Public screens (sign-in, registration, forgot password, account outcomes) use a split brand panel instead of the sidebar.

Functions that are real requirements but were not selected as this sprint’s two use cases still appear on the role home, labeled “Later sprint,” so the navigation is complete without pretending those screens were designed.

## Design assumptions

Cycle 0 left several requirement questions open. The layouts use these assumptions until the instructor says otherwise:

1. Each account has one role. Sign-in leads to that role’s home.
2. Creators, mentors, and talent scouts apply with their own email and password. Mentor and Talent Scout applications wait for an Administrator. Moderators are assigned by an Administrator. Administrators are system-created. They are not created from Apply.
3. A structured mentor review includes strengths, areas for improvement, and recommendations, and it starts from an accepted review request.
4. A Talent Scout may message a Creator about an opportunity. Other messaging rules are not designed yet.
5. A Moderator may hide or remove reported work and may approve featured nominations. Suspending or banning an account is an Administrator action. Copyright and safety issues can be escalated.

## Sign-in family

| Screen | File | Requirement supported |
| --- | --- | --- |
| Sign in | `sign-in.html` | All roles: sign in with credentials. Sign out is on each role home. |
| Create account | `register.html` | All roles except system-created Administrators can register. Mentor and Talent Scout may require approval. |
| Forgot password | `forgot-password.html` | Supports returning users who cannot sign in. Not a separate functional requirement; included so the sign-in screen is complete. |
| Account ready | `account-created.html` | Creator registration can proceed to sign-in. |
| Approval pending | `account-pending.html` | Mentor and Talent Scout accounts can be held for Administrator approval. |

Applicants first create a login with their own email and a password. That login is only for the application record. After they sign in:

| Screen | File | What the applicant sees |
| --- | --- | --- |
| Not started | `applicant-start.html` | Begin application |
| In progress | `applicant-draft.html` | Role, status, and a link to edit |
| Pending | `applicant-pending.html` | The application is still being processed |
| Approved | `applicant-approved.html` | Open the role, then the Xpression email and password |
| Questions | `application-form.html` | Name, age, reason, credentials, plus questions for the selected role |
| Submitted answers | `application-answers.html` | Read-only answers after submit |

## Role homes

Each home is a dashboard of that role’s major functions.

| Role | File | Major functions shown |
| --- | --- | --- |
| Creator | `landing-creator.html` | Explore, publish, portfolio, feedback on own work, following and saved, messages and reports |
| Creative Mentor | `landing-mentor.html` | Review requests, structured feedback, discover work, nominate featured work, review history, messages |
| Talent Scout | `landing-scout.html` | Search creators, review a portfolio, contact, invite, saved candidates, track responses |
| Community Moderator | `landing-moderator.html` | Reported work, featured nominations, comments and GIFs, reported users, warnings, escalation |
| Administrator | `landing-admin.html` | Users, analytics, specialized-account approval, roles, categories, reported activity and settings |

## Selected use cases

### Creator

**Explore Creative Work** — browse, then detail.

| Screen | Type | What it shows |
| --- | --- | --- |
| `creator-feed.html` | Browse / search | Recent work and filters for writing, visual art, and music. Supports the community feed and discovery that does not depend on follows. |
| `creator-work-detail.html` | Detail | Opens one music post, shows a SoundCloud permalink frame, existing comments, and a comment that includes a GIF. |

**Publish Creative Work** — create, then confirmation.

| Screen | Type | What it shows |
| --- | --- | --- |
| `creator-publish.html` | Create form | Title, media type, description, SoundCloud permalink, tags. |
| `creator-publish-confirm.html` | Confirmation | The post is on the feed and on the creator’s portfolio. |

### Creative Mentor / Critic

**Manage Review Requests** — approval queue, then decision.

| Screen | Type | What it shows |
| --- | --- | --- |
| `mentor-requests.html` | Approval queue | Incoming requests with creator, medium, and status. |
| `mentor-request-detail.html` | Approval decision | The creator’s note and accept or decline. |

**Provide Structured Feedback** — review form, then confirmation.

| Screen | Type | What it shows |
| --- | --- | --- |
| `mentor-feedback.html` | Review form | Strengths, areas for improvement, and recommendations, distinct from a public comment. |
| `mentor-feedback-sent.html` | Confirmation | The review is stored for the creator and for the mentor’s history. Nomination for featured work is noted as a later action. |

### Talent Scout / Commissioner

**Search for Creators** and **Review Creator Portfolio** — search, then profile.

| Screen | Type | What it shows |
| --- | --- | --- |
| `scout-search.html` | Search | Creators filtered by media and “open to commissions,” not by a social graph. |
| `scout-portfolio.html` | Profile | The creator profile as a portfolio: bio, featured pieces, writing and music together. |

**Contact Creator** and **Invite Creator to Opportunity** — messaging, then a scheduled invitation.

| Screen | Type | What it shows |
| --- | --- | --- |
| `scout-message.html` | Messaging | A thread about a performance, with a reply box that does not send. |
| `scout-invite.html` | Scheduling / create form | Opportunity type, open and close dates, description, and who is invited. |

### Community Moderator

**Review Reported Creative Work** — moderation queue, then case.

| Screen | Type | What it shows |
| --- | --- | --- |
| `mod-queue.html` | Moderation queue | Reported posts with reason and reporter. A comment/GIF report is listed so that queue is visible, but it is not the designed case. |
| `mod-case.html` | Moderation decision | Preview, finding, status, and keep / hide / remove / escalate. |

**Review Featured-Work Nominations** — approval queue, then decision.

| Screen | Type | What it shows |
| --- | --- | --- |
| `mod-nominations.html` | Approval queue | Work nominated by a Mentor. |
| `mod-nomination.html` | Approval decision | Mentor rationale and approve or decline for the featured feed. |

### Administrator

**Manage User Accounts** — search, then update.

| Screen | Type | What it shows |
| --- | --- | --- |
| `admin-users.html` | Search | Accounts filtered by role and status, including a pending Mentor. |
| `admin-user-detail.html` | Update form | Role, status (pending, active, deactivated, suspended, banned), and an approval action. |

**Generate Analytics and Reports** — criteria, then results.

| Screen | Type | What it shows |
| --- | --- | --- |
| `admin-report-criteria.html` | Report | Report type and date range. |
| `admin-report-results.html` | Analytics | Sample totals and a media-type breakdown. Not a live query. |

## Screen types covered

| Type | Where it appears |
| --- | --- |
| Browse / search | Creator feed, Talent Scout search, Administrator user search |
| Detail | Work detail, moderation case, request detail |
| Create form | Publish work, opportunity invitation |
| Confirmation | Publish confirmation, mentor review saved, Creator account ready |
| Approval | Mentor requests, featured nominations, Mentor/Scout pending account |
| Review form | Structured mentor feedback |
| Profile | Creator portfolio viewed by a Talent Scout |
| Messaging | Scout message thread |
| Scheduling | Opportunity open and close dates |
| Moderation | Reported-work case |
| Report / analytics | Administrator criteria and results |
| Dashboard | All five role homes |
| Update form | Administrator account status |

## Additional system requirements checked by the layouts

| Requirement | Where the design shows it |
| --- | --- |
| Three media types: writing, visual art, music | Feed filters, badges, publish media list, report breakdown |
| Published work belongs to the creator’s portfolio | Publish confirmation and the Talent Scout portfolio |
| Feed of recent work, filter by media type | `creator-feed.html` |
| Open a work and see existing feedback | `creator-work-detail.html` |
| Comments, including an optional GIF | Work detail comment column |
| Music permalink and embedded player | Work detail player frame and the publish form |
| Community feed, create/post, profile/portfolio, feedback | Creator home, feed, publish flow, portfolio page, feedback column |
| Profiles work as portfolios | `scout-portfolio.html` |
| Constructive feedback, not a general social network | Mentor form is structured; public comments sit on the work |
| Find creators through the work | Feed and Talent Scout search do not require a follow first |

## Intentionally not in this sprint

Profile editing, notifications, follow and save behavior, creator tools for managing feedback, mentor discovery and history, scout bookmarks and response tracking, comment/GIF moderation as its own case, user warnings, category management, system settings, and every button that would write to a database. Those items are named on the role homes so the navigation matches the requirements, and they are left for a later cycle.
