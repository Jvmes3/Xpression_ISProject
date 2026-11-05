-- Read queries. Each statement returns at least one row.

USE xpression;

-- A. Retrieve / search. Posts that belong to one creator.
SELECT title, media_type, featured, archived, published_at
FROM creator_portfolio
WHERE creator_name = 'Amara Cole'
ORDER BY published_at;

-- B. Related data. Invitations for one opportunity, with the creator who was invited.
SELECT o.title AS opportunity, a.name AS creator, i.status, i.invited_at
FROM invitation AS i
JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
JOIN account AS a ON a.account_id = i.creator_id
WHERE o.title = 'Winter listening night'
ORDER BY i.invited_at;

-- Related data for the reported-work use case. Both reports on Studio wall study have a case.
SELECT title, creator_name, reason, reporter_name, findings, action_taken, case_status, moderator_name
FROM reported_work
WHERE title = 'Studio wall study'
ORDER BY reported_at;

-- Further searches, if the instructor asks for a different creator or a different piece.
SELECT title, media_type, soundcloud_url, featured
FROM creator_portfolio
WHERE creator_name = 'Nia Brooks';

SELECT s.name AS scout, o.title, c.name AS creator, i.status
FROM invitation AS i
JOIN opportunity AS o ON o.opportunity_id = i.opportunity_id
JOIN account AS s ON s.account_id = o.scout_id
JOIN account AS c ON c.account_id = i.creator_id
WHERE o.title = 'Riverfront mural call';

SELECT title, media_type, featured
FROM creative_work
WHERE media_type = 'Music';

