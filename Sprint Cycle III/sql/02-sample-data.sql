-- Meaningful sample rows for every table in the data dictionary.
-- Names and pieces are the ones already used on the role screens.

USE xpression;

INSERT INTO account (account_id, name, email, role, status, discipline, open_to_commissions) VALUES
  (1, 'Amara Cole', 'amara.cole@xpression.example', 'Creator', 'active', 'Poetry', TRUE),
  (2, 'Luis Ortega', 'luis.ortega@xpression.example', 'Creator', 'active', 'Painting', TRUE),
  (3, 'Nia Brooks', 'nia.brooks@xpression.example', 'Creator', 'active', 'Songwriting', TRUE),
  (4, 'Jordan Lee', 'jordan.lee@xpression.example', 'Creator', 'active', 'Essays', FALSE),
  (5, 'Elena Voss', 'elena.voss@xpression.example', 'Mentor', 'active', NULL, FALSE),
  (6, 'Marcus Hale', 'marcus.hale@xpression.example', 'Talent Scout', 'active', NULL, FALSE),
  (7, 'Priya Shah', 'priya.shah@xpression.example', 'Moderator', 'active', NULL, FALSE),
  (8, 'Ada Lowe', 'ada.lowe@xpression.example', 'Administrator', 'active', NULL, FALSE);

INSERT INTO creative_work (
  work_id, creator_id, title, media_type, description, soundcloud_url, featured, archived, published_at
) VALUES
  (1, 1, 'Night bus', 'Writing',
    'A poem about the last city bus and the people who stay on until the depot.',
    NULL, FALSE, FALSE, '2026-09-12 18:40:00'),
  (2, 1, 'Last light on the platform', 'Writing',
    'A short essay about waiting on a train platform after the announcement board goes dark.',
    NULL, FALSE, FALSE, '2026-10-02 09:30:00'),
  (3, 2, 'Studio wall study', 'Visual art',
    'A painting of the studio wall after a week of leftover marks and taped sketches.',
    NULL, FALSE, FALSE, '2026-09-18 14:15:00'),
  (4, 3, 'Harbor demo', 'Music',
    'A short demo recorded above the harbor, with the chorus arriving late on purpose.',
    'https://soundcloud.com/nia-brooks/harbor-demo',
    TRUE, FALSE, '2026-09-20 21:05:00'),
  (5, 4, 'Unsent letter', 'Writing',
    'A page Jordan posted and then left up after several people asked the messages to stop.',
    NULL, FALSE, FALSE, '2026-10-08 11:20:00');

INSERT INTO review_request (
  request_id, creator_id, mentor_id, work_id, note, status, requested_at
) VALUES
  (1, 2, 5, 3, 'Is the crop too tight for the wall study?', 'accepted', '2026-09-19 10:00:00'),
  (2, 3, 5, 4, 'Does the chorus arrive too late?', 'waiting', '2026-09-21 16:45:00'),
  (3, 1, 5, 1, 'Does the last stanza explain too much?', 'declined', '2026-09-14 12:10:00');

INSERT INTO mentor_feedback (
  feedback_id, work_id, mentor_id, request_id, strengths, improvements, recommendation, written_at
) VALUES
  (1, 3, 5, 1,
    'The taped sketches give the wall a history the viewer can follow.',
    'The crop cuts off the left edge, so the blue mark feels accidental.',
    'Leave more of the left wall in the next version and keep the tape marks.',
    '2026-09-22 15:30:00');

INSERT INTO feedback_reply (reply_id, feedback_id, reply_text, replied_at) VALUES
  (1, 1, 'I will reopen the crop and keep the tape marks in the frame.', '2026-09-23 09:05:00');

INSERT INTO nomination (
  nomination_id, mentor_id, work_id, moderator_id, reason, status, nominated_at, decided_at
) VALUES
  (1, 5, 4, NULL,
    'The harbor recording is the clearest finished demo on the platform this month.',
    'pending', '2026-09-25 13:00:00', NULL),
  (2, 5, 1, 7,
    'Night bus is a complete piece and the kind of writing the featured feed should show.',
    'approved', '2026-09-16 11:00:00', '2026-09-17 17:20:00');

INSERT INTO scout_message (message_id, scout_id, creator_id, body, sent_at) VALUES
  (1, 6, 1,
    'I program a winter reading, and your platform essays fit the night. Are you open to a short set?',
    '2026-10-04 10:15:00');

INSERT INTO opportunity (opportunity_id, scout_id, title, starts_on, ends_on, description) VALUES
  (1, 6, 'Riverfront mural call', '2026-11-15', '2026-12-01',
    'A paid mural on the riverfront wall. The brief asks for a study, not a finished mockup.'),
  (2, 6, 'Winter listening night', '2026-12-10', NULL,
    'A small room for three songs and one short reading.');

INSERT INTO invitation (invitation_id, opportunity_id, creator_id, status, invited_at) VALUES
  (1, 1, 2, 'sent', '2026-10-11 09:00:00'),
  (2, 2, 3, 'sent', '2026-10-11 09:20:00'),
  (3, 2, 1, 'accepted', '2026-10-12 18:00:00');

INSERT INTO work_report (report_id, work_id, reason, reporter_name, reported_at) VALUES
  (1, 3, 'The post reads like an advertisement for a studio class and does not show the painting.',
    'Sam Okonkwo', '2026-09-19 19:40:00'),
  (2, 3, 'The caption tells people to enroll in a paid weekend workshop.',
    'Renee Alvarez', '2026-09-19 20:05:00');

INSERT INTO moderation_case (
  case_id, report_id, moderator_id, findings, action_taken, status, recorded_at
) VALUES
  (1, 1, 7,
    'The image is a studio study. It is not selling a class.',
    'kept available', 'closed', '2026-09-20 11:10:00'),
  (2, 2, 7,
    'The caption describes the painting. It does not sell a workshop.',
    'kept available', 'closed', '2026-09-20 11:25:00');

INSERT INTO user_report (user_report_id, account_id, reason, reported_at) VALUES
  (1, 4, 'Several creators reported repeated messages after they asked the conversation to stop.',
    '2026-10-09 20:10:00');

INSERT INTO account_restriction (restriction_id, user_report_id, moderator_id, action_type, recorded_at) VALUES
  (1, 1, 7, 'refer for ban', '2026-10-10 09:40:00');

INSERT INTO status_change (change_id, administrator_id, account_id, new_status, changed_at) VALUES
  (1, 8, 4, 'suspended', '2026-10-10 15:00:00');

INSERT INTO role_application (
  application_id, administrator_id, applicant_name, email, requested_role, statement, status, submitted_at, decided_at
) VALUES
  (1, NULL, 'Maya Chen', 'maya.chen@xpression.example', 'Mentor',
    'I have led campus critique groups for two years and I want to review visual work.',
    'pending', '2026-10-18 14:00:00', NULL),
  (2, 8, 'Elena Voss', 'elena.voss@xpression.example', 'Mentor',
    'I review poems and paintings and I can return notes within a week.',
    'accepted', '2026-09-01 10:00:00', '2026-09-02 16:30:00');

INSERT INTO analytics_report (
  report_id, administrator_id, report_type, date_from, date_to, generated_at, result_summary
) VALUES
  (1, 8, 'platform usage', '2026-09-01', '2026-09-30', '2026-10-01 08:00:00',
    'September had 5 published pieces, 3 review requests, and 2 work reports.');

INSERT INTO comment (comment_id, work_id, author_id, body, gif_url, created_at) VALUES
  (1, 1, 2, 'The last stanza could end one line earlier. The bus image is already doing the work.',
    NULL, '2026-09-13 08:12:00'),
  (2, 4, 1, 'The late chorus fits the harbor. I kept hearing the room tone under the vocal.',
    'https://giphy.com/gifs/harbor-lights', '2026-09-21 22:18:00');

INSERT INTO follow (follow_id, follower_id, creator_id) VALUES
  (1, 2, 1),
  (2, 6, 3),
  (3, 1, 3);

INSERT INTO saved_work (save_id, account_id, work_id, saved_at) VALUES
  (1, 6, 4, '2026-10-05 11:00:00'),
  (2, 5, 1, '2026-09-15 13:40:00');

INSERT INTO help_ticket (ticket_id, account_id, subject, body, status, opened_at) VALUES
  (1, 1, 'How do I archive a piece without deleting the feedback?',
    'Night bus should leave the portfolio, but I still want the notes if I request a review later.',
    'open', '2026-10-06 16:22:00');

INSERT INTO category (category_id, name, kind) VALUES
  (1, 'Poetry', 'genre'),
  (2, 'Painting', 'genre'),
  (3, 'Songwriting', 'genre'),
  (4, 'Studio process', 'tag');

INSERT INTO platform_setting (setting_id, name, value) VALUES
  (1, 'comments', 'open'),
  (2, 'gifs', 'allowed'),
  (3, 'upload note', 'Writing, images, and music uploads follow the limit written here.');

ALTER TABLE account AUTO_INCREMENT = 9;
ALTER TABLE creative_work AUTO_INCREMENT = 6;
ALTER TABLE review_request AUTO_INCREMENT = 4;
ALTER TABLE mentor_feedback AUTO_INCREMENT = 2;
ALTER TABLE feedback_reply AUTO_INCREMENT = 2;
ALTER TABLE nomination AUTO_INCREMENT = 3;
ALTER TABLE scout_message AUTO_INCREMENT = 2;
ALTER TABLE opportunity AUTO_INCREMENT = 3;
ALTER TABLE invitation AUTO_INCREMENT = 4;
ALTER TABLE work_report AUTO_INCREMENT = 3;
ALTER TABLE moderation_case AUTO_INCREMENT = 3;
ALTER TABLE user_report AUTO_INCREMENT = 2;
ALTER TABLE account_restriction AUTO_INCREMENT = 2;
ALTER TABLE status_change AUTO_INCREMENT = 2;
ALTER TABLE role_application AUTO_INCREMENT = 3;
ALTER TABLE analytics_report AUTO_INCREMENT = 2;
ALTER TABLE comment AUTO_INCREMENT = 3;
ALTER TABLE follow AUTO_INCREMENT = 4;
ALTER TABLE saved_work AUTO_INCREMENT = 3;
ALTER TABLE help_ticket AUTO_INCREMENT = 2;
ALTER TABLE category AUTO_INCREMENT = 5;
ALTER TABLE platform_setting AUTO_INCREMENT = 4;
