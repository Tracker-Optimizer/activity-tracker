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

Get the direct connection string from your Neon project.

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

### MCP Server (for AI features)

The MCP server provides AI-powered analytics and insights. For local development:

```bash
# Local MCP server URL (default for mcp-activity-tracker)
MCP_SERVER_URL=http://localhost:8787/mcp

# Shared service token for secure communication
MCP_SERVICE_TOKEN=your-secure-random-token
```

Generate a secure service token:

```bash
openssl rand -base64 32
```

**Important**: The same `MCP_SERVICE_TOKEN` must be configured in both:
- `activity-tracker/.env` (this file)
- `mcp-activity-tracker/.dev.vars` (MCP server local config)

See [mcp-activity-tracker README](../mcp-activity-tracker/README.md) for MCP server setup.

### AI Providers (optional)

```bash
OPENAI_API_KEY=xxxxxx
GOOGLE_GENERATIVE_AI_API_KEY=xxxxxx
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

## 5. Running with MCP Server (Optional)

To use AI features, you need to run both services locally:

**Terminal 1 - MCP Server:**
```bash
cd ../mcp-activity-tracker
pnpm dev
# Server runs on http://localhost:8787
```

**Terminal 2 - Web App:**
```bash
pnpm dev
# App runs on http://localhost:3000
```

The web app will automatically connect to the MCP server using the configured `MCP_SERVER_URL` and `MCP_SERVICE_TOKEN`.

## 6. Start the Development Server (Without MCP)

If you don't need AI features, you can run just the web app:

```bash
pnpm dev
```

Visit the application at:

```bash
http://localhost:3000
```

## 7. Troubleshooting

### Error: relation "user" does not exist

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

### Error: MCP_SERVICE_TOKEN is not configured

Make sure you have set `MCP_SERVICE_TOKEN` in your `.env` file and it matches the token in `mcp-activity-tracker/.dev.vars`.

### Error: Failed to connect to MCP server

1. Ensure the MCP server is running: `cd ../mcp-activity-tracker && pnpm dev`
2. Verify `MCP_SERVER_URL` is set correctly (default: `http://localhost:8787/mcp`)
3. Check that both services use the same `MCP_SERVICE_TOKEN`

## Project Structure

```bash
src/
├── app/ # Next.js routes
├── components/ # UI components
├── actions/ # Server actions
├── drizzle/ # Database schema and config
│ ├── schemas/index.ts # Barrel file to export all schemas
│ ├── db.ts
├── lib/ # Auth, email, utilities
│ ├── auth/
│ ├── email/
public/ # Static assets
```

## Branch Naming Convention

Recommended format:

```bash
feat/<issue-number>-short-description
fix/<issue-number>-bug-description
chore/<issue-number>-task-name
```

Example:

```bash
chore/7-create-readme
```

## Deployment

### Database

Use the dedicated Neon branch for production.

### Hosting

The app can be deployed on:

- Vercel

Make sure to configure all environment variables in:

```bash
Vercel → Project Settings → Environment Variables
```
