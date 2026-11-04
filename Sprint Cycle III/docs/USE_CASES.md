# Three database-supported use cases

These are the three presentation use cases selected in the October 19 Sprint Cycle II meeting notes. They demonstrate database behavior without requiring the Next.js application to implement the workflows.

Run [the search and relationship queries](../database/03_queries.sql) and [the add/update demonstrations](../database/04_demo_mutations.sql) through the README commands. Each mutation example uses `BEGIN` and `ROLLBACK`: the inserted/updated rows are real within the transaction, and the original sample data is restored afterward. SQL values use lowercase snake_case, such as `creator`, `visual_art` and `kept_available`.

## 1. A creator publishes a piece

**Goal:** A creator publishes writing, visual art or music so other users can discover it and scouts can review the creator’s portfolio.

| Part | Stored data and relationship |
| --- | --- |
| Creator | One `account` row has the Creator role. The person is stored once. |
| Work | A `creative_work` row stores the creator foreign key, title, media type, description, optional SoundCloud URL, feature/archive flags, publication time and moderation visibility. |
| Organization | Categories and the work-category association relate tags or genres to the work without repeating work rows. |
| Portfolio | A query retrieves works by `creator_id`. A portfolio is derived from those rows; it is not a second copy of published content. |
| Discovery | A query filters published work by media type and visibility and orders it by publication time. |

The database checks the creator relationship, required content and allowed media values. A music work requires a SoundCloud URL. A work cannot reference a nonexistent account. Editing, featuring or archiving updates the same work identifier, which preserves existing comments, review requests and reports.

**Presentation sequence:** Show a Creator account, show its current portfolio, add a meaningful new work, and retrieve the portfolio again. Explain that only the creative work row was added. Demonstrate a media filter to show how discovery uses the stored media type.

**Exact demonstrations:** Query **Q2** shows Amara Cole’s portfolio. **Demo A** publishes “Blue hour platform,” revises its title and feature flag, and retrieves the related creator. The `public_work_feed` view supplies a useful live media/visibility filter for an instructor question.

**Application responsibility:** Authenticate the user and verify that the signed-in creator is the owner before permitting publication or editing. A foreign key confirms a relationship; it does not establish who is using the browser.

## 2. A talent scout invites a creator to an opportunity

**Goal:** A scout finds a suitable creator and offers a commission, exhibition or performance.

| Part | Stored data and relationship |
| --- | --- |
| Search | Read Creator accounts using `discipline` and `open_to_commissions`, together with their creative works. Search creates no records. |
| Scout | An Account row with the Talent Scout role owns the opportunity. |
| Opportunity | One row stores the scout, title, start/end dates and description. A scout may create many opportunities. |
| Invitation | An associative row links one opportunity to one creator and stores invitation status and time. An opportunity may invite many creators and a creator may receive many opportunities. |
| Response | The invitation’s `sent`, `accepted` or `declined` status records the creator’s response; the same row is updated. |
| Contact | Scout messages retain the conversation or initial contact separately from the invitation relationship. |

Foreign keys keep the opportunity and creator references valid. The database prevents duplicate invitations for the same creator and opportunity and rejects invalid status values or reversed opportunity dates. An invitation is the sole relationship between a particular creator and opportunity.

**Presentation sequence:** Search commission-ready creators, open the results’ portfolio data, show an opportunity owned by a scout, and join the invitation to the opportunity and creator. Explain the unique opportunity/creator pair. Updating a response shows why status is data on the invitation.

**Exact demonstrations:** Query **Q1** finds active music creators accepting commissions. Query **Q4** joins opportunities, invitations, scouts and creators. **Demo B** adds a winter waterfront acoustic opportunity and an invitation, then updates the invitation to accepted with its response time.

**Application responsibility:** Check the current user’s identity, ownership of the opportunity and permission to send or answer an invitation. Resolve the project’s remaining contact/consent policy before implementing unrestricted messaging.

## 3. A moderator decides reported creative work

**Goal:** A community report becomes a moderation case, and the decision is recorded against the original work.

| Part | Stored data and relationship |
| --- | --- |
| Reported work | The Creative Work row remains the content identity. Moderation changes its visibility instead of creating another portfolio record. |
| Work report | A report references the work and stores the reason, reporter attribution and report time. One work can have many reports. |
| Moderation case | A trigger automatically creates one `moderation_case` when a `work_report` is inserted. It stores the moderator, findings, action, status and recorded time. |
| Decision | The action is kept available, hidden or removed. Case status is open, in review, escalated or closed. |
| Escalation | Serious copyright, fraud or safety concerns can remain linked to the case for administrator review. |

The report and case foreign keys preserve the path from decision to report to original creative work. Uniqueness prevents a report from acquiring multiple cases. Database rules restrict action/status values and preserve the decision’s moderator relationship. Administrative bans use the separate account status history rather than a work moderation action.

**Presentation sequence:** Join a case, report, work, creator and assigned moderator. Modify a case’s findings/action/status, then retrieve the case and the work’s visibility to show the effect. Explain that a work can receive multiple reports, while each report has only one case.

**Exact demonstrations:** Query **Q5** joins reports, cases, creators, works and moderators. **Demo C** inserts a new report, retrieves the automatically opened case, then records a closed/hidden decision. The closing trigger changes the work’s visibility in the same transaction. An unassigned case may be `open`; later states require a Moderator account.

**Application responsibility:** Authenticate the moderator, show only permitted case actions and enforce access to confidential reports. A moderator may warn, restrict or refer a user for a ban. Only an administrator may ban an account.

## Relationships to point out during questions

- One Account to many Creative Works.
- One Opportunity to many Invitations; one Creator to many Invitations.
- One Work to many Work Reports; one Work Report to one Moderation Case.
- Role labels on earlier diagrams are views of Account records, not separate account tables.
- A database rule proves stored data is consistent. Application authorization proves the acting user is allowed to request the operation.
