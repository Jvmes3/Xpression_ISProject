# Meeting notes — Sprint Cycle IV

Scrum Master: Leeyand Blot

These notes are the two meetings for this sprint. Attendees listed for each meeting are the four team members.

## Nov 6, 2026 — Sprint planning

| Field | Value |
| --- | --- |
| Sprint | Cycle IV — sign-in and retrieval |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Purpose | Decide how sign-in uses the Cycle III database |

### Agenda

1. Choose a Scrum Master
2. Choose which existing website work to keep
3. Assign the five retrieval screens
4. Decide where passwords live

### Decisions

1. **Scrum Master:** Leeyand Blot.
2. **The application reads MySQL `xpression`.** The local account file in `Website implementation sprint cycle` stays there. Sprint Cycle IV does not sign in through that file.
3. **The visual language stays.** Paper background, serif titles, and the dark header come from the earlier site.
4. **Passwords are a column on `account`.** `sql/01-auth.sql` adds `password_hash` after the Cycle III scripts. The sample password is `Xpression1!`.
5. **One working retrieval for each role.** Administrator lists users. Creator browses the community feed. Mentor browses work available for review. Talent Scout searches creators and opens a portfolio. Moderator reads reported creative work.
6. **The other navigation items stay visible** and are marked for a later sprint. A direct address for another role is refused.

### Action items

| Owner | Action | Status |
| --- | --- | --- |
| Leeyand Blot | Scrum Master | |
| James Henson | Sign-in and the session cookie | Done in `app/sign-in` and `app/lib/session.ts` |
| Jacob Fitchett | Administrator users and Creator feed | Done in `app/administrator` and `app/creator` |
| Clemenceau Senatus | Mentor review, Talent Scout search, and the presentation order | Done in `app/mentor`, `app/scout`, and `Presentation` |
| Leeyand Blot Jr | Moderator reports and the authorization check | Done in `app/moderator` and `app/lib/guard.ts` |

## Nov 13, 2026 — Retrieval check

| Field | Value |
| --- | --- |
| Sprint | Cycle IV — sign-in and retrieval |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Purpose | Check each role against the sample rows |

### Agenda

1. Sign in as each of the five roles
2. Confirm each search returns the sample people and pieces
3. Confirm a bad password and a suspended account are refused

### Decisions

1. **Ada lists the accounts.** The user search reads `account`.
2. **Amara's feed includes the community, not only her own pieces.** Night bus, Studio wall study, and Harbor demo can all appear.
3. **Elena browses published pieces** that are not archived.
4. **Marcus opens a creator, then that creator's pieces.** Amara's portfolio shows Night bus and Last light on the platform.
5. **Priya reads `reported_work`.** Studio wall study has two reports, both kept available.
6. **Jordan cannot sign in.** His status is suspended. A wrong password on an active account is a different message.

### Action items

| Owner | Action | Status |
| --- | --- | --- |
| All | Pull the repository and run the application from `Sprint Cycle IV` | Not yet |
| All | Each member commits one meaningful part of this sprint from their own GitHub account | Not yet |
