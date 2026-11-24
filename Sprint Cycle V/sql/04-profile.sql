-- Sprint Cycle V profile fields. Safe to run more than once.

USE xpression;

SET @add_bio = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE account ADD COLUMN bio VARCHAR(300) NULL AFTER discipline',
    'SELECT ''bio already present'''
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'xpression' AND TABLE_NAME = 'account' AND COLUMN_NAME = 'bio'
);
PREPARE add_bio_stmt FROM @add_bio;
EXECUTE add_bio_stmt;
DEALLOCATE PREPARE add_bio_stmt;

SET @add_avatar = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE account ADD COLUMN avatar_url VARCHAR(500) NULL AFTER bio',
    'SELECT ''avatar_url already present'''
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'xpression' AND TABLE_NAME = 'account' AND COLUMN_NAME = 'avatar_url'
);
PREPARE add_avatar_stmt FROM @add_avatar;
EXECUTE add_avatar_stmt;
DEALLOCATE PREPARE add_avatar_stmt;

SET @add_music = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE account ADD COLUMN music_url VARCHAR(500) NULL AFTER avatar_url',
    'SELECT ''music_url already present'''
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'xpression' AND TABLE_NAME = 'account' AND COLUMN_NAME = 'music_url'
);
PREPARE add_music_stmt FROM @add_music;
EXECUTE add_music_stmt;
DEALLOCATE PREPARE add_music_stmt;

SET @add_website = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE account ADD COLUMN website_url VARCHAR(500) NULL AFTER music_url',
    'SELECT ''website_url already present'''
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'xpression' AND TABLE_NAME = 'account' AND COLUMN_NAME = 'website_url'
);
PREPARE add_website_stmt FROM @add_website;
EXECUTE add_website_stmt;
DEALLOCATE PREPARE add_website_stmt;

SET @add_practices = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE account ADD COLUMN practices VARCHAR(80) NULL AFTER website_url',
    'SELECT ''practices already present'''
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'xpression' AND TABLE_NAME = 'account' AND COLUMN_NAME = 'practices'
);
PREPARE add_practices_stmt FROM @add_practices;
EXECUTE add_practices_stmt;
DEALLOCATE PREPARE add_practices_stmt;
