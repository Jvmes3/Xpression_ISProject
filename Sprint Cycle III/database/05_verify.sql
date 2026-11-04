\set ON_ERROR_STOP on
\pset pager off
SET search_path TO xpression, public;

-- Real PostgreSQL integration checks, including expected constraint failures.
-- Every write below is temporary. Any failed assertion stops psql with a nonzero exit.
BEGIN;
SET CONSTRAINTS ALL IMMEDIATE;
CREATE TEMP TABLE verification_result (
    test_name text PRIMARY KEY,
    result text NOT NULL,
    detail text NOT NULL
) ON COMMIT DROP;

CREATE FUNCTION pg_temp.assert_true(test_name text, passed boolean, detail text DEFAULT '')
RETURNS void LANGUAGE plpgsql AS $function$
BEGIN
    IF passed IS DISTINCT FROM true THEN
        RAISE EXCEPTION 'FAIL: % | %', test_name, detail;
    END IF;
    INSERT INTO verification_result VALUES (test_name, 'PASS', detail);
END;
$function$;

CREATE FUNCTION pg_temp.expect_error(test_name text, command text, expected_state text)
RETURNS void LANGUAGE plpgsql AS $function$
DECLARE failed boolean := false; actual_state text; constraint_detail text;
BEGIN
    -- A PL/pgSQL exception block is a subtransaction. Rejected writes roll back.
    BEGIN
        EXECUTE command;
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS actual_state = RETURNED_SQLSTATE,
                                constraint_detail = CONSTRAINT_NAME;
        IF actual_state <> expected_state THEN
            RAISE EXCEPTION 'FAIL: % expected SQLSTATE %, received %: %',
                test_name, expected_state, actual_state, SQLERRM;
        END IF;
        failed := true;
        INSERT INTO verification_result
        VALUES (test_name, 'PASS', 'Rejected with SQLSTATE ' || actual_state ||
                CASE WHEN constraint_detail <> '' THEN ' (' || constraint_detail || ')' ELSE '' END);
    END;
    IF NOT failed THEN
        RAISE EXCEPTION 'FAIL: % unexpectedly accepted invalid data', test_name;
    END IF;
END;
$function$;

\echo 'VERIFY | Every major table contains meaningful sample rows'
DO $block$
DECLARE t record; row_total bigint; table_total integer := 0;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'xpression' AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        EXECUTE format('SELECT count(*) FROM xpression.%I', t.table_name) INTO row_total;
        PERFORM pg_temp.assert_true('Sample data: ' || t.table_name,
                                  row_total > 0, row_total || ' rows');
        table_total := table_total + 1;
    END LOOP;
    PERFORM pg_temp.assert_true('Complete application structures', table_total = 30,
                              table_total || ' implemented tables');
END;
$block$;

SELECT pg_temp.assert_true('All five system roles represented',
    (SELECT count(DISTINCT role) = 5 FROM account));
SELECT pg_temp.assert_true('All database constraints validated',
    NOT EXISTS (SELECT 1 FROM pg_constraint
                WHERE connamespace = 'xpression'::regnamespace AND NOT convalidated));
SELECT pg_temp.assert_true('Each work report has exactly one case',
    NOT EXISTS (SELECT wr.report_id FROM work_report AS wr
                LEFT JOIN moderation_case AS mc ON mc.report_id = wr.report_id
                GROUP BY wr.report_id HAVING count(mc.case_id) <> 1));
SELECT pg_temp.assert_true('Each comment report has exactly one case',
    NOT EXISTS (SELECT cr.comment_report_id FROM comment_report AS cr
                LEFT JOIN moderation_case AS mc ON mc.comment_report_id = cr.comment_report_id
                GROUP BY cr.comment_report_id HAVING count(mc.case_id) <> 1));
SELECT pg_temp.assert_true('Specialized accounts have matching accepted applications',
    NOT EXISTS (SELECT 1 FROM account AS a
                WHERE a.role IN ('mentor', 'talent_scout') AND NOT EXISTS
                (SELECT 1 FROM role_application AS ra
                 WHERE ra.approved_account_id = a.account_id AND ra.email = a.email
                   AND ra.requested_role = a.role AND ra.status = 'accepted')));

\echo 'VERIFY | Reject invalid identities, ownership, role links, and missing fields'
SELECT pg_temp.expect_error('Unique account email', $sql$
    INSERT INTO account (account_id,name,email,password_hash,role)
    VALUES (900101,'Duplicate Amara','amara.cole@example.org','demo-hash','creator')
$sql$, '23505');
SELECT pg_temp.expect_error('Account name is required', $sql$
    INSERT INTO account (account_id,name,email,password_hash,role)
    VALUES (900101,NULL,'missing.name@example.org','demo-hash','creator')
$sql$, '23502');
SELECT pg_temp.expect_error('One allowed role per account', $sql$
    INSERT INTO account (account_id,name,email,password_hash,role)
    VALUES (900101,'Invalid role','invalid.role@example.org','demo-hash','creator,mentor')
$sql$, '23514');
SELECT pg_temp.expect_error('Specialized account approval is required', $sql$
    INSERT INTO account (account_id,name,email,password_hash,role)
    VALUES (900101,'Unapproved mentor','unapproved@example.org','demo-hash','mentor')
$sql$, '23514');
SELECT pg_temp.expect_error('Specialized approval email must still match', $sql$
    UPDATE role_application SET email = 'different.person@example.org' WHERE application_id = 1
$sql$, '23514');
SELECT pg_temp.expect_error('Work creator must exist', $sql$
    INSERT INTO creative_work (work_id,creator_id,title,media_type,description)
    VALUES (900101,999999,'Orphan work','writing','No account owns this piece.')
$sql$, '23503');
SELECT pg_temp.expect_error('Work owner must have Creator role', $sql$
    INSERT INTO creative_work (work_id,creator_id,title,media_type,description)
    VALUES (900101,7,'Mentor cannot publish as creator','writing','Wrong owner role.')
$sql$, '23503');
SELECT pg_temp.expect_error('Music requires SoundCloud URL', $sql$
    INSERT INTO creative_work (work_id,creator_id,title,media_type,description)
    VALUES (900101,5,'Missing audio','music','A music piece without its required permalink.')
$sql$, '23514');
SELECT pg_temp.expect_error('Media type is restricted', $sql$
    INSERT INTO creative_work (work_id,creator_id,title,media_type,description)
    VALUES (900101,3,'Unsupported medium','video','Not one of the three allowed media types.')
$sql$, '23514');
SELECT pg_temp.expect_error('Requester must own requested work', $sql$
    INSERT INTO review_request (request_id,creator_id,mentor_id,work_id)
    VALUES (900101,3,7,2)
$sql$, '23503');
SELECT pg_temp.expect_error('Review mentor must have Mentor role', $sql$
    INSERT INTO review_request (request_id,creator_id,mentor_id,work_id)
    VALUES (900101,3,9,1)
$sql$, '23503');

\echo 'VERIFY | Structured feedback and reply rules'
SELECT pg_temp.expect_error('Feedback requires an accepted request', $sql$
    INSERT INTO mentor_feedback
        (feedback_id,work_id,mentor_id,request_id,strengths,improvements,recommendation)
    VALUES (900101,2,7,3,'Clear light.','Tight crop.','Try a wider view.')
$sql$, '23514');
INSERT INTO review_request (request_id,creator_id,mentor_id,work_id,status)
VALUES (900200,4,7,2,'accepted');
SELECT pg_temp.expect_error('Feedback work must match accepted request', $sql$
    INSERT INTO mentor_feedback
        (feedback_id,work_id,mentor_id,request_id,strengths,improvements,recommendation)
    VALUES (900101,3,7,900200,'Clear light.','Tight crop.','Try a wider view.')
$sql$, '23503');
SELECT pg_temp.expect_error('Feedback mentor must match accepted request', $sql$
    INSERT INTO mentor_feedback
        (feedback_id,work_id,mentor_id,request_id,strengths,improvements,recommendation)
    VALUES (900101,2,8,900200,'Clear light.','Tight crop.','Try a wider view.')
$sql$, '23503');
SELECT pg_temp.expect_error('Structured feedback fields cannot be blank', $sql$
    INSERT INTO mentor_feedback
        (feedback_id,work_id,mentor_id,request_id,strengths,improvements,recommendation)
    VALUES (900101,2,7,900200,'   ','Tight crop.','Try a wider view.')
$sql$, '23514');
SELECT pg_temp.expect_error('Answered request must remain accepted', $sql$
    UPDATE review_request SET status = 'declined' WHERE request_id = 1
$sql$, '23514');
SELECT pg_temp.expect_error('Only one creator reply per feedback', $sql$
    INSERT INTO feedback_reply (reply_id,feedback_id,creator_id,reply_text)
    VALUES (900101,1,3,'A second reply should be rejected.')
$sql$, '23505');
SELECT pg_temp.expect_error('Reply author must own reviewed work', $sql$
    INSERT INTO feedback_reply (reply_id,feedback_id,creator_id,reply_text)
    VALUES (900101,2,3,'This feedback belongs to another creator.')
$sql$, '23514');

\echo 'VERIFY | Invitations, related data, and one-link-per-pair rules'
SELECT pg_temp.expect_error('One invitation per creator/opportunity pair', $sql$
    INSERT INTO invitation (invitation_id,opportunity_id,creator_id)
    VALUES (900101,1,5)
$sql$, '23505');
SELECT pg_temp.expect_error('Invitation requires a real opportunity', $sql$
    INSERT INTO invitation (invitation_id,opportunity_id,creator_id)
    VALUES (900101,999999,3)
$sql$, '23503');
SELECT pg_temp.expect_error('Invitation response requires timestamp', $sql$
    UPDATE invitation SET status = 'accepted' WHERE invitation_id = 1
$sql$, '23514');
SELECT pg_temp.expect_error('Opportunity end cannot precede start', $sql$
    INSERT INTO opportunity (opportunity_id,scout_id,title,starts_on,ends_on)
    VALUES (900101,9,'Impossible schedule','2026-12-20','2026-12-01')
$sql$, '23514');
SELECT pg_temp.expect_error('Only scouts create opportunities', $sql$
    INSERT INTO opportunity (opportunity_id,scout_id,title,starts_on)
    VALUES (900101,3,'Wrong owner role','2026-12-20')
$sql$, '23503');
SELECT pg_temp.expect_error('One follow per account/creator pair', $sql$
    INSERT INTO follow (follow_id,follower_id,creator_id) VALUES (900101,3,5)
$sql$, '23505');
SELECT pg_temp.expect_error('Creators cannot follow themselves', $sql$
    INSERT INTO follow (follow_id,follower_id,creator_id) VALUES (900101,3,3)
$sql$, '23514');
SELECT pg_temp.expect_error('One save per account/work pair', $sql$
    INSERT INTO saved_work (save_id,account_id,work_id) VALUES (900101,9,3)
$sql$, '23505');
SELECT pg_temp.expect_error('One shortlist entry per scout/creator pair', $sql$
    INSERT INTO scout_candidate (candidate_id,scout_id,creator_id) VALUES (900101,9,5)
$sql$, '23505');
SELECT pg_temp.expect_error('Private message sender must be conversation member', $sql$
    INSERT INTO private_message (message_id,conversation_id,sender_id,body)
    VALUES (900101,1,4,'This account is not a member of this private conversation.')
$sql$, '23503');
SELECT pg_temp.expect_error('Attachment position is unique within work', $sql$
    INSERT INTO work_media (media_id,work_id,asset_url,alt_text,position)
    VALUES (900101,2,'https://example.org/duplicate.jpg','Duplicate first attachment.',1)
$sql$, '23505');

\echo 'VERIFY | Moderation, administrator-only role links, and audit rules'
SELECT pg_temp.expect_error('One moderation case per work report', $sql$
    INSERT INTO moderation_case (case_id,report_id) VALUES (900101,1)
$sql$, '23505');
SELECT pg_temp.expect_error('Moderation case must identify one report', $sql$
    INSERT INTO moderation_case (case_id) VALUES (900101)
$sql$, '23514');
SELECT pg_temp.expect_error('A report cannot lose its moderation case', $sql$
    DELETE FROM moderation_case WHERE report_id = 1
$sql$, '23514');
SELECT pg_temp.expect_error('Closed case must have a moderator', $sql$
    UPDATE moderation_case SET status = 'closed', moderator_id = NULL WHERE report_id = 1
$sql$, '23514');
SELECT pg_temp.expect_error('Moderators cannot record a ban restriction', $sql$
    INSERT INTO account_restriction (restriction_id,user_report_id,moderator_id,action_type)
    VALUES (900101,1,2,'ban')
$sql$, '23514');
SELECT pg_temp.expect_error('Account status cannot bypass audit', $sql$
    UPDATE account SET status = 'banned' WHERE account_id = 6
$sql$, '23514');
SELECT pg_temp.expect_error('Status command requires Administrator role', $sql$
    INSERT INTO status_change (change_id,administrator_id,account_id,new_status)
    VALUES (900101,2,6,'banned')
$sql$, '23503');
SELECT pg_temp.expect_error('Status history is append-only', $sql$
    UPDATE status_change SET reason = 'Attempt to rewrite history' WHERE change_id = 1
$sql$, '23514');
SELECT pg_temp.expect_error('Temporary restriction requires expiry', $sql$
    INSERT INTO account_restriction (restriction_id,user_report_id,moderator_id,action_type)
    VALUES (900101,1,2,'restrict')
$sql$, '23514');
SELECT pg_temp.expect_error('Analytics range must be ordered', $sql$
    INSERT INTO analytics_report (report_id,administrator_id,report_type,date_from,date_to)
    VALUES (900101,1,'accounts','2026-11-03','2026-10-01')
$sql$, '23514');
SELECT pg_temp.expect_error('Platform setting names are unique', $sql$
    INSERT INTO platform_setting (setting_id,name,value) VALUES (900101,'comments_enabled','false')
$sql$, '23505');
SELECT pg_temp.expect_error('Resolved help ticket requires resolution time', $sql$
    INSERT INTO help_ticket (ticket_id,account_id,subject,body,status)
    VALUES (900101,3,'Missing resolution date','A resolved ticket must record when it was resolved.','resolved')
$sql$, '23514');

\echo 'VERIFY | Positive publish, invitation, moderation, and status-change workflows'
INSERT INTO creative_work (work_id,creator_id,title,media_type,description,content_text)
VALUES (900200,3,'Verification poem','writing','A temporary valid portfolio piece.','Temporary poem text.');
UPDATE creative_work SET title = 'Verification poem revised' WHERE work_id = 900200;
SELECT pg_temp.assert_true('Publish and modify preserve one owned work',
    (SELECT count(*) = 1 AND bool_and(creator_id = 3 AND title = 'Verification poem revised')
     FROM creative_work WHERE work_id = 900200));
UPDATE invitation SET status = 'accepted', responded_at = '2026-11-03 12:00:00+00'
WHERE invitation_id = 1;
SELECT pg_temp.assert_true('Invitation acceptance updates the existing link',
    (SELECT status = 'accepted' AND responded_at IS NOT NULL FROM invitation WHERE invitation_id = 1));
INSERT INTO work_report (report_id,work_id,reason,reporter_name)
VALUES (900200,900200,'Temporary report for integration verification.','Verification reviewer');
SELECT pg_temp.assert_true('New report automatically opens exactly one case',
    (SELECT count(*) = 1 FROM moderation_case WHERE report_id = 900200));
UPDATE moderation_case
SET moderator_id = 2, findings = 'Verified hide decision.', action_taken = 'hidden', status = 'closed'
WHERE report_id = 900200;
SELECT pg_temp.assert_true('Closed moderation decision changes work visibility',
    (SELECT visibility = 'hidden' FROM creative_work WHERE work_id = 900200));
SELECT pg_temp.assert_true('Hidden work is absent from public feed',
    NOT EXISTS (SELECT 1 FROM public_work_feed WHERE work_id = 900200));
INSERT INTO status_change (change_id,administrator_id,account_id,new_status,reason)
VALUES (900200,1,6,'active','Temporary verification of atomic status and audit update.');
SELECT pg_temp.assert_true('Administrator status command changes account and captures prior status',
    (SELECT a.status = 'active' AND sc.old_status = 'suspended' AND sc.new_status = 'active'
     FROM account AS a JOIN status_change AS sc ON sc.account_id = a.account_id
     WHERE a.account_id = 6 AND sc.change_id = 900200));
SET CONSTRAINTS ALL IMMEDIATE;

SELECT test_name, result, detail FROM verification_result ORDER BY test_name;
SELECT count(*) AS checks_passed, bool_and(result = 'PASS') AS all_passed
FROM verification_result;
ROLLBACK;
\echo 'Verification complete. Test writes rolled back; sample data is preserved.'
