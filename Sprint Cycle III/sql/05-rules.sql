-- Five rules reject a bad insert. Each check prints one row. No bad row is stored.

USE xpression;

DROP PROCEDURE IF EXISTS demo_duplicate_email;
DROP PROCEDURE IF EXISTS demo_missing_creator;
DROP PROCEDURE IF EXISTS demo_music_without_link;
DROP PROCEDURE IF EXISTS demo_second_invitation;
DROP PROCEDURE IF EXISTS demo_second_case;

DELIMITER $$

CREATE PROCEDURE demo_duplicate_email()
BEGIN
  DECLARE msg TEXT DEFAULT NULL;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 msg = MESSAGE_TEXT;
  END;

  INSERT INTO account (name, email, role, status, open_to_commissions)
  VALUES ('Second Amara', 'amara.cole@xpression.example', 'Creator', 'active', FALSE);

  SELECT 'Email must be unique' AS rule_check, COALESCE(msg, 'NOT enforced') AS database_response;
END$$

CREATE PROCEDURE demo_missing_creator()
BEGIN
  DECLARE msg TEXT DEFAULT NULL;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 msg = MESSAGE_TEXT;
  END;

  INSERT INTO creative_work (
    creator_id, title, media_type, description, featured, archived, published_at
  ) VALUES (
    6, 'Scout trying to publish', 'Writing', 'Marcus is a talent scout, not a creator.', FALSE, FALSE, NOW()
  );

  SELECT 'A piece must belong to a Creator' AS rule_check, COALESCE(msg, 'NOT enforced') AS database_response;
END$$

CREATE PROCEDURE demo_music_without_link()
BEGIN
  DECLARE msg TEXT DEFAULT NULL;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 msg = MESSAGE_TEXT;
  END;

  INSERT INTO creative_work (
    creator_id, title, media_type, description, soundcloud_url, featured, archived, published_at
  ) VALUES (
    3, 'Untitled demo', 'Music', 'A music piece with no SoundCloud link.', NULL, FALSE, FALSE, NOW()
  );

  SELECT 'Music needs a SoundCloud URL' AS rule_check, COALESCE(msg, 'NOT enforced') AS database_response;
END$$

CREATE PROCEDURE demo_second_invitation()
BEGIN
  DECLARE msg TEXT DEFAULT NULL;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 msg = MESSAGE_TEXT;
  END;

  INSERT INTO invitation (opportunity_id, creator_id, status, invited_at)
  VALUES (1, 2, 'sent', NOW());

  SELECT 'One invitation per creator and opportunity' AS rule_check, COALESCE(msg, 'NOT enforced') AS database_response;
END$$

CREATE PROCEDURE demo_second_case()
BEGIN
  DECLARE msg TEXT DEFAULT NULL;
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 msg = MESSAGE_TEXT;
  END;

  INSERT INTO moderation_case (
    report_id, moderator_id, findings, action_taken, status, recorded_at
  ) VALUES (
    1, 7, 'A second case for the same report.', 'hidden', 'open', NOW()
  );

  SELECT 'One report opens one case' AS rule_check, COALESCE(msg, 'NOT enforced') AS database_response;
END$$

DELIMITER ;

CALL demo_duplicate_email();
CALL demo_missing_creator();
CALL demo_music_without_link();
CALL demo_second_invitation();
CALL demo_second_case();
