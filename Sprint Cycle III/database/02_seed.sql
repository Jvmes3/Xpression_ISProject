\set ON_ERROR_STOP on
SET search_path TO xpression, public;

-- Load after 01_schema.sql in ONE transaction:
-- psql --single-transaction -f 01_schema.sql -f 02_seed.sql
-- Fixed IDs make the presentation queries readable. Run only on an empty schema.
-- All people, addresses, external asset URLs, and opportunities below are fixtures.
-- The scrypt string is a precomputed demonstration hash, never a real user's password.
-- This database sprint does not connect these fixtures to the Sprint I file-based login.

INSERT INTO account
    (account_id, name, email, password_hash, role, status, discipline,
     open_to_commissions, bio, created_at)
SELECT id, name, email,
       'scrypt$xpression-sprint-iii-demo$23a01113e930eeda51f9aa95f986e0b19d018c1ab6a28f5cdf19e3cf8f14be94',
       role, 'active', discipline, commissions, bio, '2026-10-01 12:00:00+00'::timestamptz
FROM (VALUES
    (1, 'Avery Morgan', 'avery.morgan@example.org', 'administrator', NULL, false,
     'Coordinates account approvals and platform reporting.'),
    (2, 'Simone Reed', 'simone.reed@example.org', 'moderator', NULL, false,
     'Reviews community reports and featured-work nominations.'),
    (3, 'Amara Cole', 'amara.cole@example.org', 'creator', 'Writing', true,
     'Writes poems and short essays about night travel.'),
    (4, 'Luis Ortega', 'luis.ortega@example.org', 'creator', 'Visual art', true,
     'Makes studies of studio walls, light, and leftover paint.'),
    (5, 'Nia Brooks', 'nia.brooks@example.org', 'creator', 'Music', true,
     'Records indie soul songs and acoustic waterfront demos.'),
    (6, 'Jordan Lee', 'jordan.lee@example.org', 'creator', 'Writing', false,
     'Experiments with short fiction and promotional copy.'),
    (7, 'Maya Chen', 'maya.chen@example.org', 'mentor', 'Writing', false,
     'Poetry editor offering structured feedback on imagery and pacing.'),
    (8, 'Theo Grant', 'theo.grant@example.org', 'mentor', 'Music', false,
     'Producer helping emerging songwriters develop arrangements.'),
    (9, 'Elena Park', 'elena.park@example.org', 'talent_scout', 'Music', false,
     'Books emerging performers for community arts events.'),
    (10, 'Marcus Bell', 'marcus.bell@example.org', 'talent_scout', 'Visual art', false,
     'Commissions local illustrators and exhibition work.')
) AS fixture(id, name, email, role, discipline, commissions, bio);

-- Specialized accounts require accepted applications by the end of this transaction.
INSERT INTO role_application
    (application_id, administrator_id, approved_account_id, applicant_name, email,
     requested_role, statement, status, submitted_at, decided_at)
VALUES
    (1, 1, 7, 'Maya Chen', 'maya.chen@example.org', 'mentor',
     'I have edited a community poetry journal for six years and will provide specific revision advice.',
     'accepted', '2026-09-25 09:00:00+00', '2026-10-01 10:00:00+00'),
    (2, 1, 8, 'Theo Grant', 'theo.grant@example.org', 'mentor',
     'I produce independent recordings and want to mentor songwriters on structure and arrangement.',
     'accepted', '2026-09-25 10:00:00+00', '2026-10-01 10:10:00+00'),
    (3, 1, 9, 'Elena Park', 'elena.park@example.org', 'talent_scout',
     'I coordinate paid local performances and will invite creators through clear project briefs.',
     'accepted', '2026-09-26 09:00:00+00', '2026-10-01 10:20:00+00'),
    (4, 1, 10, 'Marcus Bell', 'marcus.bell@example.org', 'talent_scout',
     'I commission illustrations for neighborhood exhibitions and public arts projects.',
     'accepted', '2026-09-26 10:00:00+00', '2026-10-01 10:30:00+00'),
    (5, NULL, NULL, 'Priya Shah', 'priya.shah@example.org', 'mentor',
     'I teach drawing workshops and would like to review visual-art portfolios.',
     'pending', '2026-11-02 09:00:00+00', NULL),
    (6, 1, NULL, 'Owen Ellis', 'owen.ellis@example.org', 'talent_scout',
     'I would like to contact creators for a proposed festival that is still seeking funding.',
     'rejected', '2026-10-25 09:00:00+00', '2026-10-28 11:00:00+00');

INSERT INTO creative_work
    (work_id, creator_id, title, media_type, description, content_text,
     soundcloud_url, featured, archived, published_at)
VALUES
    (1, 3, 'Night bus', 'writing', 'A poem about the people who share the final ride home.',
     'At the last stop, the windows hold the city like a second sky.',
     NULL, true, false, '2026-10-15 18:00:00+00'),
    (2, 4, 'Studio wall study', 'visual_art', 'A study of afternoon light crossing a paint-marked studio wall.',
     NULL, NULL, false, false, '2026-10-18 15:00:00+00'),
    (3, 5, 'Harbor demo', 'music', 'An acoustic indie soul demo recorded beside the harbor.',
     NULL, 'https://soundcloud.com/xpression-demo/harbor-demo',
     false, false, '2026-10-20 17:00:00+00'),
    (4, 3, 'After the last train', 'writing', 'A short essay about the walk home when the station closes.',
     'The timetable ends before the night does; we find our own route home.',
     NULL, false, false, '2026-10-27 20:00:00+00'),
    (5, 4, 'Windowlight series', 'visual_art', 'Three illustrations tracing the same window through a changing day.',
     NULL, NULL, false, false, '2026-10-28 16:00:00+00'),
    (6, 5, 'Low tide session', 'music', 'A live rehearsal with a shorter introduction and a layered chorus.',
     NULL, 'https://soundcloud.com/xpression-demo/low-tide-session',
     false, false, '2026-11-01 18:00:00+00'),
    (7, 6, 'Midnight messages', 'writing', 'An experimental text post submitted to the community feed.',
     'Repeated unsolicited promotional messages were included in the original submission.',
     NULL, false, false, '2026-11-02 21:00:00+00');

INSERT INTO work_media (media_id, work_id, asset_url, alt_text, position) VALUES
    (1, 2, 'https://example.org/xpression/studio-wall-study.jpg',
     'Warm afternoon light on a textured studio wall.', 1),
    (2, 5, 'https://example.org/xpression/windowlight-morning.jpg',
     'Blue morning light through an illustrated window.', 1),
    (3, 5, 'https://example.org/xpression/windowlight-evening.jpg',
     'Orange evening light through the same illustrated window.', 2);

INSERT INTO category (category_id, name, kind) VALUES
    (1, 'Writing', 'media'), (2, 'Visual art', 'media'), (3, 'Music', 'media'),
    (4, 'Poetry', 'genre'), (5, 'Indie soul', 'genre'), (6, 'Waterfront', 'tag');
INSERT INTO work_category (work_id, category_id) VALUES
    (1, 1), (1, 4), (2, 2), (3, 3), (3, 5), (3, 6),
    (4, 1), (4, 4), (5, 2), (6, 3), (6, 6), (7, 1);

INSERT INTO review_request
    (request_id, creator_id, mentor_id, work_id, note, status, requested_at)
VALUES
    (1, 3, 7, 1, 'Does the ending connect clearly to the opening image?',
     'accepted', '2026-10-16 09:00:00+00'),
    (2, 5, 8, 3, 'Does the chorus arrive too late in this arrangement?',
     'accepted', '2026-10-21 09:00:00+00'),
    (3, 4, 7, 2, 'Could you comment on the story suggested by the light and crop?',
     'waiting', '2026-11-02 09:00:00+00'),
    (4, 5, 8, 6, 'Would you review this live revision before Friday?',
     'declined', '2026-11-02 10:00:00+00');

INSERT INTO mentor_feedback
    (feedback_id, work_id, mentor_id, request_id, strengths, improvements,
     recommendation, written_at)
VALUES
    (1, 1, 7, 1, 'The bus-window image gives the poem a clear sense of place.',
     'The middle stanza repeats the same feeling without adding a new detail.',
     'Replace one abstract line with a detail from another passenger.', '2026-10-18 14:00:00+00'),
    (2, 3, 8, 2, 'The vocal melody and acoustic texture are memorable.',
     'The extended introduction delays the strongest hook.',
     'Try an eight-bar introduction and compare both versions with listeners.', '2026-10-23 14:00:00+00');

INSERT INTO feedback_reply (reply_id, feedback_id, creator_id, reply_text, replied_at)
VALUES
    (1, 1, 3, 'I replaced the abstract line with the passenger folding a paper map. Thank you.',
     '2026-10-19 12:00:00+00');

INSERT INTO nomination
    (nomination_id, mentor_id, work_id, moderator_id, reason, status, nominated_at, decided_at)
VALUES
    (1, 8, 3, NULL, 'A strong melody and a focused voice make this a promising emerging-artist feature.',
     'pending', '2026-10-24 09:00:00+00', NULL),
    (2, 7, 1, 2, 'The revised imagery creates an accessible and distinctive poem for the featured feed.',
     'approved', '2026-10-20 09:00:00+00', '2026-10-21 12:00:00+00');

INSERT INTO scout_message (message_id, scout_id, creator_id, body, sent_at) VALUES
    (1, 9, 5, 'Your Harbor demo would suit our waterfront showcase. Are you available in December?',
     '2026-10-25 13:00:00+00'),
    (2, 10, 4, 'The Windowlight series matches the theme of our neighborhood arts commission.',
     '2026-10-29 13:00:00+00');

INSERT INTO opportunity (opportunity_id, scout_id, title, starts_on, ends_on, description) VALUES
    (1, 9, 'Waterfront winter showcase', '2026-12-05', '2026-12-05',
     'A paid twenty-minute acoustic set for the community arts evening.'),
    (2, 10, 'Neighborhood light illustration commission', '2026-12-01', '2026-12-20',
     'Create three illustrations for a neighborhood arts exhibition.'),
    (3, 9, 'Night stories listening room', '2026-12-12', '2026-12-12',
     'An evening combining spoken-word poetry and acoustic music.');

INSERT INTO invitation (invitation_id, opportunity_id, creator_id, status, invited_at, responded_at) VALUES
    (1, 1, 5, 'sent', '2026-10-26 13:00:00+00', NULL),
    (2, 2, 4, 'accepted', '2026-10-30 13:00:00+00', '2026-10-31 10:00:00+00'),
    (3, 3, 3, 'accepted', '2026-11-01 13:00:00+00', '2026-11-01 16:00:00+00'),
    (4, 3, 5, 'declined', '2026-11-01 13:05:00+00', '2026-11-02 08:00:00+00');

-- Each report opens exactly one case through the database trigger.
INSERT INTO work_report (report_id, work_id, reason, reporter_name, reported_at) VALUES
    (1, 2, 'The caption may contain an unrelated advertisement; please review its context.',
     'Amara Cole', '2026-11-02 14:00:00+00'),
    (2, 7, 'This submission repeats unsolicited promotional messages rather than presenting original work.',
     'Luis Ortega', '2026-11-02 22:00:00+00');
UPDATE moderation_case
SET moderator_id = 2, findings = 'Checking the original image and caption before making a decision.',
    status = 'in_review'
WHERE report_id = 1;
UPDATE moderation_case
SET moderator_id = 2, findings = 'The submission is repeated promotional spam; hide it from the public feed.',
    action_taken = 'hidden', status = 'closed'
WHERE report_id = 2;

INSERT INTO user_report (user_report_id, account_id, reason, reported_at) VALUES
    (1, 6, 'Repeated unsolicited messages continued after creators asked for contact to stop.',
     '2026-11-02 22:10:00+00');
INSERT INTO account_restriction
    (restriction_id, user_report_id, moderator_id, action_type, recorded_at, expires_at, notes)
VALUES (1, 1, 2, 'restrict', '2026-11-03 09:00:00+00', '2026-11-10 09:00:00+00',
        'Temporarily restrict unsolicited contact; administrator separately reviewed account suspension.');
-- The status-change command records the administrator and updates account.status atomically.
INSERT INTO status_change (change_id, administrator_id, account_id, new_status, changed_at)
VALUES (1, 1, 6, 'suspended', '2026-11-03 09:15:00+00');

INSERT INTO analytics_report
    (report_id, administrator_id, report_type, date_from, date_to, generated_at, result_summary)
VALUES
    (1, 1, 'creative_posts', '2026-10-01', '2026-11-03', '2026-11-03 10:00:00+00',
     '7 creative works: 3 writing, 2 visual art, 2 music. One work hidden after moderation.'),
    (2, 1, 'accounts', '2026-10-01', '2026-11-03', '2026-11-03 10:05:00+00',
     '10 accounts across 5 roles: 9 active and 1 suspended.');

INSERT INTO comment (comment_id, work_id, author_id, body, gif_url, created_at) VALUES
    (1, 1, 5, 'The image of the city in the bus window stayed with me.', NULL, '2026-10-16 13:00:00+00'),
    (2, 1, 4, 'The final line feels like the moment the bus turns toward home.',
     'https://example.org/xpression/night-bus-reaction.gif', '2026-10-17 13:00:00+00'),
    (3, 3, 6, 'Buy my unrelated newsletter instead of listening to this track.', NULL, '2026-11-01 15:00:00+00'),
    (4, 3, 3, 'The acoustic arrangement leaves room for the vocal. I would love to hear it live.',
     NULL, '2026-10-22 13:00:00+00');
INSERT INTO comment_report (comment_report_id, comment_id, reporter_id, reason, reported_at)
VALUES (1, 3, 3, 'The reply is promotional spam unrelated to the song.', '2026-11-01 16:00:00+00');

INSERT INTO follow (follow_id, follower_id, creator_id) VALUES
    (1, 3, 5), (2, 4, 3), (3, 5, 4), (4, 7, 3);
INSERT INTO saved_work (save_id, account_id, work_id, saved_at) VALUES
    (1, 3, 3, '2026-10-22 14:00:00+00'),
    (2, 9, 3, '2026-10-25 14:00:00+00'),
    (3, 10, 5, '2026-10-29 14:00:00+00');
INSERT INTO scout_candidate (candidate_id, scout_id, creator_id, notes, saved_at) VALUES
    (1, 9, 5, 'Strong fit for small acoustic venues; awaiting showcase response.', '2026-10-25 14:05:00+00'),
    (2, 10, 4, 'Windowlight palette fits the neighborhood exhibition brief.', '2026-10-29 14:05:00+00');

INSERT INTO help_ticket
    (ticket_id, account_id, subject, body, status, opened_at, assigned_to, response, resolved_at) VALUES
    (1, 5, 'SoundCloud preview is missing', 'My permalink opens, but I need help checking the preview configuration.',
     'open', '2026-11-02 12:00:00+00', 2, NULL, NULL),
    (2, 4, 'Correct image order', 'The window illustrations should show morning before evening.',
     'resolved', '2026-10-29 12:00:00+00', 2,
     'Updated the attachment positions so morning is first and evening is second.', '2026-10-30 10:00:00+00');
INSERT INTO platform_setting (setting_id, name, value) VALUES
    (1, 'comments_enabled', 'true'), (2, 'gifs_enabled', 'true'),
    (3, 'upload_note', 'Publish writing, visual art, or a SoundCloud music permalink.'),
    (4, 'moderation_rule', 'Feedback must address the work. Harassment, threats, and spam may be hidden.');

INSERT INTO notification
    (notification_id, account_id, kind, body, work_id, read_at, created_at)
VALUES
    (1, 3, 'feedback', 'Maya Chen added structured feedback to Night bus.', 1,
     '2026-10-19 11:00:00+00', '2026-10-18 14:00:00+00'),
    (2, 5, 'invitation', 'Elena Park invited you to Waterfront winter showcase.', NULL,
     NULL, '2026-10-26 13:00:00+00'),
    (3, 2, 'moderation', 'A new work report needs review: Studio wall study.', 2,
     NULL, '2026-11-02 14:00:00+00');

INSERT INTO conversation (conversation_id, subject, created_by, created_at) VALUES
    (1, 'Waterfront showcase scheduling', 9, '2026-10-27 13:00:00+00'),
    (2, 'Night bus revision follow-up', 7, '2026-10-20 13:00:00+00');
INSERT INTO conversation_member (conversation_id, account_id, joined_at, last_read_at) VALUES
    (1, 9, '2026-10-27 13:00:00+00', '2026-10-27 15:00:00+00'),
    (1, 5, '2026-10-27 13:00:00+00', '2026-10-27 14:00:00+00'),
    (2, 7, '2026-10-20 13:00:00+00', '2026-10-20 15:00:00+00'),
    (2, 3, '2026-10-20 13:00:00+00', '2026-10-20 14:00:00+00');
INSERT INTO private_message (message_id, conversation_id, sender_id, body, sent_at) VALUES
    (1, 1, 9, 'The paid set is twenty minutes. Would an early evening slot suit your schedule?', '2026-10-27 13:05:00+00'),
    (2, 1, 5, 'Yes, an early evening slot works. I am confirming transport before accepting.', '2026-10-27 14:00:00+00'),
    (3, 2, 7, 'The new paper-map image makes the middle stanza much more concrete.', '2026-10-20 13:05:00+00'),
    (4, 2, 3, 'Thank you. I will read the revision aloud at the next workshop.', '2026-10-20 14:00:00+00');

-- Explicit fixture IDs must leave the identity sequences ready for normal INSERTs.
DO $$
DECLARE sequence_row record;
BEGIN
    FOR sequence_row IN
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'xpression' AND is_identity = 'YES'
    LOOP
        EXECUTE format(
            'SELECT setval(pg_get_serial_sequence(%L, %L), coalesce(max(%I), 1), count(*) > 0) FROM %I.%I',
            'xpression.' || quote_ident(sequence_row.table_name), sequence_row.column_name,
            sequence_row.column_name, 'xpression', sequence_row.table_name);
    END LOOP;
END $$;

-- Force deferred approval and exact-one-case rules before setup reports success.
SET CONSTRAINTS ALL IMMEDIATE;

\echo 'Loaded meaningful sample data across every application table.'
