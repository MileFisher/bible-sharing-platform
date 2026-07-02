# Bible Knowledge Sharing Platform

## Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- PostgreSQL with Prisma ORM
- NextAuth.js for authentication
- Hosted on Vercel + Supabase

## Code style
- Use TypeScript strictly — no `any` types
- Use named exports, not default exports for components
- Use Server Components by default; add "use client" only when needed
- File names: kebab-case for pages, PascalCase for components

## Folder structure
- /app — Next.js App Router pages
- /components — shared UI components
- /lib — utilities, db client, auth config
- /prisma — schema and migrations

## Database
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations locally
- Never edit migration files manually

## Testing & verification
- Run `npm run build` to check for TypeScript errors after changes
- Run `npx prisma validate` after schema edits
- Test auth flows manually using the /api/auth routes

## Important constraints
- Text-only posts (no image uploads in MVP)
- Invite-only registration — do not build open sign-up
- Admin role can delete posts and block users; member role can post/comment/like
- LINE Messaging API for daily reminders — not LINE Notify (deprecated)

## Code Review Workflow
After completing any implementation task:
1. Run `opencode run "Review the changes I just made. List issues or say READY_TO_COMMIT"`
2. If issues are found, fix them and repeat step 1
3. Only stop when OpenCode responds with READY_TO_COMMIT

## Git commit conventions
Never add a Co-Authored-By: Claude trailer or "Generated with Claude Code" line to commit messages.


