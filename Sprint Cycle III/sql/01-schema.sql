-- Xpression database. Every entity in the Sprint Cycle II data dictionary is a table.
-- This file drops and recreates the database named xpression.

DROP DATABASE IF EXISTS xpression;
CREATE DATABASE xpression
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE xpression;

CREATE TABLE account (
  account_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('Creator', 'Mentor', 'Talent Scout', 'Moderator', 'Administrator') NOT NULL,
  status ENUM('active', 'suspended', 'banned', 'deactivated') NOT NULL DEFAULT 'active',
  discipline VARCHAR(80) NULL,
  open_to_commissions BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (account_id),
  UNIQUE KEY uq_account_email (email)
);

CREATE TABLE creative_work (
  work_id INT NOT NULL AUTO_INCREMENT,
  creator_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  media_type ENUM('Writing', 'Visual art', 'Music') NOT NULL,
  description TEXT NOT NULL,
  soundcloud_url VARCHAR(500) NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  published_at DATETIME NOT NULL,
  PRIMARY KEY (work_id),
  CONSTRAINT fk_work_creator FOREIGN KEY (creator_id) REFERENCES account (account_id),
  CONSTRAINT chk_music_soundcloud CHECK (
    media_type <> 'Music'
    OR (soundcloud_url IS NOT NULL AND CHAR_LENGTH(TRIM(soundcloud_url)) > 0)
  )
);

CREATE TABLE review_request (
  request_id INT NOT NULL AUTO_INCREMENT,
  creator_id INT NOT NULL,
  mentor_id INT NOT NULL,
  work_id INT NOT NULL,
  note VARCHAR(500) NULL,
  status ENUM('waiting', 'accepted', 'declined') NOT NULL,
  requested_at DATETIME NOT NULL,
  PRIMARY KEY (request_id),
  CONSTRAINT fk_request_creator FOREIGN KEY (creator_id) REFERENCES account (account_id),
  CONSTRAINT fk_request_mentor FOREIGN KEY (mentor_id) REFERENCES account (account_id),
  CONSTRAINT fk_request_work FOREIGN KEY (work_id) REFERENCES creative_work (work_id)
);

CREATE TABLE mentor_feedback (
  feedback_id INT NOT NULL AUTO_INCREMENT,
  work_id INT NOT NULL,
  mentor_id INT NOT NULL,
  request_id INT NOT NULL,
  strengths TEXT NOT NULL,
  improvements TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  written_at DATETIME NOT NULL,
  PRIMARY KEY (feedback_id),
  UNIQUE KEY uq_feedback_request (request_id),
  CONSTRAINT fk_feedback_work FOREIGN KEY (work_id) REFERENCES creative_work (work_id),
  CONSTRAINT fk_feedback_mentor FOREIGN KEY (mentor_id) REFERENCES account (account_id),
  CONSTRAINT fk_feedback_request FOREIGN KEY (request_id) REFERENCES review_request (request_id)
);

CREATE TABLE feedback_reply (
  reply_id INT NOT NULL AUTO_INCREMENT,
  feedback_id INT NOT NULL,
  reply_text TEXT NOT NULL,
  replied_at DATETIME NOT NULL,
  PRIMARY KEY (reply_id),
  UNIQUE KEY uq_reply_feedback (feedback_id),
  CONSTRAINT fk_reply_feedback FOREIGN KEY (feedback_id) REFERENCES mentor_feedback (feedback_id)
);

CREATE TABLE nomination (
  nomination_id INT NOT NULL AUTO_INCREMENT,
  mentor_id INT NOT NULL,
  work_id INT NOT NULL,
  moderator_id INT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'declined') NOT NULL,
  nominated_at DATETIME NOT NULL,
  decided_at DATETIME NULL,
  PRIMARY KEY (nomination_id),
  CONSTRAINT fk_nomination_mentor FOREIGN KEY (mentor_id) REFERENCES account (account_id),
  CONSTRAINT fk_nomination_work FOREIGN KEY (work_id) REFERENCES creative_work (work_id),
  CONSTRAINT fk_nomination_moderator FOREIGN KEY (moderator_id) REFERENCES account (account_id)
);

CREATE TABLE scout_message (
  message_id INT NOT NULL AUTO_INCREMENT,
  scout_id INT NOT NULL,
  creator_id INT NOT NULL,
  body TEXT NOT NULL,
  sent_at DATETIME NOT NULL,
  PRIMARY KEY (message_id),
  CONSTRAINT fk_message_scout FOREIGN KEY (scout_id) REFERENCES account (account_id),
  CONSTRAINT fk_message_creator FOREIGN KEY (creator_id) REFERENCES account (account_id)
);

CREATE TABLE opportunity (
  opportunity_id INT NOT NULL AUTO_INCREMENT,
  scout_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  starts_on DATE NOT NULL,
  ends_on DATE NULL,
  description TEXT NULL,
  PRIMARY KEY (opportunity_id),
  CONSTRAINT fk_opportunity_scout FOREIGN KEY (scout_id) REFERENCES account (account_id)
);

CREATE TABLE invitation (
  invitation_id INT NOT NULL AUTO_INCREMENT,
  opportunity_id INT NOT NULL,
  creator_id INT NOT NULL,
  status ENUM('sent', 'accepted', 'declined') NOT NULL,
  invited_at DATETIME NOT NULL,
  PRIMARY KEY (invitation_id),
  UNIQUE KEY uq_invitation_once (opportunity_id, creator_id),
  CONSTRAINT fk_invitation_opportunity FOREIGN KEY (opportunity_id) REFERENCES opportunity (opportunity_id),
  CONSTRAINT fk_invitation_creator FOREIGN KEY (creator_id) REFERENCES account (account_id)
);

CREATE TABLE work_report (
  report_id INT NOT NULL AUTO_INCREMENT,
  work_id INT NOT NULL,
  reason TEXT NOT NULL,
  reporter_name VARCHAR(120) NOT NULL,
  reported_at DATETIME NOT NULL,
  PRIMARY KEY (report_id),
  CONSTRAINT fk_work_report_work FOREIGN KEY (work_id) REFERENCES creative_work (work_id)
);

CREATE TABLE moderation_case (
  case_id INT NOT NULL AUTO_INCREMENT,
  report_id INT NOT NULL,
  moderator_id INT NOT NULL,
  findings TEXT NOT NULL,
  action_taken ENUM('kept available', 'hidden', 'removed') NOT NULL,
  status ENUM('open', 'in review', 'escalated', 'closed') NOT NULL,
  recorded_at DATETIME NOT NULL,
  PRIMARY KEY (case_id),
  UNIQUE KEY uq_case_report (report_id),
  CONSTRAINT fk_case_report FOREIGN KEY (report_id) REFERENCES work_report (report_id),
  CONSTRAINT fk_case_moderator FOREIGN KEY (moderator_id) REFERENCES account (account_id)
);

CREATE TABLE user_report (
  user_report_id INT NOT NULL AUTO_INCREMENT,
  account_id INT NOT NULL,
  reason TEXT NOT NULL,
  reported_at DATETIME NOT NULL,
  PRIMARY KEY (user_report_id),
  CONSTRAINT fk_user_report_account FOREIGN KEY (account_id) REFERENCES account (account_id)
);

CREATE TABLE account_restriction (
  restriction_id INT NOT NULL AUTO_INCREMENT,
  user_report_id INT NOT NULL,
  moderator_id INT NOT NULL,
  action_type ENUM('warn', 'restrict', 'refer for ban') NOT NULL,
  recorded_at DATETIME NOT NULL,
  PRIMARY KEY (restriction_id),
  CONSTRAINT fk_restriction_report FOREIGN KEY (user_report_id) REFERENCES user_report (user_report_id),
  CONSTRAINT fk_restriction_moderator FOREIGN KEY (moderator_id) REFERENCES account (account_id)
);

CREATE TABLE status_change (
  change_id INT NOT NULL AUTO_INCREMENT,
  administrator_id INT NOT NULL,
  account_id INT NOT NULL,
  new_status ENUM('active', 'suspended', 'banned', 'deactivated') NOT NULL,
  changed_at DATETIME NOT NULL,
  PRIMARY KEY (change_id),
  CONSTRAINT fk_change_administrator FOREIGN KEY (administrator_id) REFERENCES account (account_id),
  CONSTRAINT fk_change_account FOREIGN KEY (account_id) REFERENCES account (account_id)
);

CREATE TABLE role_application (
  application_id INT NOT NULL AUTO_INCREMENT,
  administrator_id INT NULL,
  applicant_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  requested_role ENUM('Mentor', 'Talent Scout') NOT NULL,
  statement TEXT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') NOT NULL,
  submitted_at DATETIME NOT NULL,
  decided_at DATETIME NULL,
  PRIMARY KEY (application_id),
  CONSTRAINT fk_application_administrator FOREIGN KEY (administrator_id) REFERENCES account (account_id)
);

CREATE TABLE analytics_report (
  report_id INT NOT NULL AUTO_INCREMENT,
  administrator_id INT NOT NULL,
  report_type ENUM('platform usage', 'accounts', 'creative posts') NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  generated_at DATETIME NOT NULL,
  result_summary TEXT NULL,
  PRIMARY KEY (report_id),
  CONSTRAINT fk_analytics_administrator FOREIGN KEY (administrator_id) REFERENCES account (account_id)
);

CREATE TABLE comment (
  comment_id INT NOT NULL AUTO_INCREMENT,
  work_id INT NOT NULL,
  author_id INT NOT NULL,
  body TEXT NOT NULL,
  gif_url VARCHAR(500) NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (comment_id),
  CONSTRAINT fk_comment_work FOREIGN KEY (work_id) REFERENCES creative_work (work_id),
  CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES account (account_id)
);

CREATE TABLE follow (
  follow_id INT NOT NULL AUTO_INCREMENT,
  follower_id INT NOT NULL,
  creator_id INT NOT NULL,
  PRIMARY KEY (follow_id),
  UNIQUE KEY uq_follow_once (follower_id, creator_id),
  CONSTRAINT fk_follow_follower FOREIGN KEY (follower_id) REFERENCES account (account_id),
  CONSTRAINT fk_follow_creator FOREIGN KEY (creator_id) REFERENCES account (account_id)
);

CREATE TABLE saved_work (
  save_id INT NOT NULL AUTO_INCREMENT,
  account_id INT NOT NULL,
  work_id INT NOT NULL,
  saved_at DATETIME NOT NULL,
  PRIMARY KEY (save_id),
  UNIQUE KEY uq_save_once (account_id, work_id),
  CONSTRAINT fk_save_account FOREIGN KEY (account_id) REFERENCES account (account_id),
  CONSTRAINT fk_save_work FOREIGN KEY (work_id) REFERENCES creative_work (work_id)
);

CREATE TABLE help_ticket (
  ticket_id INT NOT NULL AUTO_INCREMENT,
  account_id INT NOT NULL,
  subject VARCHAR(160) NOT NULL,
  body TEXT NOT NULL,
  status ENUM('open', 'resolved', 'set aside', 'escalated') NOT NULL,
  opened_at DATETIME NOT NULL,
  PRIMARY KEY (ticket_id),
  CONSTRAINT fk_ticket_account FOREIGN KEY (account_id) REFERENCES account (account_id)
);

CREATE TABLE category (
  category_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  kind ENUM('media', 'genre', 'tag') NOT NULL,
  PRIMARY KEY (category_id)
);

CREATE TABLE platform_setting (
  setting_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY (setting_id),
  UNIQUE KEY uq_setting_name (name)
);

DELIMITER $$

CREATE TRIGGER trg_work_creator_role
BEFORE INSERT ON creative_work
FOR EACH ROW
BEGIN
  IF (SELECT role FROM account WHERE account_id = NEW.creator_id) <> 'Creator' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'A creative work must belong to a Creator account.';
  END IF;
END$$

CREATE TRIGGER trg_work_creator_role_update
BEFORE UPDATE ON creative_work
FOR EACH ROW
BEGIN
  IF (SELECT role FROM account WHERE account_id = NEW.creator_id) <> 'Creator' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'A creative work must belong to a Creator account.';
  END IF;
END$$

CREATE TRIGGER trg_opportunity_scout_role
BEFORE INSERT ON opportunity
FOR EACH ROW
BEGIN
  IF (SELECT role FROM account WHERE account_id = NEW.scout_id) <> 'Talent Scout' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An opportunity must belong to a Talent Scout account.';
  END IF;
END$$

CREATE TRIGGER trg_feedback_accepted_request
BEFORE INSERT ON mentor_feedback
FOR EACH ROW
BEGIN
  DECLARE req_status VARCHAR(20);
  DECLARE req_work INT;
  DECLARE req_mentor INT;
  DECLARE mentor_role VARCHAR(40);

  SELECT status, work_id, mentor_id
    INTO req_status, req_work, req_mentor
  FROM review_request
  WHERE request_id = NEW.request_id;

  IF req_status IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Feedback must answer a review request.';
  END IF;
  IF req_status <> 'accepted' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Feedback is stored only when the review request is accepted.';
  END IF;
  IF req_work <> NEW.work_id OR req_mentor <> NEW.mentor_id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Feedback must match the work and mentor on the accepted request.';
  END IF;

  SELECT role INTO mentor_role FROM account WHERE account_id = NEW.mentor_id;
  IF mentor_role <> 'Mentor' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Feedback must be written by a Mentor account.';
  END IF;
END$$

CREATE TRIGGER trg_status_change_administrator
BEFORE INSERT ON status_change
FOR EACH ROW
BEGIN
  DECLARE actor_role VARCHAR(40);
  SELECT role INTO actor_role FROM account WHERE account_id = NEW.administrator_id;
  IF actor_role <> 'Administrator' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Only an Administrator can change an account status.';
  END IF;
END$$

CREATE TRIGGER trg_status_change_apply
AFTER INSERT ON status_change
FOR EACH ROW
BEGIN
  UPDATE account
  SET status = NEW.new_status
  WHERE account_id = NEW.account_id;
END$$

DELIMITER ;

CREATE VIEW creator_portfolio AS
SELECT
  a.account_id,
  a.name AS creator_name,
  a.discipline,
  a.open_to_commissions,
  a.status,
  w.work_id,
  w.title,
  w.media_type,
  w.soundcloud_url,
  w.featured,
  w.archived,
  w.published_at
FROM creative_work AS w
JOIN account AS a ON a.account_id = w.creator_id;

CREATE VIEW reported_work AS
SELECT
  w.work_id,
  w.title,
  c.name AS creator_name,
  wr.report_id,
  wr.reason,
  wr.reporter_name,
  wr.reported_at,
  mc.case_id,
  mc.findings,
  mc.action_taken,
  mc.status AS case_status,
  m.name AS moderator_name
FROM work_report AS wr
JOIN creative_work AS w ON w.work_id = wr.work_id
JOIN account AS c ON c.account_id = w.creator_id
JOIN moderation_case AS mc ON mc.report_id = wr.report_id
JOIN account AS m ON m.account_id = mc.moderator_id;
