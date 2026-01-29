# Architecture & Design Diagrams

## Table of Contents
1. [High-Level System Architecture](#high-level-system-architecture)
2. [Component Architecture](#component-architecture)
3. [Data Flow Diagrams](#data-flow-diagrams)
4. [Event Tracking Flow](#event-tracking-flow)
5. [Supabase Integration](#supabase-integration)
6. [State Management](#state-management)

---

## High-Level System Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          END USER BROWSER                               │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Next.js Application                            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │  │
│  │  │   Hero.tsx   │  │  Houses.tsx  │  │   Contact.tsx        │    │  │
│  │  │              │  │              │  │  ┌────────────────┐  │    │  │
│  │  │  - Static    │  │ - useHouses  │  │  │ Contact Form   │  │    │  │
│  │  │  - Branded   │  │ - Modal View │  │  │ - Validation   │  │    │  │
│  │  │  - Hero CTA  │  │ - Analytics  │  │  │ - Supabase Save│  │    │  │
│  │  │              │  │              │  │  │ - Analytics    │  │    │  │
│  │  └──────────────┘  └──────────────┘  │  └────────────────┘  │    │  │
│  │                                       │  - Loading State    │    │  │
│  │                                       │  - Error Feedback   │    │  │
│  │                                       │  - Success Message  │    │  │
│  │                                       └──────────────────────┘    │  │
│  │                                                                    │  │
│  │  ┌───────────────────────────────────────────────────────────┐   │  │
│  │  │              Analytics & Data Layer                        │   │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │   │  │
│  │  │  │ analytics.ts │  │  config.ts   │  │  amplitude.ts    │ │   │  │
│  │  │  │              │  │              │  │                  │ │   │  │
│  │  │  │ trackEvent() │  │ - API_URL    │  │ - SDK Init       │ │   │  │
│  │  │  │ wrapper      │  │ - STALE_TIME │  │ - Auto-capture   │ │   │  │
│  │  │  │              │  │ - AMP_KEY    │  │ - Session Replay │ │   │  │
│  │  │  └──────────────┘  └──────────────┘  └──────────────────┘ │   │  │
│  │  │  ┌──────────────────────────────────────────────────────┐  │   │  │
│  │  │  │          React Query Hooks                           │  │   │  │
│  │  │  │  - useHouses() → Wizard World API                   │  │   │  │
│  │  │  │  - useHouse(id) → Wizard World API                 │  │   │  │
│  │  │  └──────────────────────────────────────────────────────┘  │   │  │
│  │  │  ┌──────────────────────────────────────────────────────┐  │   │  │
│  │  │  │          Supabase Client (Browser)                   │  │   │  │
│  │  │  │  - Supabase.from('contacts').insert()              │  │   │  │
│  │  │  │  - Row-Level Security enforced                      │  │   │  │
│  │  │  └──────────────────────────────────────────────────────┘  │   │  │
│  │  └───────────────────────────────────────────────────────────┘   │  │
│  │                                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────┬──────────────────────────────────────────────────────┬───┘
               │                                                      │
               │ HTTPS/REST API                                      │ HTTPS/REST API
               │                                                      │
        ┌──────▼──────┐                                      ┌────────▼────────┐
        │   Amplitude │                                      │    Supabase     │
        │  Analytics  │                                      │   PostgreSQL    │
        │             │                                      │                 │
        │ - Event Log │                                      │ ┌─────────────┐ │
        │ - Cohorts   │                                      │ │  contacts   │ │
        │ - Funnels   │                                      │ │ ┌─────────┐ │ │
        │ - Dashboards│                                      │ │ │first_nm │ │ │
        │ - Replays   │                                      │ │ │last_nm  │ │ │
        │             │                                      │ │ │email    │ │ │
        └─────────────┘                                      │ │ │message  │ │ │
                                                             │ │ │created_at
                                                             │ └─────────────┘ │
                                                             └─────────────────┘
```

---

## Component Architecture

### Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    layout.tsx                               │
│  - Root layout with Providers (React Query, Amplitude)    │
│  - Loads global CSS (Tailwind + custom theme)             │
│  - Initializes pageEvent() tracking                       │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
            ▼            ▼            ▼
      ┌─────────┐  ┌──────────┐  ┌──────────┐
      │ Hero    │  │ Houses   │  │ Contact  │
      │         │  │          │  │          │
      │ Static  │  │- State   │  │- State   │
      │Content  │  │- Modal   │  │- Form    │
      │ - CTA   │  │- Analytics   │- Loading │
      │Button   │  │- useHouses   │- Errors  │
      │         │  │              │- Success │
      └─────────┘  └──────────┘  │- Analytics
                                  └──────────┘
```

### contact.tsx State Machine

```
                    ┌─────────────────────────────┐
                    │      INITIAL STATE          │
                    │  isOpen: false              │
                    │  loading: false             │
                    │  errorMsg: ""               │
                    │  successMsg: ""             │
                    └────────────┬────────────────┘
                                 │
                         [Click "Contact"]
                                 │
                                 ▼
                    ┌─────────────────────────────┐
                    │    MODAL OPEN STATE         │
                    │  isOpen: true               │
                    │  loading: false             │
                    │  errorMsg: ""               │
                    │  successMsg: ""             │
                    │                             │
                    │ User can type form...       │
                    └─────────┬──────────┬────────┘
                              │          │
                    [Click Submit]   [Click Close]
                              │          │
                              ▼          ▼
                    ┌─────────────┐  [Track: Form Abandoned]
                    │SUBMITTING   │  Return to INITIAL
                    │loading: true│
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                │                     │
            [Success]             [Error]
                │                     │
                ▼                     ▼
      ┌──────────────────┐   ┌──────────────────┐
      │  SUCCESS STATE   │   │  ERROR STATE     │
      │  successMsg: "..." │   │ errorMsg: "..."  │
      │  loading: false  │   │ loading: false   │
      │                  │   │                  │
      │  [Auto-reset     │   │ User can retry   │
      │   after 3s]      │   │ or close         │
      │                  │   │                  │
      │ Return to INITIAL   │ Return to MODAL OPEN
      └──────────────────┘   └──────────────────┘
```

---

## Data Flow Diagrams

### Form Submission Flow

```
User Clicks "Send message" Button
        │
        ▼
preventDefault() on form event
        │
        ▼
Extract form data:
┌─────────────────────────────┐
│ Contact object:             │
│ - first_name                │
│ - last_name                 │
│ - email                     │
│ - message                   │
└─────────────────────────────┘
        │
        ├─────────────────────────────┐
        │                             │
        ▼                             ▼
trackEvent("Contact Form Submitted"  Create Supabase
    with Contact data)               Client
        │                             │
        │ (to Amplitude)              │
        │ [Analytics Event]           │
        │                             │
        │                             ▼
        │                    supabase.from('contacts')
        │                    .insert([contact])
        │                             │
        │                             ▼
        ├─────────────┬───────────────┤
        │             │               │
    [await Promise]   │               │
        │             │               │
        ▼             ▼               ▼
   ┌─────────────────────────────────────────┐
   │  Check Response                         │
   └─────────────────────────────────────────┘
        │
        ├──────────────┬──────────────┐
        │              │              │
    [error]         [success]    [exception]
        │              │              │
        ▼              ▼              ▼
   Error Path    Success Path   Exception Path
        │              │              │
        ▼              ▼              ▼
trackError()    trackSuccess()  trackError()
setErrorMsg()   setSuccessMsg() setErrorMsg()
setLoading()    trackSubmitted()setLoading()
               form.reset()
               setLoading()
```

### Houses Data Flow

```
Page Load
    │
    ▼
useHouses() hook executes:
    ├── useQuery({
    │   queryKey: ['houses'],
    │   queryFn: async () => {
    │       response = await api.get('/houses')
    │       return response.data
    │   }
    │   staleTime: 300000ms (5 min)
    │})
    │
    ▼
External API Call:
Wizard World API: https://wizard-world-api.herokuapp.com
    │
    ▼
Parse Response (House[])
    │
    ▼
React Query Caches Data
(reuse for 5 minutes)
    │
    ├─────────────────────────────────┐
    │                                 │
    ▼                                 ▼
Display Houses              User clicks "Details"
Component renders              │
with all houses                 ▼
                        trackEvent("House Details Opened", {
                            house: house.name,
                            houseId: house.id
                        })
                            │
                            ▼
                        Modal Opens
                        Shows full house details
                        (heads, traits, ghost, etc.)
```

---

## Event Tracking Flow

### Analytics Event Lifecycle

```
Component Event (click, submit, etc.)
    │
    ▼
Handler Function Executes
    │
    ├─────────────────────────────────────┐
    │                                     │
    ▼                                     ▼
trackEvent(eventName)    Business Logic Executes
    │                         │
    ▼                         ▼
Calls lib/analytics.ts   ┌──────────────────┐
trackEvent() function     │ e.g., insert to   │
    │                     │ Supabase, update  │
    ├─────────────────┐   │ state, etc.       │
    │                 │   └──────────────────┘
    ▼                 │
Adds properties:      │
- timestamp          │
- event context      │
- user data          │
    │                 │
    ▼                 ▼
amplitude.track()   Event completes
    │                │
    ▼                └─────────────────┐
Amplitude SDK                         │
    │                                 ▼
    ├─► Event Queue              Return to Component
    ├─► Batch & Send                 │
    ├─► Server Processing            ▼
    │   - Dashboard updates       Update UI
    │   - Cohort assignment       - Show feedback
    │   - Funnel tracking         - Reset form
    │   - Retention analysis      - Navigate
    │
    └─► (If sessions.io enabled)
        - Session Recording
        - User replay data
```

### Contact Form Events Map

```
┌────────────────────────────────────────────────────────────┐
│             Contact Form Event Tracking                     │
└────────────────────────────────────────────────────────────┘

Contact Modal Opened
├─ Event Name: "Contact Modal Opened"
├─ Properties: {} (timestamp auto-added)
├─ When: User clicks "Contact Hogwarts 🦉" button
└─ Use Case: Measure CTA click rate

    │
    ▼

User Types & Submits Form
│
├─ Contact Form Submitted (if success)
│  ├─ Event Name: "Contact Form Submitted"
│  ├─ Properties: {first_name, last_name, email, message}
│  ├─ When: Form sent to Supabase
│  └─ Use Case: Measure form engagement
│
├─ Contact Form Success
│  ├─ Event Name: "Contact Form Success"
│  ├─ Properties: {first_name, last_name, email, message}
│  ├─ When: DB insert confirms
│  └─ Use Case: Success rate, conversion
│
└─ Contact Form Error (if failure)
   ├─ Event Name: "Contact Form Error"
   ├─ Properties: {error, first_name, last_name, email, message}
   ├─ When: Supabase RLS blocks or network fails
   └─ Use Case: Error frequency, debugging

    │
    ▼

Contact Form Abandoned
├─ Event Name: "Contact Form Abandoned"
├─ Properties: {} (timestamp auto-added)
├─ When: User closes modal without submitting
└─ Use Case: Drop-off analysis, UX improvements
```

---

## Supabase Integration

### Database Schema & RLS

```
Table: public.contacts
┌──────────────────────────────────────────┐
│ Column       │ Type         │ Constraint │
├──────────────────────────────────────────┤
│ id           │ UUID         │ PK         │
│ first_name   │ text         │ NOT NULL   │
│ last_name    │ text         │ nullable   │
│ email        │ text         │ NOT NULL   │
│ message      │ text         │ NOT NULL   │
│ created_at   │ timestamp    │ default    │
└──────────────────────────────────────────┘

RLS Policy:
┌──────────────────────────────────────────────────────┐
│ Policy: "Allow insert for all"                      │
│ - Type: INSERT                                       │
│ - Using: true                                        │
│ - Purpose: Allow public form submissions            │
│                                                      │
│ (In production, use more restrictive policies)      │
└──────────────────────────────────────────────────────┘

Client Flow:
┌─────────────────┐
│  browser        │
│  supabase       │
│  client.ts      │
└────────┬────────┘
         │
         ├─ createBrowserClient()
         │  - Uses NEXT_PUBLIC_SUPABASE_URL
         │  - Uses NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
         │  - Creates JWT for requests
         │
         ▼
    ┌─────────────────────────────┐
    │   Supabase REST API         │
    │   https://...supabase.co    │
    │   /rest/v1/contacts         │
    └────────┬────────────────────┘
             │
             ├─ Headers:
             │  - Authorization: Bearer JWT
             │  - Content-Type: application/json
             │
             ▼
         ┌─────────────────┐
         │  PostgreSQL DB  │
         │                 │
         │  RLS enforces:  │
         │  - Policy check │
         │  - CRUD ops     │
         │                 │
         └─────────────────┘
```

---

## State Management

### Global vs Local State

```
┌─────────────────────────────────────────────────────────┐
│               State Management Strategy                 │
└─────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐
│     React Query (Server State)      │
│                                    │
│  - Houses data from API            │
│  - Cached for 5 minutes            │
│  - Auto-refetch on focus           │
│  - Handles loading/error states    │
│                                    │
│  useHouses() → {data, isLoading}   │
└────────────────────────────────────┘
         │
         └─► Shared across page
             Re-used if available

┌────────────────────────────────────┐
│    Component Local State (React)    │
│                                    │
│  Contact Modal:                    │
│  - isOpen: boolean                 │
│  - loading: boolean                │
│  - errorMsg: string                │
│  - successMsg: string              │
│                                    │
│  Houses Modal:                     │
│  - selectedHouse: House | null     │
│                                    │
│  Reason: Component-scoped,         │
│  no global state needed            │
└────────────────────────────────────┘
         │
         └─► Isolated per component
             No Redux/Zustand overhead

┌────────────────────────────────────┐
│     Environment Configuration       │
│                                    │
│  lib/config.ts exports:            │
│  - API_URL                         │
│  - STALE_TIME                      │
│  - AMPLITUDE_API_KEY               │
│                                    │
│  Reason: Single source of truth    │
│  for all env vars                  │
└────────────────────────────────────┘
```

### Data Dependency Graph

```
layout.tsx (root)
    │
    ├─► providers.tsx
    │   ├─► QueryClientProvider (React Query)
    │   └─► (Amplitude init at app.tsx level)
    │
    └─► page.tsx
        │
        ├─► Hero.tsx (static)
        │
        ├─► Houses.tsx
        │   ├─► useHouses()
        │   │   └─► Wizard World API
        │   │
        │   └─► Modal State (local)
        │       └─► useHouse data (from parent)
        │
        └─► Contact.tsx
            ├─► Form State (local)
            │   ├─► errorMsg, successMsg, loading
            │   ├─► trackEvent() (Amplitude)
            │   └─► Supabase client for insert
            │
            └─► trackEvent() from analytics.ts
                └─► amplitude.ts (initialized globally)
```

---

## Performance Optimizations

### Implemented

```
✅ React Query Caching
   - Houses cached for 5 minutes (300000ms)
   - Reduces API calls
   - Instant page loads on revisit

✅ Component Code Splitting
   - Next.js auto-splits components
   - Modal only renders when isOpen=true
   - Reduces initial bundle

✅ Image Optimization
   - Next.js Image component (if used)
   - Automatic format selection
   - Responsive sizes

✅ CSS Optimization
   - Tailwind CSS purges unused styles
   - Custom theme reduces CSS size
   - PostCSS minification

✅ Analytics Batching
   - Amplitude batches events
   - Doesn't block page interactivity
   - Async HTTP requests

✅ Error Recovery
   - Content blocker errors ignored
   - App continues working
   - Non-blocking analytics
```

### Future Opportunities

```
🚀 Server-Side Rendering (SSR)
   - Pre-render hero and houses
   - Faster First Contentful Paint

🚀 API Route Optimization
   - Create /api/contacts endpoint
   - Server-side validation
   - Rate limiting

🚀 Database Query Optimization
   - Index on email column
   - Pagination for contacts list
   - Full-text search

🚀 Event Sampling
   - Sample high-volume events
   - Reduce Amplitude costs
   - Maintain statistical significance
```

---

## Security Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Security Layers                             │
└──────────────────────────────────────────────────────────┘

Layer 1: Frontend
├─ Environment variables (.env)
│  └─ NEXT_PUBLIC_* only exposed (by Next.js)
│     └─ Private keys never in client bundle
│
├─ Input Validation
│  └─ HTML5 required attributes
│  └─ Email type validation
│  └─ Message length constraints
│
└─ HTTPS/TLS
   └─ All requests encrypted

Layer 2: API Layer
├─ Supabase REST API
│  └─ JWT token in Authorization header
│  └─ Token signed with service key
│
├─ Rate Limiting
│  └─ Handled by Supabase platform
│
└─ CORS
   └─ Supabase allows configured origins

Layer 3: Database Layer
├─ Row-Level Security (RLS)
│  └─ Policy: "Allow insert for all"
│  └─ Could restrict by user/IP in production
│
├─ Data Validation
│  └─ Column constraints
│  └─ Type validation
│
└─ Audit Logs
   └─ Supabase tracks all changes

Layer 4: Analytics Layer
├─ Amplitude API Key (public-safe)
│  └─ Publishable key only
│  └─ Service key never exposed
│
├─ PII Redaction
│  └─ Option: don't track sensitive fields
│  └─ Currently: captured (for demo)
│
└─ Session Replay
   └─ Configurable (5% sample rate)
   └─ Can mask sensitive inputs
```

---

## Deployment Architecture

```
Development Environment
┌──────────────────────┐
│  npm run dev         │
│  localhost:3000      │
│  .env.local          │
└──────────────────────┘

Production Build
┌──────────────────────────────────────┐
│  npm run build                       │
│  Generates .next/ (optimized)        │
│  Type checking (tsc)                 │
│  ESLint validation (npm run lint)   │
└──────────────────────────────────────┘

Deployment Options
├─ Vercel (recommended for Next.js)
│  ├─ Auto-deploy on git push
│  ├─ Environment variables via dashboard
│  └─ Built-in CDN and edge functions
│
├─ Docker
│  ├─ Multi-stage build
│  └─ Slim production image
│
└─ Self-hosted Node.js
   ├─ Run .next/ with Node
   └─ Reverse proxy (nginx)

Environment Configuration
├─ Production
│  ├─ NEXT_PUBLIC_AMPLITUDE_API_KEY (production key)
│  ├─ NEXT_PUBLIC_SUPABASE_URL (prod DB)
│  └─ NEXT_PUBLIC_SUPABASE_KEY (prod key)
│
└─ Staging/Testing
   ├─ NEXT_PUBLIC_AMPLITUDE_API_KEY (dev key)
   ├─ Different Supabase project
   └─ Allows isolated testing
```

---

## Monitoring & Observability

```
Analytics Dashboards (Amplitude)
├─ Real-time Events
│  └─ Live feed of user interactions
│
├─ Funnel Analysis
│  └─ Contact Modal → Form Submit → Success
│  └─ Identify drop-off points
│
├─ Cohort Reports
│  └─ Users with errors
│  └─ Users completing forms
│
├─ User Retention
│  └─ Return visitor analysis
│
└─ Session Replay
   └─ Watch 5% of user sessions
   └─ Debug UX issues

Application Monitoring
├─ Error Tracking
│  └─ Browser console errors
│  └─ Form submission errors
│  └─ API failures
│
├─ Performance
│  └─ Lighthouse scores
│  └─ Core Web Vitals
│  └─ Load time analysis
│
└─ Logging
   └─ Supabase logs
   └─ API request logs
   └─ Analytics event logs
```

