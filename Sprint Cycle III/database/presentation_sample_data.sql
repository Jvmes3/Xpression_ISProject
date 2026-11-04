-- 1. Accounts: meaningful names across all five system roles.
-- Credential fields are excluded from this presentation view.
SELECT account_id, name, email, role, status, discipline, open_to_commissions
FROM xpression.account
ORDER BY account_id;

-- 2. Creative work: each piece belongs to its named creator.
SELECT w.work_id, w.title, creator.name AS creator, w.media_type,
       w.description, w.featured, w.archived, w.visibility, w.published_at
FROM xpression.creative_work AS w
JOIN xpression.account AS creator ON creator.account_id = w.creator_id
ORDER BY w.work_id;

-- 3. Opportunities: each event or commission belongs to a talent scout.
SELECT o.opportunity_id, o.title, scout.name AS talent_scout,
       o.starts_on, o.ends_on, o.description
FROM xpression.opportunity AS o
JOIN xpression.account AS scout ON scout.account_id = o.scout_id
ORDER BY o.opportunity_id;

-- 4. Invitations: a creator and an opportunity are linked by one invitation.
SELECT i.invitation_id, creator.name AS creator, o.title AS opportunity,
       i.status, i.invited_at, i.responded_at
FROM xpression.invitation AS i
JOIN xpression.account AS creator ON creator.account_id = i.creator_id
JOIN xpression.opportunity AS o ON o.opportunity_id = i.opportunity_id
ORDER BY i.invitation_id;

-- 5. Review requests: see the creator, assigned mentor, and actual work together.
SELECT r.request_id, creator.name AS creator, mentor.name AS mentor,
       w.title AS creative_work, r.note, r.status, r.requested_at
FROM xpression.review_request AS r
JOIN xpression.account AS creator ON creator.account_id = r.creator_id
JOIN xpression.account AS mentor ON mentor.account_id = r.mentor_id
JOIN xpression.creative_work AS w ON w.work_id = r.work_id
ORDER BY r.request_id;
