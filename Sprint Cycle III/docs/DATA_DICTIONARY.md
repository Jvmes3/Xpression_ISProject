# Xpression data dictionary

PostgreSQL 16, schema `xpression`. Generated from the implemented catalog on November 3, 2026. All names and required fields below match the running database. PK = primary key; FK = foreign key. Generated role constants enforce role-specific relationships. Full check/unique definitions and trigger details are in the workbook and `schema-metadata.json`. Sources: Sprint II Data Dictionary and Business Rules (identical to the supplied workbooks), with corrections explained in DESIGN_CHANGES.md.

## account

One stored person, exactly one role. Password hashes only; authentication and session identity remain application responsibilities.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| account_id | bigint | Yes | PK | IDENTITY | Unique identifier for the account |
| name | text | Yes |  |  | Name shown on the role pages |
| email | text | Yes |  |  | Canonical lowercase trimmed email, unique across every role. |
| role | text | Yes |  |  | Creator, Mentor, Talent Scout, Moderator, or Administrator |
| status | text | Yes |  | 'active'::text | active, suspended, banned, or deactivated |
| discipline | text | No |  |  | Creative discipline, used when a scout searches |
| open_to_commissions | boolean | Yes |  | false | Whether a creator is open to scout contact |
| password_hash | text | Yes |  |  | Encoded salted password hash produced by the application; never a plaintext password. Database checks nonempty storage, not cryptographic correctness. |
| bio | text | No |  |  | Added for creator profiles and scout discovery. |
| created_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Timestamp when this row was created. |

## account_restriction

Moderator warning, temporary restriction or ban referral. Does not change account.status or authorize a ban.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| restriction_id | bigint | Yes | PK | IDENTITY | Unique identifier for the restriction |
| user_report_id | bigint | Yes | FK |  | User report this action answers |
| moderator_id | bigint | Yes | FK |  | Moderator who recorded it |
| moderator_role | text | No | FK | GENERATED: 'moderator'::text | Generated constant used to enforce a moderator foreign key. |
| action_type | text | Yes |  |  | warn, restrict, or refer for ban |
| recorded_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the action was recorded |
| expires_at | timestamp with time zone | No |  |  | Required future expiry for restrict, NULL for warnings/referrals. Application checks restrictions during actions. |
| notes | text | No |  |  | Notes. |

- (user_report_id) → user_report(user_report_id)
- (moderator_id, moderator_role) → account(account_id, role)

## analytics_report

Saved report criteria and result summary; dates must be ordered.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| report_id | bigint | Yes | PK | IDENTITY | Unique identifier for the report |
| administrator_id | bigint | Yes | FK |  | Administrator who generated it |
| administrator_role | text | No | FK | GENERATED: 'administrator'::text | Generated constant used to enforce an administrator foreign key. |
| report_type | text | Yes |  |  | platform usage, accounts, or creative posts |
| date_from | date | Yes |  |  | Start of the date range |
| date_to | date | Yes |  |  | End of the date range |
| generated_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the report was generated |
| result_summary | text | No |  |  | Figures produced for that criteria |

- (administrator_id, administrator_role) → account(account_id, role)

## category

Media, genre and tag vocabulary; unique category name within kind.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| category_id | bigint | Yes | PK | IDENTITY | Unique identifier for the category |
| name | text | Yes |  |  | Name of the medium, genre, or tag |
| kind | text | Yes |  |  | media, genre, or tag |

## comment

Work discussion with optional GIF and added moderation visibility.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| comment_id | bigint | Yes | PK | IDENTITY | Unique identifier for the comment |
| work_id | bigint | Yes | FK |  | Creative work the comment belongs to |
| author_id | bigint | Yes | FK |  | Account that wrote the comment |
| body | text | Yes |  |  | Comment text |
| gif_url | text | No |  |  | Optional GIF attached to the comment |
| created_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Timestamp when this row was created. |
| visibility | text | Yes |  | 'available'::text | Publication visibility controlled by moderation decisions. |

- (author_id) → account(account_id)
- (work_id) → creative_work(work_id)

## comment_report

Added reporting for comments; every insert opens exactly one moderation case.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| comment_report_id | bigint | Yes | PK | IDENTITY | Identifier linking the comment report record; see Relationships. |
| comment_id | bigint | Yes | FK |  | Identifier linking the comment record; see Relationships. |
| reporter_id | bigint | No | FK |  | Identifier linking the reporter record; see Relationships. |
| reason | text | Yes |  |  | Reason. |
| reported_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Reported at. |

- (comment_id) → comment(comment_id)
- (reporter_id) → account(account_id)

## conversation

Added general private conversations shared by all roles.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| conversation_id | bigint | Yes | PK | IDENTITY | Identifier linking the conversation record; see Relationships. |
| subject | text | Yes |  |  | Subject. |
| created_by | bigint | Yes | FK |  | Created by. |
| created_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Timestamp when this row was created. |

- (created_by) → account(account_id)

## conversation_member

Added membership and read tracking. The application restricts conversation reads to authenticated members.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| conversation_id | bigint | Yes | PK, FK |  | Identifier linking the conversation record; see Relationships. |
| account_id | bigint | Yes | PK, FK |  | Identifier linking the account record; see Relationships. |
| joined_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Joined at. |
| last_read_at | timestamp with time zone | No |  |  | Last read at. |

- (account_id) → account(account_id)
- (conversation_id) → conversation(conversation_id)

## creative_work

One row per portfolio work; feature/archive/edit/moderation update this row. Removal uses visibility=removed.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| work_id | bigint | Yes | PK | IDENTITY | Unique identifier for the piece |
| creator_id | bigint | Yes | FK |  | Account that published the piece |
| creator_role | text | No | FK | GENERATED: 'creator'::text | Generated constant used to enforce a creator foreign key. |
| title | text | Yes |  |  | Title entered on Publish work |
| media_type | text | Yes |  |  | Writing, Visual art, or Music |
| description | text | Yes |  |  | Description of the piece |
| soundcloud_url | text | No |  |  | SoundCloud link. Used when the piece is music |
| featured | boolean | Yes |  | false | Creator-selected portfolio feature. Community feature approval is stored separately in nomination. |
| archived | boolean | Yes |  | false | Whether the piece is archived instead of shown |
| published_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the piece was published |
| content_text | text | No |  |  | Added to store writing itself rather than only a description; binary media are external URLs in work_media. |
| visibility | text | Yes |  | 'available'::text | Added moderation state applied by closing a moderation case: available, hidden or removed. |

- (creator_id, creator_role) → account(account_id, role)

## feedback_reply

At most one reply per feedback; added creator_id and trigger ensure the recorded author owns the reviewed work.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| reply_id | bigint | Yes | PK | IDENTITY | Unique identifier for the reply |
| feedback_id | bigint | Yes | FK |  | Feedback being answered |
| creator_id | bigint | Yes | FK |  | Identifier linking the creator record; see Relationships. |
| reply_text | text | Yes |  |  | The creator’s response |
| replied_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the reply was sent |

- (creator_id) → account(account_id)
- (feedback_id) → mentor_feedback(feedback_id)

## follow

Unique account-to-creator relationship; self-follow is rejected.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| follow_id | bigint | Yes | PK | IDENTITY | Unique identifier for the follow |
| follower_id | bigint | Yes | FK |  | Account that clicked follow |
| creator_id | bigint | Yes | FK |  | Creator account being followed |
| creator_role | text | No | FK | GENERATED: 'creator'::text | Generated constant used to enforce a creator foreign key. |
| followed_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Followed at. |

- (creator_id, creator_role) → account(account_id, role)
- (follower_id) → account(account_id)

## help_ticket

Account support request; added assignment, response and resolution date support shared help queues.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| ticket_id | bigint | Yes | PK | IDENTITY | Unique identifier for the ticket |
| account_id | bigint | Yes | FK |  | Account that opened the ticket |
| subject | text | Yes |  |  | Short subject |
| body | text | Yes |  |  | What the person needs |
| status | text | Yes |  | 'open'::text | open, resolved, set aside, or escalated |
| opened_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the ticket was opened |
| assigned_to | bigint | No | FK |  | Assigned to. |
| response | text | No |  |  | Response. |
| resolved_at | timestamp with time zone | No |  |  | Resolved at. |

- (account_id) → account(account_id)
- (assigned_to) → account(account_id)

## invitation

Unique opportunity/creator pair with response status and added response timestamp.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| invitation_id | bigint | Yes | PK | IDENTITY | Unique identifier for the invitation |
| opportunity_id | bigint | Yes | FK |  | Opportunity being offered |
| creator_id | bigint | Yes | FK |  | Creator who is invited |
| creator_role | text | No | FK | GENERATED: 'creator'::text | Generated constant used to enforce a creator foreign key. |
| status | text | Yes |  | 'sent'::text | sent, accepted, or declined |
| invited_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the invitation was sent |
| responded_at | timestamp with time zone | No |  |  | Responded at. |

- (creator_id, creator_role) → account(account_id, role)
- (opportunity_id) → opportunity(opportunity_id)

## mentor_feedback

One structured feedback per accepted request; composite FK keeps work and mentor consistent with that request.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| feedback_id | bigint | Yes | PK | IDENTITY | Unique identifier for the feedback |
| work_id | bigint | Yes | FK |  | Creative work the feedback is about |
| mentor_id | bigint | Yes | FK |  | Mentor account that wrote it |
| request_id | bigint | Yes | FK |  | Accepted review request this feedback answers |
| request_status | text | No | FK | GENERATED: 'accepted'::text | Request status. |
| strengths | text | Yes |  |  | What is working in the piece |
| improvements | text | Yes |  |  | What to revise next |
| recommendation | text | Yes |  |  | Next step for the creator |
| written_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the feedback was saved |

- (request_id, work_id, mentor_id, request_status) → review_request(request_id, work_id, mentor_id, status)
- (work_id) → creative_work(work_id)

## moderation_case

One work OR comment report, never both. Nullable moderator permits an unassigned open queue entry; decisions require moderator assignment.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| case_id | bigint | Yes | PK | IDENTITY | Unique identifier for the case |
| report_id | bigint | No | FK |  | Work-report relationship retained; NULL only for a comment-report case. |
| comment_report_id | bigint | No | FK |  | Identifier linking the comment report record; see Relationships. |
| moderator_id | bigint | No | FK |  | Sprint II required moderator relaxed only for newly auto-opened unassigned cases; required after the open state. |
| moderator_role | text | No | FK | GENERATED: 'moderator'::text | Generated constant used to enforce a moderator foreign key. |
| findings | text | Yes |  | 'Awaiting review'::text | What the moderator found |
| action_taken | text | Yes |  | 'kept_available'::text | kept available, hidden, or removed |
| status | text | Yes |  | 'open'::text | open, in review, escalated, or closed |
| recorded_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the case was saved |
| escalation_reason | text | No |  |  | Added explanation for copyright, fraud or other escalation; required while escalated. |

- (comment_report_id) → comment_report(comment_report_id)
- (report_id) → work_report(report_id)
- (moderator_id, moderator_role) → account(account_id, role)

## nomination

Mentor nominates; moderator approves/declines. Approved rows drive the featured community feed.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| nomination_id | bigint | Yes | PK | IDENTITY | Unique identifier for the nomination |
| mentor_id | bigint | Yes | FK |  | Mentor who nominated the piece |
| mentor_role | text | No | FK | GENERATED: 'mentor'::text | Generated constant used to enforce a mentor foreign key. |
| work_id | bigint | Yes | FK |  | Piece being nominated |
| moderator_id | bigint | No | FK |  | Moderator who decided it. Empty until a decision |
| moderator_role | text | No | FK | GENERATED: 'moderator'::text | Generated constant used to enforce a moderator foreign key. |
| reason | text | Yes |  |  | Why the mentor says it should be featured |
| status | text | Yes |  | 'pending'::text | pending, approved, or declined |
| nominated_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the mentor nominated it |
| decided_at | timestamp with time zone | No |  |  | When the moderator decided it |

- (mentor_id, mentor_role) → account(account_id, role)
- (moderator_id, moderator_role) → account(account_id, role)
- (work_id) → creative_work(work_id)

## notification

Added per-account notification/read tracking. Application writes workflow notifications in its transaction.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| notification_id | bigint | Yes | PK | IDENTITY | Identifier linking the notification record; see Relationships. |
| account_id | bigint | Yes | FK |  | Identifier linking the account record; see Relationships. |
| kind | text | Yes |  |  | Kind. |
| body | text | Yes |  |  | Body. |
| work_id | bigint | No | FK |  | Identifier linking the work record; see Relationships. |
| read_at | timestamp with time zone | No |  |  | Read at. |
| created_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Timestamp when this row was created. |

- (account_id) → account(account_id)
- (work_id) → creative_work(work_id)

## opportunity

Talent scout opportunity; invitations are the sole opportunity-to-creator relationship.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| opportunity_id | bigint | Yes | PK | IDENTITY | Unique identifier for the opportunity |
| scout_id | bigint | Yes | FK |  | Talent Scout account that created it |
| scout_role | text | No | FK | GENERATED: 'talent_scout'::text | Generated constant used to enforce a talent scout foreign key. |
| title | text | Yes |  |  | Name of the commission, call, or performance |
| starts_on | date | Yes |  |  | Date the opportunity starts |
| ends_on | date | No |  |  | Date the opportunity ends |
| description | text | No |  |  | What the creator is being invited to |

- (scout_id, scout_role) → account(account_id, role)

## platform_setting

Unique setting name; optional administrator audit metadata. Application validates setting-specific values and honors switches.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| setting_id | bigint | Yes | PK | IDENTITY | Unique identifier for the setting |
| name | text | Yes |  |  | Which setting this is, such as comments or GIFs |
| value | text | Yes |  |  | The current value of that setting |
| updated_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Updated at. |
| updated_by | bigint | No | FK |  | Updated by. |
| administrator_role | text | No | FK | GENERATED: 'administrator'::text | Generated constant used to enforce an administrator foreign key. |

- (updated_by, administrator_role) → account(account_id, role)

## private_message

Added general conversation messages; composite FK requires the stored sender to be a conversation member.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| message_id | bigint | Yes | PK | IDENTITY | Identifier linking the message record; see Relationships. |
| conversation_id | bigint | Yes | FK |  | Identifier linking the conversation record; see Relationships. |
| sender_id | bigint | Yes | FK |  | Identifier linking the sender record; see Relationships. |
| body | text | Yes |  |  | Body. |
| sent_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Sent at. |

- (conversation_id, sender_id) → conversation_member(conversation_id, account_id)

## review_request

Composite ownership FK ensures the requester owns the work. Mentor must be an Account with mentor role.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| request_id | bigint | Yes | PK | IDENTITY | Unique identifier for the request |
| creator_id | bigint | Yes | FK |  | Creator who submitted the request |
| mentor_id | bigint | Yes | FK |  | Mentor assigned to the request |
| mentor_role | text | No | FK | GENERATED: 'mentor'::text | Generated constant used to enforce a mentor foreign key. |
| work_id | bigint | Yes | FK |  | Piece the creator wants reviewed |
| note | text | No |  |  | Note from the creator |
| status | text | Yes |  | 'waiting'::text | waiting, accepted, or declined |
| requested_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the request was submitted |

- (mentor_id, mentor_role) → account(account_id, role)
- (work_id, creator_id) → creative_work(work_id, creator_id)

## role_application

Mentor/scout enrollment approval. Accepted application and matching account are committed atomically; deferred triggers preserve approval.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| application_id | bigint | Yes | PK | IDENTITY | Unique identifier for the application |
| administrator_id | bigint | No | FK |  | Administrator who accepted or rejected it. Empty while pending |
| administrator_role | text | No | FK | GENERATED: 'administrator'::text | Generated constant used to enforce an administrator foreign key. |
| applicant_name | text | Yes |  |  | Name on the application |
| email | text | Yes |  |  | Email on the application |
| requested_role | text | Yes | FK |  | Mentor or Talent Scout |
| statement | text | Yes |  |  | Why the applicant wants the role |
| status | text | Yes |  | 'pending'::text | pending, accepted, or rejected |
| submitted_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the application was submitted |
| decided_at | timestamp with time zone | No |  |  | When the administrator decided it |
| approved_account_id | bigint | No | FK |  | Added accepted-application link; role and canonical email must match the approved account. |

- (administrator_id, administrator_role) → account(account_id, role)
- (approved_account_id, requested_role) → account(account_id, role)

## saved_work

Unique account-to-work bookmark relationship.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| save_id | bigint | Yes | PK | IDENTITY | Unique identifier for the save |
| account_id | bigint | Yes | FK |  | Account that saved the work |
| work_id | bigint | Yes | FK |  | Creative work that was saved |
| saved_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When it was saved |

- (account_id) → account(account_id)
- (work_id) → creative_work(work_id)

## scout_candidate

Added private scout shortlist; exactly one row per scout/creator pair.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| candidate_id | bigint | Yes | PK | IDENTITY | Identifier linking the candidate record; see Relationships. |
| scout_id | bigint | Yes | FK |  | Identifier linking the scout record; see Relationships. |
| scout_role | text | No | FK | GENERATED: 'talent_scout'::text | Generated constant used to enforce a talent scout foreign key. |
| creator_id | bigint | Yes | FK |  | Identifier linking the creator record; see Relationships. |
| creator_role | text | No | FK | GENERATED: 'creator'::text | Generated constant used to enforce a creator foreign key. |
| notes | text | No |  |  | Notes. |
| saved_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | Saved at. |

- (creator_id, creator_role) → account(account_id, role)
- (scout_id, scout_role) → account(account_id, role)

## scout_message

Original scout-to-creator message entity retained; optional shared conversation supports creator replies without changing its meaning.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| message_id | bigint | Yes | PK | IDENTITY | Unique identifier for the message |
| scout_id | bigint | Yes | FK |  | Talent Scout account that sent it |
| scout_role | text | No | FK | GENERATED: 'talent_scout'::text | Generated constant used to enforce a talent scout foreign key. |
| creator_id | bigint | Yes | FK |  | Creator account that receives it |
| creator_role | text | No | FK | GENERATED: 'creator'::text | Generated constant used to enforce a creator foreign key. |
| body | text | Yes |  |  | Message text |
| sent_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the message was sent |
| conversation_id | bigint | No | FK |  | Identifier linking the conversation record; see Relationships. |

- (conversation_id) → conversation(conversation_id)
- (creator_id, creator_role) → account(account_id, role)
- (conversation_id, creator_id) → conversation_member(conversation_id, account_id)
- (scout_id, scout_role) → account(account_id, role)
- (conversation_id, scout_id) → conversation_member(conversation_id, account_id)

## status_change

Append-only administrator status audit. Inserting a row locks and updates the target Account; direct status changes fail.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| change_id | bigint | Yes | PK | IDENTITY | Unique identifier for the change |
| administrator_id | bigint | Yes | FK |  | Administrator who made the change |
| administrator_role | text | No | FK | GENERATED: 'administrator'::text | Generated constant used to enforce an administrator foreign key. |
| account_id | bigint | Yes | FK |  | Account whose status changed |
| old_status | text | Yes |  | 'active'::text | Captured by trigger from locked account; supplied input is ignored. |
| new_status | text | Yes |  |  | active, suspended, banned, or deactivated |
| changed_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the status was changed |
| reason | text | Yes |  | 'Administrative decision'::text | Reason. |

- (administrator_id, administrator_role) → account(account_id, role)
- (account_id) → account(account_id)

## user_report

A report against one Account; may have several moderator restrictions over time.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| user_report_id | bigint | Yes | PK | IDENTITY | Unique identifier for the user report |
| account_id | bigint | Yes | FK |  | Account that was reported |
| reason | text | Yes |  |  | Why the account was reported |
| reported_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the report was filed |
| reporter_id | bigint | No | FK |  | Identifier linking the reporter record; see Relationships. |

- (account_id) → account(account_id)
- (reporter_id) → account(account_id)

## work_category

Added many-to-many work/category junction, one association per pair.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| work_id | bigint | Yes | PK, FK |  | Identifier linking the work record; see Relationships. |
| category_id | bigint | Yes | PK, FK |  | Identifier linking the category record; see Relationships. |

- (category_id) → category(category_id)
- (work_id) → creative_work(work_id)

## work_media

Added ordered external media attachments; URLs are references, not uploaded file storage.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| media_id | bigint | Yes | PK | IDENTITY | Identifier linking the media record; see Relationships. |
| work_id | bigint | Yes | FK |  | Identifier linking the work record; see Relationships. |
| asset_url | text | Yes |  |  | Asset url. |
| alt_text | text | Yes |  |  | Alt text. |
| position | integer | Yes |  | 1 | Position. |

- (work_id) → creative_work(work_id)

## work_report

Every insert atomically opens exactly one moderation case; reason_type supports copyright/fraud escalation.

| Field | Type | Required | Key | Default / generation | Meaning |
| --- | --- | --- | --- | --- | --- |
| report_id | bigint | Yes | PK | IDENTITY | Unique identifier for the report |
| work_id | bigint | Yes | FK |  | Piece that was reported |
| reason | text | Yes |  |  | Why the work was reported |
| reporter_name | text | Yes |  |  | Name of the person who reported it |
| reported_at | timestamp with time zone | Yes |  | CURRENT_TIMESTAMP | When the report was filed |
| reporter_id | bigint | No | FK |  | Identifier linking the reporter record; see Relationships. |
| reason_type | text | Yes |  | 'other'::text | Reason type. |

- (reporter_id) → account(account_id)
- (work_id) → creative_work(work_id)

