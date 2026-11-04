# Business rule enforcement

This register preserves the numbering of all **41** rules in the supplied Sprint II Business Rules workbook. The updated dictionary and schema define the exact implemented structures. “Database” identifies data integrity enforced by PostgreSQL; “Application” identifies a policy that the later application must enforce with the authenticated user.

Database role checks validate the referenced account’s stored role. They do not authenticate the person running SQL. The presentation database owner can inspect and administer the entire database. Production deployment must use restricted application database credentials and application authorization.

SQL uses lowercase snake_case versions of the workbook’s display labels: for example `creator`, `talent_scout`, `visual_art`, `in_review`, `kept_available` and `refer_for_ban`.

| No. | Supplied rule | Enforcement and explanation |
| --- | --- | --- |
| 1 | An account email is unique. | Database: unique normalized account email. Application: normalize input before display/sign-in and verify ownership of an email address. |
| 2 | An account has one of the five roles. | Database: one required role column with allowed values Creator, Mentor, Talent Scout, Moderator or Administrator. |
| 3 | Role rectangles describe the same Account identity. | Database design: one Account table; role-specific relationships reference its primary key. There are no duplicate Creator/Mentor/Scout person tables. |
| 4 | A creative work belongs to one creator. | Database: required creator foreign key and Creator-role/ownership validation. |
| 5 | A creator can publish many works. | Database design: many work rows may share one creator foreign key; that key is not unique in Creative Work. |
| 6 | A music piece must have a SoundCloud URL. | Database: media-dependent required URL check. Writing and visual art do not require that URL. Application: validate and safely embed external content. |
| 7 | Media is Writing, Visual art or Music. | Database: required media value restricted to the three supported values. |
| 8 | Feature, archive, edit or remove updates the work, not a new portfolio record. | Database design: feature/archive/visibility and content fields live on Creative Work; portfolios are queries over creator-owned works. Application: update the existing work identifier. |
| 9 | Creators read feedback only about their own work. | Application: authorize feedback retrieval using the authenticated creator and the work’s owner. Schema relationships support that filtered query. Database foreign keys alone do not enforce read permissions. |
| 10 | A request belongs to one creator, mentor and work. | Database: required foreign keys, role checks and validation that the requesting creator owns the work. |
| 11 | Creators and mentors may have many requests. | Database design: request creator/mentor foreign keys are not individually unique. |
| 12 | Request status is waiting, accepted or declined. | Database: allowed-value status check. |
| 13 | Feedback is stored only for an accepted request. | Database: a generated `accepted` request-status value participates in the composite feedback/request foreign key, preserving both acceptance and matching identity. `feedback_requires_accepted_request` and `answered_request_remains_accepted` also provide explicit error checks. Application: expose feedback submission only to the assigned mentor. |
| 14 | Feedback includes strengths, improvements and a recommendation. | Database: required, nonblank structured feedback fields. |
| 15 | Feedback belongs to one work and mentor. | Database: foreign keys and matching validation against the referenced request’s work and mentor. |
| 16 | Feedback has at most one creator reply. | Database: unique feedback foreign key and `reply_requires_work_owner` ensure one reply with the correct recorded creator. Application: verify the authenticated user matches that creator. |
| 17 | A nomination belongs to one mentor and work. | Database: required foreign keys and Mentor-role validation. |
| 18 | Nomination status is pending, approved or declined. | Database: allowed-value status check and decision-field consistency. Application: authorize the moderator’s approval action. |
| 19 | Scout search reads discipline, commission availability and works; it inserts no row. | Query/application behavior: use SELECT/join/filter over Account and Creative Work. Saving a candidate is a separate explicit operation. |
| 20 | A scout message belongs to one scout and creator. | Database: required endpoint foreign keys and role checks. Application: authorize the sender and permitted conversation participants. |
| 21 | An opportunity belongs to one scout. | Database: required scout foreign key with Talent Scout-role validation. |
| 22 | Invitation alone links opportunity and creator; the same pair occurs once. | Database: required opportunity/creator foreign keys and unique opportunity/creator pair. |
| 23 | Invitation status is sent, accepted or declined. | Database: allowed-value status check. Application: the invited creator controls the response. |
| 24 | A work report belongs to one work; one work may have many reports. | Database: required work foreign key; it is not unique in Work Report. |
| 25 | One work report opens one moderation case. | Database: `work_report_opens_case` creates the case after report insertion. A unique report foreign key prevents duplicates, and deferred constraint triggers prevent a report from losing its case. |
| 26 | A case records findings, action and open/in review/escalated/closed status. | Database: nonblank findings, allowed status/action checks, moderator assignment after the open state, and a required reason for escalation. New cases use `Awaiting review` until findings are entered. Application: ensure findings substantively justify the decision. |
| 27 | Work action is kept available, hidden or removed. | Database: allowed action values; `closed_case_applies_visibility` changes the associated work or comment visibility when a case closes. |
| 28 | A user report belongs to one account. | Database: required reported-account foreign key. |
| 29 | A moderator may warn, restrict or refer for ban. | Database: Moderator-role relationship and allowed restriction action values. Application: authenticate the moderator and enforce policy/duration. |
| 30 | Moderators do not ban; bans are administrator changes. | Database: ban state uses the administrator status-change workflow. Application/database grants: prevent a moderator from invoking administrator operations or directly updating account status. |
| 31 | Administrators activate, suspend, ban or deactivate accounts. | Database: allowed account status values and Administrator-role validation for recorded status changes. Application: authenticate and authorize the administrator. |
| 32 | Each action updates current account status and stores one Status Change. | Database: `status_change_updates_account` locks and updates the target account during audit insertion, capturing its old status. `account_status_requires_audit` rejects direct status updates; `status_history_append_only` rejects audit updates/deletion. Application: authorize the acting administrator. |
| 33 | Applications request Mentor or Talent Scout, not Creator. | Database: requested-role check allows those specialized roles only. Creator registration remains separate. |
| 34 | Application status is pending, accepted or rejected. | Database: allowed-value status check and required/nullable decision metadata according to status. |
| 35 | An accepted application allows Mentor/Scout account use. | Database: deferred constraint triggers require every Mentor/Scout account to have an accepted application matching its account ID, canonical email and role at transaction commit. Application: authenticate the approved user and check account status before access. |
| 36 | Analytics retain report type and selected start/end dates. | Database: required report type, date range and generator relationship; chronological date check. Queries compute results from stored application data. |
| 37 | A comment belongs to one work. | Database: required work foreign key and author relationship; optional GIF URL remains part of the comment. |
| 38 | A follow links one account to one creator; each pair occurs once. | Database: endpoint foreign keys, Creator-role validation, and unique follower/creator pair. |
| 39 | Saved work links account and work; each pair occurs once. | Database: required account/work foreign keys and unique account/work pair. |
| 40 | A help ticket belongs to one account. | Database: required account foreign key. Application: ticket visibility and replies limited to the owner and authorized support staff. |
| 41 | Platform setting names are unique. | Database: required unique setting name. Application: only administrators may change settings. |

## Presentation rules to demonstrate

At minimum, explain and demonstrate unique email, valid Creator/work ownership, required SoundCloud URLs for music, duplicate invitation prevention and the report/case relationship. The native verification script also exercises required values, allowed statuses and other implemented constraints. Use failed inserts inside transactions or exception-handling blocks so a rejected example does not damage sample data.

The executed PostgreSQL verification is saved in [evidence/verification.txt](../evidence/verification.txt): **83 checks passed**. This includes populated sample data in all 30 tables, accepted operations and rejected invalid operations. Verification writes are rolled back so the meaningful sample data remains available for presentation.

## Responsibilities that remain outside the database

- Authenticate the acting user and enforce browser/API route permissions.
- Restrict feedback, private messages, reports and tickets to permitted participants.
- Confirm ownership before editing work, answering invitations or replying to feedback.
- Validate media uploads, escape output and safely embed external URLs.
- Enforce contact consent, anti-spam limits, notification delivery and other product policy.
- Provision staff accounts and production database roles with appropriate credentials.

The SQL verification evidence proves implemented data rules under the tested database version. It does not claim a completed application authorization system.
