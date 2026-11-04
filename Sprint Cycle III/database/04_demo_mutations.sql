\set ON_ERROR_STOP on
\pset pager off
SET search_path TO xpression, public;

-- Each presentation segment is one transaction. ROLLBACK restores the original
-- sample rows so this entire file can be demonstrated repeatedly.
-- IDs above 900000 are reserved here for temporary demonstration rows.

\echo 'DEMO A | Publish creative work: INSERT a creator portfolio piece'
BEGIN;
INSERT INTO creative_work
    (work_id, creator_id, title, media_type, description, content_text,
     featured, archived, published_at)
VALUES
    (900001, 3, 'Blue hour platform', 'writing',
     'A new poem about waiting for the first train at dawn.',
     'The platform holds the blue hour / until the rails begin to sing.',
     false, false, '2026-11-05 14:00:00+00')
RETURNING work_id, creator_id, title, media_type, published_at;

\echo 'DEMO A | Modify the existing piece, then retrieve its creator relationship'
UPDATE creative_work
SET title = 'Blue hour platform — revised', featured = true
WHERE work_id = 900001
RETURNING work_id, title, featured;

SELECT a.name AS creator, w.title, w.media_type, w.featured
FROM creative_work AS w
JOIN account AS a ON a.account_id = w.creator_id
WHERE w.work_id = 900001;
ROLLBACK;

\echo 'DEMO B | Invite a creator: INSERT opportunity and its invitation link'
BEGIN;
INSERT INTO opportunity
    (opportunity_id, scout_id, title, starts_on, ends_on, description)
VALUES
    (900002, 9, 'Winter waterfront acoustic session', '2026-12-12', '2026-12-12',
     'Paid acoustic performance at the waterfront community studio.')
RETURNING opportunity_id, title, starts_on;

INSERT INTO invitation (invitation_id, opportunity_id, creator_id, status, invited_at)
VALUES (900002, 900002, 5, 'sent', '2026-11-05 14:05:00+00')
RETURNING invitation_id, opportunity_id, creator_id, status;

\echo 'DEMO B | Creator accepts: UPDATE the same invitation row'
UPDATE invitation
SET status = 'accepted', responded_at = '2026-11-05 14:06:00+00'
WHERE invitation_id = 900002;
SELECT o.title, scout.name AS scout, creator.name AS creator, i.status
FROM invitation AS i
JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
JOIN account AS scout ON scout.account_id = o.scout_id
JOIN account AS creator ON creator.account_id = i.creator_id
WHERE i.invitation_id = 900002;
ROLLBACK;

\echo 'DEMO C | Review reported work: INSERT automatically opens one moderation case'
BEGIN;
INSERT INTO work_report (report_id, work_id, reason, reporter_name, reported_at)
VALUES
    (900003, 2, 'Please check whether this caption includes an unrelated advertisement.',
     'Nia Brooks', '2026-11-05 14:10:00+00')
RETURNING report_id, work_id, reason;

SELECT case_id, report_id, findings, action_taken, status
FROM moderation_case WHERE report_id = 900003;

\echo 'DEMO C | Record the moderator decision and observe the work visibility'
UPDATE moderation_case
SET moderator_id = 2,
    findings = 'The current caption is an unrelated advertisement; hide pending revision.',
    action_taken = 'hidden', status = 'closed'
WHERE report_id = 900003
RETURNING case_id, moderator_id, findings, action_taken, status;

SELECT w.title, w.visibility, mc.action_taken, mc.status AS case_status
FROM creative_work AS w
JOIN work_report AS r ON r.work_id = w.work_id
JOIN moderation_case AS mc ON mc.report_id = r.report_id
WHERE r.report_id = 900003;
ROLLBACK;

\echo 'All three demonstrations rolled back; original sample data is preserved.'
