# Job Application Tracker

Mini ATS-style web application for tracking job applications, statuses, notes, and dashboard metrics.

## Overview

Job Application Tracker is a Next.js application backed by Supabase. It provides an authenticated dashboard for organizing applications, viewing status summaries, and managing job-search activity from a single interface.

## Problem

Internship and job searches create many small pieces of state: company names, roles, links, deadlines, contacts, notes, and follow-up status. This project turns that workflow into a structured dashboard instead of a spreadsheet or scattered notes.

## Features

- Authenticated app shell with login flow
- Applications table and application form dialog
- Dashboard components with charts and status summaries
- Supabase client/server integration
- SQL schema included for database setup
- PWA assets and service worker files
- Vercel-ready Next.js configuration

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| UI | Radix UI primitives, Lucide React, Recharts |
| Backend / Data | Supabase, PostgreSQL schema |
| Validation | Zod |
| Deployment | Vercel |

## Architecture

The app uses the Next.js App Router. Supabase integration is split between browser, server, and middleware helpers under `lib/supabase/`. Application data is stored in Supabase using the schema in `supabase-schema.sql`.

## Project Structure

```text
.
  app/                  Next.js routes and layouts
  components/           Application, auth, dashboard, layout, and UI components
  lib/                  Supabase clients, validation, constants, and utilities
  public/               PWA manifest, icons, and service worker
  supabase-schema.sql   Database schema
  proxy.ts              Request middleware/proxy setup
```

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Environment Variables

Create `.env.local` from `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Do not commit real Supabase keys. Public anon keys are still project-specific and should be managed through local or deployment environment settings.

## Database Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run the SQL in `supabase-schema.sql`.
4. Add the project URL and anon key to `.env.local`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development |
| `npm run build` | Build the production app |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |

## Deployment

The project is structured for Vercel deployment:

1. Import the repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deploy from the default branch.

## Status

Status: Supporting full-stack project / in progress.

The application has a clear app structure and deployment path. It should stay classified as a portfolio-supporting repo until authentication, database policies, and the deployed flow are verified end to end.

## Roadmap

- Add screenshots of the dashboard and application table
- Document Supabase row-level security policies if they are enabled
- Add a short demo seed dataset for local development
- Add CI for lint, typecheck, and build

## Known Limitations

- Requires a Supabase project to run with real data
- No automated tests are included yet
- The README does not claim production usage or real user metrics

## License

This repository includes a [LICENSE](LICENSE).
