-- Add one piece and feature another. Safe to run again.
-- Every SELECT in this file returns a row.

USE xpression;

DELETE FROM creative_work
WHERE title = 'Platform notes'
  AND creator_id = (SELECT account_id FROM account WHERE email = 'amara.cole@xpression.example');

UPDATE creative_work
SET featured = FALSE
WHERE title = 'Night bus';

-- Before the change.
SELECT work_id, title, featured
FROM creative_work
WHERE title = 'Night bus';

-- D. Modify. Featuring Night bus updates this row. It does not create a second piece.
UPDATE creative_work
SET featured = TRUE
WHERE title = 'Night bus';

SELECT work_id, title, featured
FROM creative_work
WHERE title = 'Night bus';

-- C. Add. Amara publishes a new piece.
INSERT INTO creative_work (
  creator_id, title, media_type, description, soundcloud_url, featured, archived, published_at
)
SELECT account_id, 'Platform notes', 'Writing',
  'A short essay about the last train and the notebook Amara keeps for it.',
  NULL, FALSE, FALSE, '2026-11-03 16:00:00'
FROM account
WHERE email = 'amara.cole@xpression.example';

SELECT a.name AS creator, w.work_id, w.title, w.media_type, w.published_at
FROM creative_work AS w
JOIN account AS a ON a.account_id = w.creator_id
WHERE w.title = 'Platform notes';
