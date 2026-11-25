# Meeting notes — Sprint Cycle V

Scrum Master: Clemenceau Senatus

These notes are the two meetings for this sprint. Attendees listed for each meeting are the four team members.

## Nov 18, 2026 — Sprint planning

| Field | Value |
| --- | --- |
| Sprint | Cycle V — adding and modifying data |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Purpose | Choose the five database writes and keep the Cycle IV screens |

### Agenda

1. Choose a Scrum Master
2. Match each assigned use case to a table
3. Decide which Cycle IV screens stay as they are
4. Plan the demonstration video

### Decisions

1. **Scrum Master:** Clemenceau Senatus.
2. **The site stays in `Sprint Cycle V`.** It continues the Cycle IV screens and the MySQL database named `xpression`.
3. **Five writes, one for each role.** An administrator inserts a row in `status_change`, which updates `account`. A creator inserts `creative_work`. A mentor inserts `mentor_feedback`. A talent scout inserts `opportunity`. A moderator updates `moderation_case`.
4. **The rest of the menu stays visible.** Those choices say they are not completed in this sprint.
5. **The video is a recording of the running site,** due November 24. It is stored in `Demonstration` or linked from `Demonstration/VIDEO.md`.

### Action items

| Owner | Action | Status |
| --- | --- | --- |
| Clemenceau Senatus | Scrum Master, creator publish | Done in `app/creator/desk/publish` |
| Jacob Fitchett | Administrator activate and deactivate | Done in `app/administrator/desk` |
| James Henson | Mentor feedback and talent scout opportunity | Done in `app/mentor/desk` and `app/scout/desk` |
| Leeyand Blot Jr | Moderator decision on a reported piece | Done in `app/moderator/desk` |

## Nov 24, 2026 — Write check

| Field | Value |
| --- | --- |
| Sprint | Cycle V — adding and modifying data |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Purpose | Confirm each role works properly using MySQL data, new data, and that Cycle IV retrievals still open |

### Agenda

1. Sign in as each role and run that role's use cases
2. Demonstrate invalid or incomplete-data case when appropriate
3. Read the changed rows back from MySQL, use those as default data when appropriate
4. Open the Cycle IV feed, creator search, and reported-work list again

### Decisions

1. **Account status is shown before and after the click.** Activating or deactivating your own administrator account is refused. Choosing the status the account already has is refused.
2. **A published piece uses the signed-in creator's database row.** Music with no sample link is refused.
3. **Mentor feedback needs all three fields.** The saved note is listed under the form.
4. **An opportunity needs a title and a start date.** An end date before the start date is refused.
5. **A moderation decision needs findings.** Hiding or removing a piece takes it off the feed. Keeping it available puts it back.
6. **The Cycle IV searches still read the same tables.** New pieces show on the feed. Changed account status shows on the administrator list.
