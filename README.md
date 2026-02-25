# DevTrack

A developer study tracker built with Next.js. Track your coding sessions, manage GitHub projects, monitor course progress, set goals, and visualize your learning journey — all in one place.

## Live Demo

[Try DevTrack live](https://devtrack-silk.vercel.app/)

## Features

- **GitHub OAuth** — Sign in with your GitHub account, no passwords needed
- **Study Sessions** — Start/stop timer for coding, learning, debugging, reviewing, and planning sessions
- **GitHub Projects** — Import repos from GitHub with full detail views (commits, branches, contributors, languages)
- **Course Tracking** — Track online courses with progress bars, platforms, and time spent
- **Goals & Notes** — Set per-project goals with deadlines, add freeform notes
- **Activity Heatmap** — GitHub-style contribution graph for your study sessions
- **Dashboard** — Overview of today's stats, streak, upcoming goals, recent sessions, active courses
- **Profile** — Lifetime stats, activity graph, account info

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Auth | [NextAuth.js v5](https://authjs.dev) (GitHub OAuth) |
| Database | PostgreSQL |
| ORM | [Prisma](https://prisma.io) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animations | [Motion](https://motion.dev) (Framer Motion) |

## Data Model

```
User
 ├── Project (imported from GitHub)
 │    ├── ProjectGoal (with deadline)
 │    └── ProjectNote
 ├── Course (with progress tracking)
 └── StudySession (timed, linked to project or course)
```

### Enums

- **ProjectStatus** — `ACTIVE` · `ON_HOLD` · `COMPLETED` · `ARCHIVED`
- **CourseStatus** — `NOT_STARTED` · `IN_PROGRESS` · `COMPLETED` · `DROPPED`
- **SessionType** — `CODING` · `LEARNING` · `DEBUGGING` · `REVIEWING` · `PLANNING`

## Project Structure

```
├── app/
│   ├── page.tsx                    # Landing page (public)
│   ├── layout.tsx                  # Root layout (Topbar + Providers)
│   ├── signin/                     # Sign in page
│   ├── api/                        # Auth API routes
│   └── (protected)/                # Auth-guarded routes
│       ├── layout.tsx              # Sidebar + auth check
│       ├── dashboard/              # Main dashboard
│       ├── projects/               # Project list + [owner]/[project] detail
│       ├── courses/                # Course list + management
│       ├── sessions/               # Session history
│       └── profile/                # User profile + stats
├── components/
│   ├── dashboard/                  # Dashboard view
│   ├── project/                    # Project card, full view
│   ├── repo/                       # GitHub repo picker
│   ├── course/                     # Course components
│   ├── session/                    # Session timer, graph
│   ├── goal/                       # Goals panel
│   ├── note/                       # Notes panel
│   ├── profile/                    # Profile view
│   ├── layout/                     # Topbar, Sidebar
│   ├── ui/                         # CommitGraph, shared UI
│   └── Providers.tsx               # NextAuth SessionProvider
├── lib/
│   ├── auth.ts                     # Auth helpers (login, logout, checks)
│   ├── github.ts                   # GitHub API client (repos, commits, stats)
│   ├── dashboard.ts                # Dashboard data aggregation
│   ├── projects.ts                 # Project CRUD
│   ├── courses.ts                  # Course CRUD
│   ├── sessions.ts                 # Session start/stop/list
│   ├── goals.ts                    # Goal CRUD
│   ├── notes.ts                    # Note CRUD
│   ├── profile.ts                  # Profile data aggregation
│   ├── prisma.ts                   # Prisma client singleton
│   └── types/                      # GitHub API types
├── prisma/
│   └── schema.prisma               # Database schema
├── util/                           # Helpers (GitHub language colors, etc.)
├── types/                          # TypeScript type extensions
└── auth.ts                         # NextAuth config (GitHub provider + JWT)
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App ([create one here](https://github.com/settings/developers))

### 1. Clone the repository

```bash
git clone https://github.com/kielakjr/devtrack.git
cd devtrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devtrack"

GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"

AUTH_SECRET="your-random-secret-string"
```

To generate `AUTH_SECRET`:

```bash
npx auth secret
```

### 4. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with GitHub.

## Pages Overview

| Route | Description |
|-------|------------|
| `/` | Landing page — redirects to dashboard if logged in |
| `/signin` | GitHub OAuth sign in |
| `/dashboard` | Stats, activity graph, session timer, recent projects/courses/sessions, upcoming goals |
| `/projects` | List of imported GitHub projects + import picker |
| `/projects/[owner]/[repo]` | Full project view — repo details, commits, branches, goals, notes |
| `/courses` | Course list with progress tracking |
| `/sessions` | Session history |
| `/profile` | User stats, activity graph, account info, sign out |

## Key Patterns

### Server Actions

All data mutations (`lib/*.ts`) use `'use server'` directives and authenticate via `auth()` before every operation. No raw API routes needed.

### GitHub API Integration

- Repos, commits, branches, tags, contributors, and languages fetched live via GitHub API
- Commit activity stats use `ghFetchStats` with `202` status handling — if GitHub is still computing stats, the client polls in the background via `CommitActivitySection`
- No GitHub data is cached in the database — always fresh from the API

### Protected Routes

The `(protected)` route group uses a server-side layout that checks `auth()` and redirects to `/signin` if unauthenticated. Public pages (`/`, `/signin`) live outside this group.

### Activity Heatmap

The `SessionGraph` component renders a GitHub-style contribution heatmap based on study session data, with tooltips showing daily totals and dates.

## License

MIT
