# Meeting notes — Sprint Cycle II

Scrum Master: Jacob Fitchett

The notes below are the sprint decision log. Attendees listed for each meeting are the four team members.

## Oct 17, 2026 — Sprint planning

| Field | Value |
| --- | --- |
| Sprint | Cycle II — database design |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Location / format | Library / in person |
| Purpose | Decide how the database design will follow the three use cases on each role page |

### Agenda

1. Confirm Cycle II is design only
2. Choose a Scrum Master
3. Decide how the ERD will be drawn
4. Split the diagrams, the data dictionary, and the business rules

### Decisions

1. **Scrum Master:** Jacob Fitchett.
2. **No implementation this sprint.** No tables, Firebase collections, MongoDB collections, or application database code. Implementation stays in Sprint Cycle III.
3. **Chen notation.** A rectangle is an entity, a diamond is a relationship, and an oval is an attribute. Primary keys are underlined. Foreign keys are italic. Cardinality is 1 or N. Lines connect the attributes to their entities and the entities to their relationships.
4. **One diagram per role**, saved as a PNG. The five roles are not drawn connected to one account in the middle.
5. **Three use cases per role**:
   - Creator: Publish work; My portfolio; Feedback on my work
   - Mentor: Review requests; Structured feedback; Nominate featured work
   - Talent Scout: Search creators; Contact a creator; Invite to an opportunity
   - Moderator: Reported creative work; Featured nominations; Reported users
   - Administrator: Manage users; Approve specialized accounts; Analytics and reports

### Action items

| Owner | Action | Status |
| --- | --- | --- |
| Jacob Fitchett | Scrum Master. Write the data dictionary | Done in `Data Dictionary/Data Dictionary.pdf` |
| Leeyand Blot Jr | Creator, Mentor, and Administrator diagrams | Done in `ERD/` |
| James Henson | Talent Scout and Moderator diagrams, and the business rules | Done in `ERD/` and `Business Rules/Business Rules.pdf` |
| Clemenceau Senatus | Update application & Meeting notes | Done |

## Oct 19, 2026 — Role diagrams

| Field | Value |
| --- | --- |
| Sprint | Cycle II — database design |
| Attendees | Clemenceau Senatus; Leeyand Blot Jr; Jacob Fitchett; James Henson |
| Location / format | Library / in person |
| Purpose | Check the Creator, Mentor, and Administrator diagrams against those role pages |

### Agenda

1. Review each others work
2. Agree which actions belong to a moderator and which belong to an administrator
3. Record the rules the database or the application must enforce
4. Confirm each role PNG, the data dictionary, and the business rules are in the sprint folder
5. Choose three use cases to explain in the presentation

### Decisions

1. **A person is stored once** as Account. On a role diagram that same record is labeled with the role.
2. **Portfolio is not its own entity.** Feature and archive are attributes of Creative Work.
3. **Invitation is the associative entity** between Opportunity and Creator. The same creator is invited to one opportunity only once.
4. **Search does not add an entity.** A Talent Scout filters a creator, then reads that creator’s work.
5. **Nomination is one entity.** A mentor creates it. A moderator approves or declines the same row.
6. **A moderator may warn, restrict, or refer a ban.** Only an administrator sets an account status to banned.
7. **Role Application is separate from a status change.** Approving a Mentor or Talent Scout is not the same action as activate, suspend, ban, or deactivate.
8. **Later requirements stay off the five role diagrams.** Comments, follows, saved work, help tickets, categories, and platform settings are described in the data dictionary.

### Decisions

1. **The design files are in the repository.** Jacob Fitchett added the data dictionary. Leeyand Blot Jr added the Creator, Mentor, and Administrator diagrams. James Henson added the Talent Scout and Moderator diagrams and the business rules.
2. **Three use cases for the presentation:** a creator publishes a piece, a talent scout invites a creator, and a moderator decides reported work.
