# Xpression interface design

## Approach

Use a quiet cream background, dark readable text, green accents, and editorial typography. Creative-work cards introduce writing, art, and music. Shared navigation keeps Home, About, and Log in visible; the mobile layout stacks content. Labels, keyboard focus, password visibility, and readable validation support the sign-in design. CSS artwork is illustrative and requires no external images or fonts.

## Screen inventory

| Screen | Artifact | Status |
| --- | --- | --- |
| Splash / homepage | `/` | Implemented |
| Sign-in with five fictional accounts | `/login` | Implemented UI demo |
| Creator landing | `/preview?role=creator` | Implemented navigation mockup |
| Mentor landing | `/preview?role=mentor` | Implemented navigation mockup |
| Talent Scout landing | `/preview?role=scout` | Implemented navigation mockup |
| Moderator landing | `/preview?role=moderator` | Implemented navigation mockup |
| Administrator landing | `/preview?role=admin` | Implemented navigation mockup |
| Two use cases per role | Specifications below | Visual mockups pending |

The sign-in form checks only public demo values and opens a public preview URL. It has no security boundary or session. Registration and password recovery are deferred until account approval rules are clarified.

## Sign-in wireframe

```text
[Shared Xpression navigation]
[Creative welcome illustration]  [Welcome / prototype notice]
                                 [Email label + input]
                                 [Password label + input + Show/Hide]
                                 [Validation message]
                                 [Preview my space]
                                 [Five example users: name, role, email]
[Shared footer]
```

Selecting a user fills the form; submitting matching demo credentials opens their landing mockup. Incorrect credentials keep the user on the screen with an inline message. All example data is fictional. No real user data should be entered.

## Role landings

Each landing shows the role, example user's first name, descriptive tagline, four navigation cards, and a link back to choose another example user. Cards are labeled design placeholders. See the screen inventory for URLs and `lib/demo-users.ts` for the full navigation list.

## Selected use-case screen specifications

These are design specifications, not implemented business functionality or completed visual mockups. Requirements labels below are descriptive references to the Cycle 0 summary, not invented requirement IDs. Create visual mockups from these specifications and verify each against the full Functional Requirements document before submission.

### Creator — Publish creative work (create form)

Requirement: publish writing, visual art, and music.

```text
[Creator navigation] > [Publish work]
[Title input] [Medium: writing / visual art / music]
[Writing body OR image placeholder OR SoundCloud permalink]
[Description] [Category] [Visibility]
[Cancel] [Preview]
[Preview screen: title / creator / content / category]
[Back to edit] [Publish placeholder]
```

Design states: empty required fields, invalid media link, preview, and confirmation mockup. No upload or publishing is implemented.

### Creator — Manage portfolio (collection / edit)

Requirement: organize and archive creative work in a portfolio.

```text
[My portfolio] [Filter by medium]
[Work card: title / medium / status / date]
[Work details] [Edit metadata] [Archive placeholder]
[Edit screen: title / description / category]
[Cancel] [Save placeholder]
```

Design states: empty portfolio, sample published work, edit form, and archive confirmation mockup.

### Mentor — Write a structured review (detail / feedback form)

Requirement: structured reviews with strengths, improvements, and recommendations.

```text
[Review request] [Creator / work / requested date]
[Creative work preview]
[Strengths textarea] [Areas for improvement textarea]
[Recommendations textarea]
[Cancel] [Review preview] [Submit placeholder]
```

Design states: missing feedback sections, preview, and submitted review detail mockup.

### Mentor — Review requests (queue / scheduling)

Requirement: manage mentor review requests and history.

```text
[Requests] [Pending / Accepted / Completed]
[Request row: creator / work / medium / requested date]
[Request detail: creator message / work preview]
[Accept placeholder] [Decline placeholder]
[Optional proposed review date — confirm requirement]
```

Design states: empty queue, pending request, accepted request, and completed-history view.

### Talent Scout — Discover creators (search / profile)

Requirement: search creators and portfolios; save candidates.

```text
[Creator search] [Keyword] [Medium / category filters]
[Results: name / specialty / sample portfolio work]
[Profile: biography / portfolio / creative media]
[Save candidate placeholder] [Contact placeholder]
```

Design states: no results, filtered results, profile detail, and saved candidate mockup.

### Talent Scout — Create an opportunity (create form / confirmation)

Requirement: create and manage opportunities and invitations.

```text
[New opportunity]
[Title] [Description] [Creative medium] [Deadline]
[Commission / compensation details — confirm requirement]
[Preview] [Cancel]
[Opportunity preview] [Publish placeholder]
[Invitations / response-status summary mockup]
```

Design states: required-field errors, preview, and published opportunity detail mockup.

### Moderator — Review reports (review / decision)

Requirement: review reported content and users.

```text
[Report queue] [Status / category filters]
[Report: reason / date / reported work / reporter]
[Reported content detail] [Prior context]
[Decision note] [Dismiss placeholder] [Open case placeholder]
```

Design states: empty queue, open report, dismissed report, and case-created mockup. Reporter visibility and authority must be confirmed.

### Moderator — Manage moderation cases (case detail / escalation)

Requirement: moderation cases, warnings, restrictions, and escalation.

```text
[Cases] [Case ID / status / assigned moderator]
[Case detail: evidence / timeline / prior actions]
[Action: warning / temporary restriction / escalate]
[Reason textarea] [Confirmation mockup]
```

Design states: open case, pending escalation, and closed case. Permanent bans are reserved for Administrator design pending requirements confirmation.

### Administrator — Manage accounts and roles (search / modify form)

Requirement: manage accounts, permissions, and role approvals.

```text
[User search] [Role / approval-status filters]
[User detail: profile / current role / account status]
[Role selector] [Approval decision] [Reason]
[Cancel] [Save changes placeholder]
[Change summary / confirmation mockup]
```

Design states: no matching user, pending account, role-change confirmation, and restricted account detail.

### Administrator — Platform analytics (report / dashboard)

Requirement: platform management and analytics.

```text
[Analytics] [Date range] [Medium / category]
[Summary cards: users / posts / reviews / reports]
[Activity over time chart placeholder]
[Category breakdown table] [Report results]
```

Design states: populated report, empty date range, and loading/error mockups for future implementation. Metrics and export requirements must be confirmed.

## Presentation coverage

The selected designs include create forms, portfolio editing, structured feedback, request queues, search/profile views, moderation decisions, case timelines, account updates, and analytics. Capture the implemented screens and add the ten visual use-case mockups to this folder before presenting. Keep example data fictional and clearly label static designs.
