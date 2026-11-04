# Changes from the Sprint II design

The updated diagrams use table notation to show the implemented fields, SQL types, keys and foreign keys. The original Sprint II Chen diagrams remain unchanged in the prior sprint folder. The full SVG/PNG includes every implemented table; focused domain diagrams support presentation, and the Mermaid source records cardinalities.

The implementation starts from the supplied Sprint II Data Dictionary and Business Rules workbooks and the ER diagrams under `Sprint Cycle II/ERD/`. Those artifacts describe the requirements; they are not database creation scripts. Historical Sprint I and II artifacts remain unchanged for comparison.

## Implementation baseline

- Use PostgreSQL, the database selected in the Cycle 0 technology table.
- Use native SQL for database structures, sample data, retrievals and mutations. Prisma remains a planned application access layer and is not required to demonstrate the database this sprint.
- Represent a person once in Account. Creator, Mentor, Talent Scout, Moderator and Administrator are allowed role values and relationship endpoints referring to Account.
- Preserve the three Sprint II presentation cases: publishing work, inviting a creator and moderating reported work.
- Include structures for later functional requirements now. The assignment explicitly requires the complete system’s database, even where the application UI is unfinished.

## Corrections and additions

| Sprint II limitation or ambiguity | Implementation change | Reason |
| --- | --- | --- |
| Role diagrams use repeated Creator/Mentor/etc. rectangles. | One physical Account table with role-specific references and role validation. | Avoid duplicate people and inconsistent identity data. |
| Generic Integer, String and DateTime descriptions do not define concrete database behavior. | Specify PostgreSQL types, primary/foreign keys, defaults, required values, checks and uniqueness in the SQL schema and updated dictionary. | Make the design executable and reproducible. |
| The consolidated diagram omits entities from the dictionary’s later-requirement section. | The updated diagram and dictionary describe all implemented tables, including later features. | Match the implemented complete-system scope. |
| Account lacks authentication storage and useful profile information. | Add `password_hash`, `bio` and creation time. Authentication/session identity stays in the future application. | Support later login and portfolio/profile functionality without storing plaintext passwords. |
| Work has no explicit moderation visibility. | Separate hidden/removed visibility from the existing featured and archived flags. | Archiving by a creator and hiding content for moderation have different meanings. |
| Category has no relationship to works. | Add a work-category association with a unique work/category pair. | Support tags, genres, organization and useful searches. |
| Foreign keys alone allow the wrong account role or a review request for someone else’s work. | Validate role-specific endpoints and matching ownership/request relationships. | Keep stored relationships consistent with the business rules. |
| Accepted review requests and structured feedback need cross-row validation. | Require accepted status and matching request/work/mentor before feedback is stored. | Implement Business Rules 10–15 consistently. |
| Cardinality statements are only prose. | Enforce single feedback reply, one case per work report, and unique follow/save/invitation pairs using database mechanisms. | Prevent duplicate relationship records. |
| A work report records only a reporter name. | Preserve attribution and relate registered reporters where possible. | Retain useful moderation evidence without relying only on display names. |
| User reports and work reports do not cover reported comments/GIFs. | Add a comment-report relationship. | Support moderation of comments and GIFs required by the role descriptions. |
| Account-status history is separate from the current status without specified synchronization. | Keep the current state and administrator change history consistent within database operations. | Preserve audit evidence and prevent stale account status. |
| Role Application is disconnected from the resulting account. | Link application/decision data to the relevant account identity. | Explain why the approved Mentor or Scout is authorized to use that role. |
| Messaging, saved candidates, notifications and escalation are incomplete. | Add supporting structures for these later functional requirements. | Ensure the database covers the entire application. |
| Opportunity/report date relationships are unspecified. | Add chronological checks and explicit nullable decision fields. | Reject impossible ranges while allowing pending work. |
| Source statuses use prose and inconsistent prototype labels. | Use documented allowed values and checks rather than unrestricted strings. | Keep queries and updates predictable. |

The implementation contains **30 tables**: the dictionary’s 22 entities plus `work_media`, `conversation`, `conversation_member`, `private_message`, `scout_candidate`, `comment_report`, `work_category` and `notification`. Native views `public_work_feed`, `scout_creator_directory` and `moderation_queue` provide useful read projections. These views do not authenticate users or enforce per-user privacy.

## Details that change the original dictionary

- SQL role, media and status labels use lowercase snake_case. For example, “Talent Scout” becomes `talent_scout`, “Visual art” becomes `visual_art`, “in review” becomes `in_review`, and “kept available” becomes `kept_available`.
- Account identifiers use PostgreSQL identity-backed `bigint` keys. The dictionary’s generic DateTime becomes `timestamptz`; opportunity/report periods use `date`.
- Generated role columns let composite foreign keys enforce that a referenced account is the required Creator, Mentor, Scout, Moderator or Administrator. They are database-maintained integrity fields rather than duplicate people.
- `creative_work.content_text` stores writing itself. `work_media` stores ordered external asset URLs and alternative text for images or other media. This sprint does not claim an implemented upload/storage service.
- `creative_work.featured` remains the creator’s portfolio selection. An approved `nomination` supplies the community featured feed; the two meanings remain distinct.
- The feedback/request composite foreign key includes a generated `accepted` status, the work and the mentor. Accepted status is therefore part of the stored relationship, alongside triggers with readable error messages. `feedback_reply.creator_id` explicitly identifies the reply author; a trigger verifies that account owns the reviewed work, and uniqueness allows only one reply per feedback.
- Each inserted work or comment report automatically opens its case. A case targets exactly one work report **or** comment report, and deferred checks prevent an existing report from losing its case.
- `moderation_case.moderator_id` is nullable for an unassigned `open` case, unlike the source dictionary’s always-required field. Any later case state requires a moderator. Findings default to `Awaiting review`; escalated cases require an explanation. Closing a case applies its action to work/comment visibility.
- Inserting `status_change` captures the old status, locks and updates the account, and stores the audit row in the same transaction. Direct account-status changes and audit update/deletion are rejected.
- An accepted specialized-role application and its Mentor/Scout account must be created in the same transaction. Deferred checks require the accepted application, canonical email, requested role and approved account to match at commit.
- Invitations store `responded_at`. An acceptance or decline must include that timestamp; checks preserve chronological consistency.
- Temporary restrictions have an expiry, and support tickets gain assignment, response and resolution metadata. The application must honor these stored values.

## Conflicting source behavior resolved for this sprint

The Sprint I UI prototype uses an applicant login and applies an approval workflow to Creators. The Sprint II Business Rules specifically state that role applications request **Mentor or Talent Scout**, and that Creator accounts are not approved through this application. Sprint III follows that later database rule. Administrator and Moderator provisioning remains an authorized staff workflow rather than public self-selection.

The Sprint I JSON file is historical UI data. Its arrays, display-name references and in-memory update queue are not the PostgreSQL implementation or evidence of relational constraints. The Sprint III SQL seed supplies coherent sample identities and foreign-key relationships independently of that file.

## Policies reserved for application implementation

The database can validate values, references and role relationships. It cannot infer the identity of a person operating a future browser. The application must authenticate users, check ownership and permissions, restrict private feedback/messages/reports, handle password creation and verification, and enforce contact policy. The source documents leave some messaging permissions open; this sprint does not invent unrestricted communication rights.

No instructor feedback was supplied with this task. These changes address issues found by comparing the design with the functional descriptions and executable database requirements. They are implementation decisions prepared for the team’s review, not invented instructor or meeting decisions.
