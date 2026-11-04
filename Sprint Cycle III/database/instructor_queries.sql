\set ON_ERROR_STOP on
\pset pager off
SET search_path TO xpression, public;

-- Change one value, rerun the SELECT, and explain its joins/filters in the presentation.
-- These are query practice examples, not a prediction of the instructor's questions.

\echo 'Practice 1 | Find an account by a partial name (change Nia)'
SELECT account_id, name, email, role, status
FROM account
WHERE name ILIKE '%Nia%'
ORDER BY name;

\echo 'Practice 2 | Creators with at least two portfolio pieces'
SELECT a.name, count(w.work_id) AS portfolio_pieces
FROM account AS a
JOIN creative_work AS w ON w.creator_id = a.account_id
WHERE a.role = 'creator'
GROUP BY a.account_id, a.name
HAVING count(w.work_id) >= 2
ORDER BY portfolio_pieces DESC, a.name;

\echo 'Practice 3 | Find unanswered invitations, including creators with no invitations'
SELECT a.name, o.title AS opportunity, i.status
FROM account AS a
LEFT JOIN invitation AS i ON i.creator_id = a.account_id
LEFT JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
WHERE a.role = 'creator' AND (i.status = 'sent' OR i.invitation_id IS NULL)
ORDER BY a.name, o.title;

\echo 'Practice 4 | How many waiting review requests does each mentor have?'
SELECT a.name AS mentor,
       count(rr.request_id) FILTER (WHERE rr.status = 'waiting') AS waiting,
       count(rr.request_id) FILTER (WHERE rr.status = 'accepted') AS accepted,
       count(rr.request_id) FILTER (WHERE rr.status = 'declined') AS declined
FROM account AS a
LEFT JOIN review_request AS rr ON rr.mentor_id = a.account_id
WHERE a.role = 'mentor'
GROUP BY a.account_id, a.name
ORDER BY a.name;

\echo 'Practice 5 | Find works that have never been reported'
SELECT w.work_id, w.title, a.name AS creator
FROM creative_work AS w
JOIN account AS a ON a.account_id = w.creator_id
WHERE NOT EXISTS (SELECT 1 FROM work_report AS r WHERE r.work_id = w.work_id)
ORDER BY w.title;

\echo 'Practice 6 | Number of accounts in each role and status'
SELECT role, status, count(*) AS accounts
FROM account
GROUP BY role, status
ORDER BY role, status;

\echo 'Practice 7 | Introspect foreign keys using PostgreSQL native catalog data'
SELECT conrelid::regclass AS table_name, conname,
       pg_get_constraintdef(oid) AS relationship
FROM pg_constraint
WHERE contype = 'f' AND connamespace = 'xpression'::regnamespace
ORDER BY conrelid::regclass::text, conname;
