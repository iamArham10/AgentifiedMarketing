# Agentified Marketing Platform

## Overview

Agentified Marketing Platform is a decentralized multi-agent system for automated marketing campaign management. The platform orchestrates specialized AI agents across multiple layers (Creator, Critic, Strategist, Support) to collaboratively build, review, optimize, and deploy marketing campaigns to social media platforms. The system implements a trust-based consensus mechanism where agents negotiate decisions, and humans maintain oversight through an approval queue workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management and caching
- Tailwind CSS with custom design system for styling
- shadcn/ui component library (Radix UI primitives)
- Recharts for data visualization
- Framer Motion for animations (note: dependency removed per package.json)

**Design System:**
- Dark mode color palette with custom CSS variables
- 8px spacing grid system
- Custom component variants using class-variance-authority
- Consistent typography using Inter font family
- Color-coded agent types (Blue: Creator, Orange: Critic, Purple: Strategist, Gray: Support)

**Page Structure:**
1. Dashboard (`/`) - Overview with KPIs, active campaigns, and activity feed
2. Campaign Builder (`/campaign-builder`) - Multi-step wizard for campaign creation
3. Agent Orchestration Hub (`/agent-hub`) - Force-directed graph visualization of agent network
4. Campaign Monitoring (`/monitoring`) - Real-time performance metrics and timeline
5. Approval Queue (`/approvals`) - Human-in-the-loop review interface
6. Analytics (`/analytics`) - Historical insights and agent performance metrics
7. System Configuration (`/config`) - Agent pool, API integrations, brand guidelines, trust settings

**State Management:**
- React Query for API data with infinite stale time (static mock data)
- Local component state for UI interactions
- No global state management currently implemented

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- PostgreSQL database via Neon serverless
- Drizzle ORM for type-safe database operations
- Session-based architecture (connect-pg-simple for session storage)

**Current Implementation:**
- Minimal backend scaffolding in place
- Storage interface defined with in-memory implementation (MemStorage)
- User schema defined but not actively used
- Routes stub created but no API endpoints implemented yet

**Intended Architecture:**
- RESTful API design with `/api` prefix
- CRUD operations through storage interface abstraction
- Session management for user authentication
- Database migrations managed via Drizzle Kit

**Data Models:**
The application requires models for:
- Campaigns (configuration, status, platforms, timeline, budget)
- Agents (type, trust score, status, performance metrics)
- Agent interactions/messages (communication logs)
- Approvals (pending decisions, consensus data)
- Analytics (metrics, insights, performance history)
- Brand guidelines (parsed content, rules)
- Platform integrations (OAuth tokens, sync status)

### Agent System Design

**Agent Types & Layers:**
- **Creator Layer:** Copywriter, Designer, Targeting agents
- **Critic Layer:** Quality assurance and brand alignment validation
- **Strategist Layer:** Campaign optimization and decision-making
- **Support Layer:** Deployment, Analytics agents

**Trust & Reputation:**
- Trust scores range 0-100 per agent
- Scores influence consensus weighting
- Configurable decay rates for failures
- Initial scores assigned on agent creation

**Consensus Mechanism:**
- Multi-agent negotiation before decisions
- Confidence scores calculated from agent agreement
- Human approval required above certain thresholds
- Audit trail maintained for all decisions

### Workflow Architecture

**Campaign Lifecycle:**
1. **Creation** - User defines objectives, audience, budget via wizard
2. **Agent Collaboration** - Agents generate variants and negotiate
3. **Consensus** - Strategist agents evaluate and reach agreement
4. **Human Approval** - Queue item created with agent rationale
5. **Deployment** - Approved campaigns published to platforms
6. **Monitoring** - Real-time metrics tracking and optimization
7. **Analytics** - Post-campaign analysis and insights

**Human-in-the-Loop:**
- Approval queue acts as critical checkpoint
- Users review agent reasoning and consensus confidence
- Options to approve, request revisions, or reject
- Full audit trail of decisions with timestamps and user IDs

## External Dependencies

### Third-Party Services & APIs

**Social Media Platforms:**
- Meta (Facebook) - OAuth 2.0 integration for campaign deployment
- Twitter - OAuth integration with rate limit tracking
- LinkedIn - OAuth integration (connection status managed)

**Database:**
- Neon Serverless PostgreSQL - Cloud-hosted database
- Connection via `@neondatabase/serverless` driver
- DATABASE_URL environment variable required

**Development Tools:**
- Replit-specific plugins for development environment
  - Runtime error overlay
  - Cartographer for code navigation
  - Dev banner for development mode

### Key NPM Packages

**UI Framework:**
- Radix UI primitives (30+ component packages) for accessible components
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- Lucide React for icons

**Data & Forms:**
- React Hook Form with Zod resolvers for form validation
- Drizzle ORM and Drizzle Zod for schema validation
- TanStack React Query for data fetching

**Utilities:**
- date-fns for date manipulation
- clsx and tailwind-merge for className handling
- class-variance-authority for component variants

**Session & Security:**
- express-session with connect-pg-simple store
- Session data persisted in PostgreSQL

### Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string for Neon database
- `NODE_ENV` - Environment mode (development/production)

Optional (for social platform integrations):
- OAuth credentials for Meta, Twitter, LinkedIn (not yet configured)

### Build & Deployment

**Development:**
- Concurrent client (Vite) and server (tsx) processes
- Hot module replacement for rapid iteration
- TypeScript compilation checking without emit

**Production:**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.js`
- Static file serving from built client
- Node.js server execution