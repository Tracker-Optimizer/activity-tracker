# Activity Tracker Web App

This is the UI that will allow the users of our Activity Tracker to track their activities and view their progress, while having the ability to get suggestions from the AI.

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Shadcn UI
- AI
- NeonDB
- Better Auth
- Drizzle ORM

## Features

- User Authentication
- Activity Tracking
- Progress Visualization
- AI Suggestions

## 1. Clone the Repository

```bash
git clone https://github.com/Tracker-Optimizer/activity-tracker.git
cd activity-tracker
```

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Environment Variables Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Then fill the .env file with the required values.

### Database (Neon PostgreSQL)

Get the pooled connection string from your Neon project.

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require
```

### Better Auth

```bash
BETTER_AUTH_SECRET=your-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
```

Generate a secure secret:

```bash
openssl rand -hex 32
```

### Resend (optional)

```bash
RESEND_API_KEY=re_xxxxxx
RESEND_REGION=eu-west-1
```

### GitHub OAuth (optional)

```bash
GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx
```

## 4. Database Setup (Drizzle ORM)

Push the schema to the database:

```bash
pnpm db:push
```

Optional: verify schema using psql:

```bash
psql "$DATABASE_URL"
\dt
```

You should see tables such as:
• user
• session
• account

## 5. Start the Development Server

```bash
pnpm dev
```

Visit the application at:

```bash
http://localhost:3000
```

## 6. Troubleshooting

Error: relation “user” does not exist

Run the migrations:

```bash
pnpm db:push
```

### Error: User not found

- Email does not exist in the DB
- Typo in the email address

### Error: Sign-up returns 422

The user already exists. Use sign-in instead.

### dotenv shows (0)

The `.env` file is not being loaded.
Check file name, path, or formatting.

## Project Structure

```bash
src/
├── app/ # Next.js routes
├── components/ # UI components
├── actions/ # Server actions
├── drizzle/ # Database schema and config
│ ├── schema.ts
│ ├── db.ts
├── lib/ # Auth, email, utilities
│ ├── auth/
│ ├── email/
public/ # Static assets
```

## Branch Naming Convention

Recommended format:

```bash
feature/<issue-number>-short-description
fix/<issue-number>-bug-description
chore/<issue-number>-task-name
```

Example:

```bash
chore/7-create-readme
```

## Deployment

### Database

Use a dedicated Neon database for production.

### Hosting

The app can be deployed on:

- Vercel

Make sure to configure all environment variables in:

```bash
Vercel → Project Settings → Environment Variables
```
