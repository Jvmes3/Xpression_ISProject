# Xpression

A community for sharing writing, visual art, and music, receiving constructive feedback, and finding creative opportunities.

## Run the application

Use Node.js 20.9+ and npm. The selected stack is TypeScript, Next.js App Router, and React. PostgreSQL and Prisma are planned for later implementation.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Visit `/login` and select an example user to populate the form. All five fictional users share `XpressionDemo1!`. Submit to preview that user's role landing screen. These public previews do not create sessions, authenticate accounts, store passwords, or connect to a database. Use only the provided fictional credentials.

```sh
npm run typecheck
npm run build
npm start
```

Build before running `npm start`. Setup follows the [Next.js installation documentation](https://nextjs.org/docs/app/getting-started/installation).

## Repository organization

- `app/`: current application source, including home, login, role previews, and shared styles.
- `lib/demo-users.ts`: fictional example users and proposed role navigation.
- `public/`: static assets.
- `sprints/cycle-00/`: original setup materials, moved from `Spring Cycle 0` with their contents preserved.
- `sprints/cycle-01/`: UI design requirements, screen inventory, meeting template, presentation, and submission checklist.
- `sprints/templates/`: reusable sprint record template.

Keep the live application in one place instead of copying it into each sprint directory. Each sprint README should link to the relevant application source and record the final commit hash or Git tag after the team accepts that sprint. Git history preserves each code snapshot. Do not mark teamwork or presentation evidence complete until it has actually happened.

## Sprint Cycle I scope

Implemented: responsive homepage, sign-in design with example users, and five role landing mockups. No real application use cases are implemented. The ten selected use cases are documented as wireframe specifications; visual mockups and mapping to the full Functional Requirements document remain team deliverables. See [Cycle I checklist](sprints/cycle-01/checklist.md).

Official repository: https://github.com/Jvmes3/Xpression_ISProject
