\set ON_ERROR_STOP on
\pset pager off
SET search_path TO xpression, public;

-- Run the whole file, or copy one SELECT into psql/pgAdmin for the presentation.
-- All displayed dates are fixed sample dates, so the demonstration stays repeatable.

\echo 'Q1 | Retrieve/search: active music creators accepting commissions'
SELECT a.account_id, a.name, a.discipline, a.open_to_commissions,
       count(w.work_id) AS portfolio_pieces
FROM account AS a
JOIN creative_work AS w ON w.creator_id = a.account_id
WHERE a.role = 'creator'
  AND a.status = 'active'
  AND a.open_to_commissions
  AND a.discipline ILIKE '%music%'
  AND NOT w.archived
  AND w.visibility = 'available'
GROUP BY a.account_id, a.name, a.discipline, a.open_to_commissions
ORDER BY a.name;

\echo 'Q2 | Related data / publish use case: Amara Cole portfolio'
SELECT w.work_id, a.name AS creator, w.title, w.media_type,
       w.featured, w.published_at
FROM creative_work AS w
JOIN account AS a ON a.account_id = w.creator_id
WHERE a.email = 'amara.cole@example.org' AND NOT w.archived
  AND w.visibility = 'available'
ORDER BY w.published_at DESC;

\echo 'Q3 | Related data: structured mentor feedback and creator reply'
-- The signed-in creator ID must come from the future server session, not a browser field.
-- This scoped SELECT demonstrates rule 9; the database owner can still inspect all rows.
SELECT w.title, creator.name AS creator, mentor.name AS mentor,
       rr.status AS request_status, mf.strengths, mf.improvements,
       mf.recommendation, fr.reply_text
FROM mentor_feedback AS mf
JOIN review_request AS rr ON rr.request_id = mf.request_id
JOIN creative_work AS w ON w.work_id = mf.work_id
JOIN account AS creator ON creator.account_id = w.creator_id
JOIN account AS mentor ON mentor.account_id = mf.mentor_id
LEFT JOIN feedback_reply AS fr ON fr.feedback_id = mf.feedback_id
WHERE w.creator_id = 3
ORDER BY mf.written_at DESC;

\echo 'Q4 | Invitation use case: creator, invitation, opportunity, and scout'
SELECT o.title AS opportunity, scout.name AS scout, creator.name AS creator,
       o.starts_on, o.ends_on, i.status AS invitation_status
FROM invitation AS i
JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
JOIN account AS scout ON scout.account_id = o.scout_id
JOIN account AS creator ON creator.account_id = i.creator_id
ORDER BY o.starts_on, o.title, creator.name;

\echo 'Q5 | Reported-work use case: report and its moderation decision'
SELECT wr.report_id, w.title, creator.name AS creator,
       wr.reason, wr.reporter_name, mc.case_id, moderator.name AS moderator,
       mc.findings, mc.action_taken, mc.status AS case_status
FROM work_report AS wr
JOIN creative_work AS w ON w.work_id = wr.work_id
JOIN account AS creator ON creator.account_id = w.creator_id
JOIN moderation_case AS mc ON mc.report_id = wr.report_id
LEFT JOIN account AS moderator ON moderator.account_id = mc.moderator_id
ORDER BY wr.reported_at;

\echo 'Q6 | Public discussion: comments, their authors, and the creative work'
SELECT w.title, a.name AS author, c.body, c.gif_url, c.created_at
FROM comment AS c
JOIN creative_work AS w ON w.work_id = c.work_id
JOIN account AS a ON a.account_id = c.author_id
WHERE w.work_id = 1
ORDER BY c.created_at;

\echo 'Q7 | Administrator report: published work by medium in the sample period'
SELECT media_type, count(*) AS pieces,
       count(DISTINCT creator_id) AS contributing_creators
FROM creative_work
WHERE published_at >= TIMESTAMPTZ '2026-10-01 00:00:00+00'
  AND published_at < TIMESTAMPTZ '2026-11-04 00:00:00+00'
GROUP BY media_type
ORDER BY media_type;

\echo 'Q8 | Account accountability: restrictions and administrator status history'
SELECT a.name, a.status AS current_status, sc.new_status,
       admin.name AS changed_by, sc.changed_at
FROM status_change AS sc
JOIN account AS a ON a.account_id = sc.account_id
JOIN account AS admin ON admin.account_id = sc.administrator_id
ORDER BY sc.changed_at, sc.change_id;

\echo 'Q9 | Mentor queue: waiting review requests with the actual work and creator'
SELECT rr.request_id, creator.name AS creator, mentor.name AS mentor,
       w.title, rr.note, rr.requested_at
FROM review_request AS rr
JOIN account AS creator ON creator.account_id = rr.creator_id
JOIN account AS mentor ON mentor.account_id = rr.mentor_id
JOIN creative_work AS w ON w.work_id = rr.work_id
WHERE rr.status = 'waiting'
ORDER BY rr.requested_at;
