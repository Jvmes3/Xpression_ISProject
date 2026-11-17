-- Sprint Cycle IV sign-in. Run this after Sprint Cycle III sql/01-schema.sql and sql/02-sample-data.sql.
-- Every sample account can sign in with Xpression1!
-- Jordan Lee stays suspended, so the application still refuses that sign-in.

USE xpression;

SET @add_hash = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE account ADD COLUMN password_hash VARCHAR(255) NULL AFTER email',
    'SELECT ''password_hash already present'''
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'xpression'
    AND TABLE_NAME = 'account'
    AND COLUMN_NAME = 'password_hash'
);
PREPARE add_hash_stmt FROM @add_hash;
EXECUTE add_hash_stmt;
DEALLOCATE PREPARE add_hash_stmt;

UPDATE account
SET password_hash = '$2b$10$AsesB60ALIGrXz5idLI5k.87AwIkutzh86KiZIeS3yr91euWhXRC6';
