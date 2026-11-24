-- Comment thread for Unsent letter, plus like and dislike counts.
-- The Cycle III description only summarized this page. These rows are the page's comments.
-- Run after sql/02-comments.sql. Safe to run again.

USE xpression;

SET @add_likes = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE comment ADD COLUMN likes INT NOT NULL DEFAULT 0, ADD COLUMN dislikes INT NOT NULL DEFAULT 0',
    'SELECT ''likes already present'''
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'xpression'
    AND TABLE_NAME = 'comment'
    AND COLUMN_NAME = 'likes'
);
PREPARE add_likes_stmt FROM @add_likes;
EXECUTE add_likes_stmt;
DEALLOCATE PREPARE add_likes_stmt;

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 3, 5, 1, NULL,
  'jordan please. we already said this in the chat. take the pizza post down',
  NULL, '2026-10-08 11:41:00', 8, 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 3);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 4, 5, 4, 3,
  'no?? the cheese slid off in one sheet. I''m not deleting it',
  NULL, '2026-10-08 11:48:00', 1, 6
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 4);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 5, 5, 2, NULL,
  'man you dragged half the floor over a slice. delete this',
  NULL, '2026-10-08 12:16:00', 5, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 5);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 6, 5, 4, 5,
  'I''ll put the receipt up tonight then. y''all are really out here defending Sal''s',
  NULL, '2026-10-08 12:22:00', 0, 7
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 6);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 7, 5, 3, NULL,
  'can we not do this on the feed. some of us are just trying to scroll',
  NULL, '2026-10-08 15:05:00', 6, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 7);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 8, 5, 5, 7,
  'thank you. I muted the chat for this and now it''s a whole post',
  NULL, '2026-10-08 15:40:00', 4, 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 8);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 9, 5, 4, NULL,
  'receipt. $4.16 with tax. still nothing from the counter. the pineapple was not a mistake, they did it twice',
  NULL, '2026-10-08 21:05:00', 0, 9
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 9);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 10, 5, 6, NULL,
  'you posted the receipt after everybody told you to chill. come on',
  NULL, '2026-10-08 21:18:00', 7, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 10);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 11, 5, 2, NULL,
  'he really left the receipt thing up all night',
  NULL, '2026-10-09 10:12:00', 3, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 11);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 12, 5, 3, 11,
  'and then nothing. I checked this morning, no reply. I''m muting it',
  NULL, '2026-10-09 18:44:00', 2, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 12);

INSERT INTO comment (comment_id, work_id, author_id, parent_comment_id, body, gif_url, created_at, likes, dislikes)
SELECT 13, 5, 1, NULL,
  'cool so we''re just gonna keep seeing this. I''m done feeding it',
  NULL, '2026-10-10 08:16:00', 4, 0
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM comment WHERE comment_id = 13);

UPDATE comment SET body = 'jordan please. we already said this in the chat. take the pizza post down' WHERE comment_id = 3 AND work_id = 5;
UPDATE comment SET body = 'no?? the cheese slid off in one sheet. I''m not deleting it' WHERE comment_id = 4 AND work_id = 5;
UPDATE comment SET body = 'man you dragged half the floor over a slice. delete this' WHERE comment_id = 5 AND work_id = 5;
UPDATE comment SET body = 'I''ll put the receipt up tonight then. y''all are really out here defending Sal''s' WHERE comment_id = 6 AND work_id = 5;
UPDATE comment SET body = 'can we not do this on the feed. some of us are just trying to scroll' WHERE comment_id = 7 AND work_id = 5;
UPDATE comment SET body = 'thank you. I muted the chat for this and now it''s a whole post' WHERE comment_id = 8 AND work_id = 5;
UPDATE comment SET body = 'receipt. $4.16 with tax. still nothing from the counter. the pineapple was not a mistake, they did it twice' WHERE comment_id = 9 AND work_id = 5;
UPDATE comment SET body = 'you posted the receipt after everybody told you to chill. come on' WHERE comment_id = 10 AND work_id = 5;
UPDATE comment SET body = 'he really left the receipt thing up all night' WHERE comment_id = 11 AND work_id = 5;
UPDATE comment SET body = 'and then nothing. I checked this morning, no reply. I''m muting it' WHERE comment_id = 12 AND work_id = 5;
UPDATE comment SET body = 'cool so we''re just gonna keep seeing this. I''m done feeding it' WHERE comment_id = 13 AND work_id = 5;

UPDATE comment SET likes = 3 WHERE comment_id = 1 AND likes = 0 AND dislikes = 0;
UPDATE comment SET likes = 5 WHERE comment_id = 2 AND likes = 0 AND dislikes = 0;

ALTER TABLE comment AUTO_INCREMENT = 14;
