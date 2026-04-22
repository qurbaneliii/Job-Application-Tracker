# Job Application Tracker (Mini ATS)

## Project Structure

```bash
.
├── app
│   ├── (app)
│   │   ├── applications
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components
│   ├── applications
│   │   ├── application-form-dialog.tsx
│   │   ├── applications-client.tsx
│   │   └── applications-table.tsx
│   ├── auth
│   │   └── login-form.tsx
│   ├── dashboard
│   │   ├── charts.tsx
│   │   ├── dashboard-client.tsx
│   │   └── realtime-dashboard.tsx
│   ├── layout
│   │   ├── app-shell.tsx
│   │   ├── sidebar.tsx
│   │   └── sign-out-button.tsx
│   ├── providers
│   │   └── supabase-provider.tsx
│   ├── ui
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── table.tsx
│   │   └── textarea.tsx
│   └── pwa-register.tsx
├── lib
│   ├── constants.ts
│   ├── dashboard.ts
│   ├── supabase
│   │   ├── client.ts
│   │   ├── env.ts
│   │   ├── middleware.ts
│   │   └── server.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validation.ts
├── public
│   ├── icon-192x192.svg
│   ├── icon-512x512.svg
│   ├── manifest.webmanifest
│   └── sw.js
├── proxy.ts
├── supabase-schema.sql
└── .env.local.example
```

## Setup

```bash
1) Create project
npx create-next-app@latest job-application-tracker --ts --tailwind --eslint --app --use-npm
cd job-application-tracker
```

```bash
2) Install dependencies
npm install @supabase/supabase-js @supabase/ssr recharts clsx tailwind-merge lucide-react date-fns zod class-variance-authority @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-dialog @radix-ui/react-separator
```

```bash
3) Configure env
cp .env.local.example .env.local
# Add your Supabase values
```

```bash
4) Create Supabase schema
# Open Supabase SQL editor and run:
# supabase-schema.sql
```

```bash
5) Run local
npm run dev
```

```bash
6) Deploy to Vercel
# Push to GitHub then import repo on Vercel
# Add env vars in Vercel Project Settings
# Deploy
```

## Supabase SQL Schema

See `supabase-schema.sql`.

## Environment Example

See `.env.local.example`.
