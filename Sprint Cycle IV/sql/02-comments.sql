
-- Lets a comment sit under another comment on the same piece. 
-- Run after Sprint Cycle III and sql/01-auth.sql. Safe to run again. 
USE xpression; 
SET @add_parent = ( 
SELECT IF( 
COUNT(*) = 0, 
'ALTER TABLE comment ADD COLUMN parent_comment_id INT NULL AFTER author_id, ADD CONSTRAINT fk_comment_parent FOREIGN KEY (parent_comment_id) REFERENCES comment (comment_id)', 
'SELECT ''parent_comment_id already present''' 
) 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'xpression' 
AND TABLE_NAME = 'comment' 
AND COLUMN_NAME = 'parent_comment_id' 
); 
PREPARE add_parent_stmt FROM @add_parent; 
EXECUTE add_parent_stmt; 
DEALLOCATE PREPARE add_parent_stmt; 
