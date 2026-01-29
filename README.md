# Trackable Harry Potter Web App

## Overview

This is a **solutions architect showcase project** — a Harry Potter-themed web application demonstrating best practices for web analytics implementation using **Amplitude**. The app showcases modern web development patterns, event tracking strategies, and secure data handling with Supabase.

### Key Features

✨ **Web Analytics & Tracking**
- Event-driven architecture with Amplitude
- Real-time user behavior tracking
- Analytics for modal interactions, form submissions, and user navigation
- Session replay capability (5% sample rate)
- Comprehensive error tracking with context

📧 **Contact Management**
- Responsive contact form with real-time validation
- Supabase integration for secure data storage
- Loading states, error handling, and success feedback
- Full form data captured in analytics events

🏰 **Magical Theme**
- Harry Potter Hogwarts houses showcase
- Dark-themed, branded UI with custom color palette
- Responsive design for mobile and desktop
- Custom Cinzel serif font for headings

---

## Technology Stack

### Frontend
- **Next.js 16** - React framework with SSR/SSG
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first styling
- **TypeScript** - Type-safe JavaScript
- **Lucide React** - Icon library

### Analytics & Data
- **Amplitude** - Event analytics platform
- **Supabase** - PostgreSQL database with auth/RLS
- **TanStack React Query** - Server state management

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │          Next.js Application (React 19)             │ │
│  │  ┌────────────────────┬────────────────────┬────────────────────┐   │
│  │  │ Hero Section │ │ Houses Cards │ │ Contact Form │   │
│  │  └────────────────────┘─────────────────────┘────────────────────┘   │
│  │         ▼              ▼                    ▼          │   │
│  │  ┌──────────────────────────────────────────────────────────┐ │
│  │  │    Analytics Layer (Amplitude SDK)              │ │
│  │  │  - trackEvent() abstraction                      │ │
│  │  │  - Session replay (5% sample)                    │ │
│  │  │  - Auto-capture enabled                          │ │
│  │  └──────────────────────────────────────────────────────────┘ │
│  └──────────────────────────────────────────────────────────────────────────┘
└──────────────────────────────────────────────────────────────────────────────┘
        │                                        │
        │                                        │
        ▼                                        ▼
┌──────────────────────────────────┐         ┌──────────────────────────────────┐
│   Amplitude Analytics    │         │  Supabase Backend        │
│  - Event Collection      │         │  - PostgreSQL Database   │
│  - User Tracking         │         │  - Row-Level Security    │
│  - Session Replay        │         │  - Contacts Table        │
│  - Cohort Analysis       │         │  - Auth (JWT)            │
└──────────────────────────────────┘         └──────────────────────────────────┘
```

### Event Tracking Strategy

**Contact Form Events:**
- `Contact Modal Opened` - User opens contact modal
- `Contact Form Submitted` - Form successfully submitted with all user data
- `Contact Form Success` - Database insert successful
- `Contact Form Error` - Submission failed with error details and user context
- `Contact Form Abandoned` - User closes modal without submitting

**Houses Section Events:**
- `House Details Opened` - User clicks to view house details (tracks: house name, house ID)
- `House Details Closed` - User closes house details modal

**Form Data Captured:**
```
{
  first_name: string,
  last_name?: string,
  email: string,
  message: string,
  error?: string,
  timestamp: Date
}
```

---

## Project Structure

```
app/
├── components/
│   ├── hero.tsx              # Landing section
│   ├── houses.tsx            # Houses showcase with modal
│   └── contact.tsx           # Contact form with analytics
├── lib/
│   ├── amplitude.ts          # Amplitude SDK initialization
│   ├── analytics.ts          # trackEvent() wrapper
│   ├── api.ts                # External API calls (Wizard World)
│   ├── config.ts             # Environment variables
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       ├── server.ts         # Server Supabase client
│       └── middleware.ts     # Next.js middleware
├── hooks/
│   └── houses/
│       ├── useHouses.ts      # Query all houses
│       └── useHouse.ts       # Query single house
├── types/
│   ├── contact.ts            # Contact form interface
│   ├── house.ts              # House data model
│   ├── wizard.ts             # Wizard model
│   ├── trait.ts              # House traits
│   ├── elixir.ts             # Potions/elixirs
│   └── ingredient.ts         # Ingredients
├── globals.css               # Tailwind + custom theme
├── layout.tsx                # Root layout with Providers
├── page.tsx                  # Home page
└── providers.tsx             # React Query + Amplitude
```

---

## Setup & Configuration

### Environment Variables

Create `.env` file with:

```bash
# Wizard World API (External)
NEXT_PUBLIC_WIZARD_WORLD_API_URL="https://wizard-world-api.herokuapp.com"
NEXT_PUBLIC_REQUEST_STALE_TIME="300000"

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="sb_publishable_..."

# Amplitude (Analytics)
NEXT_PUBLIC_AMPLITUDE_API_KEY="your-amplitude-key"
```

### Supabase RLS Policy

For the `contacts` table, add a policy to allow inserts:

```sql
CREATE POLICY "Allow insert for all" ON contacts
FOR INSERT
WITH CHECK (true);
```

---

## Installation & Running

```bash
# Install dependencies
npm install

# Development server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## Design Decisions & Best Practices

### 1. Analytics Abstraction Layer

**Why:** Decouples components from Amplitude SDK, making it easier to migrate platforms and maintain consistent event naming.

### 2. Environment Configuration

**Why:** All credentials loaded through centralized `config.ts` - prevents hardcoding secrets and improves CI/CD integration.

### 3. Responsive Mobile Design

**Why:** Mobile-first approach with adaptive styling, proper touch targets, and viewport-aware modal sizing.

### 4. Error Tracking with Context

**Why:** Errors tracked with full user/form data for better debugging and understanding error patterns in Amplitude.

### 5. Local Form State

**Why:** Component-scoped React state is simpler for modal forms without Redux overhead.

---

## Solutions Architect Highlights

### Scalability ✅
- Event-driven architecture scales to millions of events
- Supabase handles concurrent connections efficiently
- React Query caches reduce redundant API calls
- Next.js provides automatic CDN optimization

### Security ✅
- Supabase RLS enforces database-level access control
- Environment variables never exposed to frontend (except NEXT_PUBLIC_ keys)
- Form data validated before database insertion
- Content blocker errors handled gracefully

### Maintainability ✅
- Type-safe TypeScript throughout codebase
- Centralized analytics tracking via abstraction layer
- Clear component responsibilities and separation of concerns
- Reusable React Query hooks pattern

### User Experience ✅
- Loading states on all async operations
- User-friendly error messages with recovery guidance
- Success feedback with form reset
- Fully responsive mobile-first design

---

## Future Enhancements

- [ ] User authentication (Supabase Auth)
- [ ] Admin dashboard to view/manage contacts
- [ ] Email notifications on form submission
- [ ] A/B testing framework integration
- [ ] Custom event schema validation
- [ ] Server-side event tracking (Amplitude Node SDK)
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle

---

**This application demonstrates solutions architecture principles including scalability, security, maintainability, and user-centric design.**