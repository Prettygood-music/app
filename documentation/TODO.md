# prettygood.music MVP TODO List

## Current Project Status

### ✅ Frontend Structure and Routes
- SvelteKit app structure is in place
- Using Svelte 5 with runes API
- Routes implemented for:
  - Home page with recommended content (using placeholder data)
  - Album detail pages with track listings
  - Artist profile pages with albums and tracks
  - Track pages
- UI components following Atomic Design principles
- TailwindCSS + shadcn components for styling

### ✅ Player Implementation
- Basic audio player functionality implemented
- Player state management using Svelte 5 reactive state
- Player UI components (player bar, controls)
- Queue management functionality
- Playback controls (play/pause, seek, volume)

### ✅ API Structure
- Hono.js API routes integrated within SvelteKit
- API endpoints for:
  - Artists
  - Albums
  - Tracks
  - Recommendations
- Catchall API route in SvelteKit for handling requests

### ✅ Database Schema
- PostgreSQL schema design completed
- Migrations for all tables created
- Row-Level Security policies implemented
- PostgREST API functions established
- Authentication system designed
- Sample data for development created
- Database teardown and reset scripts implemented
- Seed data system for development and testing
- pgTAP tests for database structure and functionality
- Docker containerization with PostgreSQL, pgTAP, and PostgREST
- TypeScript type generation from database schema

### ⚠️ Partial Implementations / Gaps
- Data is largely placeholder/mock data
- Authentication with Sui wallet not fully implemented
- Blockchain integration for tipping not wired up
- Search functionality is basic/placeholder
- Library management incomplete

## MVP TODO List (Prioritized)

### 1. Data Integration (2 weeks)

#### Connect Real Data Sources
- [x] Create database schema and migrations
- [x] Set up PostgreSQL with PostgREST
- [x] Implement Row-Level Security policies
- [x] Create API functions for core functionality
- [x] Create database reset and seed system
- [x] Build pgTAP tests for database validation
- [x] Dockerize database with all dependencies
- [x] Generate TypeScript types from database schema
- [ ] Replace placeholder data with real API responses
- [ ] Implement proper error handling for API requests
- [ ] Add loading states for data fetching
- [ ] Create data caching strategy

#### Search Implementation
- [x] Create database structure for search
- [ ] Enhance search endpoint with filtering capabilities
- [ ] Build advanced search UI with filters
- [ ] Implement search results page with categorized results
- [ ] Add search history and suggestions

#### Content Discovery Improvements
- [x] Create recommendation query functions
- [ ] Implement genre-based browsing
- [ ] Add "New Releases" section with real data
- [ ] Create "Featured Artists" section
- [ ] Build dynamic recommendation algorithm

### 2. Authentication Flow (1 week)

#### Sui Wallet Integration
- [x] Design database authentication system
- [x] Create JWT token generation functions
- [ ] Complete wallet connection component
- [ ] Implement message signing for authentication
- [ ] Create proper authentication store
- [ ] Add login/logout flow

#### User Profiles
- [x] Set up user tables and relationships
- [ ] Implement user settings page
- [ ] Add profile editing capabilities
- [ ] Create user avatar handling
- [ ] Implement preferences storage

### 3. Library Management (1.5 weeks)

#### User Library
- [x] Create library database structure
- [ ] Build "Add to Library" functionality
- [ ] Implement "Saved Tracks" view
- [ ] Create "Saved Albums" view
- [ ] Add library management UI

#### Playlist Features
- [x] Create playlist database structure
- [ ] Complete playlist creation functionality
- [ ] Implement playlist editing
- [ ] Add track reordering via drag and drop
- [ ] Build collaborative playlist features

### 4. Blockchain Integration (1.5 weeks)

#### Artist Tipping
- [x] Create payment tables and functions
- [ ] Complete Sui wallet integration for payments
- [ ] Implement tipping UI with amount selection
- [ ] Create transaction signing flow
- [ ] Add transaction history view

#### Royalty Tracking
- [x] Set up play count and payment tracking
- [ ] Implement play count tracking
- [ ] Build artist earnings dashboard
- [ ] Create payment history view
- [ ] Add analytics for artists

### 5. Audio Experience Enhancement (1 week)

#### Advanced Playback Features
- [x] Create user settings for audio preferences
- [ ] Implement gapless playback
- [ ] Add crossfade functionality
- [ ] Create audio equalizer
- [ ] Build visualizations for audio playback

#### Offline Capabilities
- [ ] Implement track caching for offline playback
- [ ] Add download management
- [ ] Create offline mode detection
- [ ] Build sync mechanism for offline changes

### 6. Mobile Experience (1 week)

#### Responsive Enhancements
- [ ] Optimize mobile player controls
- [ ] Implement mobile-specific navigation
- [ ] Create touch-friendly interfaces
- [ ] Test and fix responsive issues

#### Progressive Web App
- [ ] Configure service worker
- [ ] Add app manifest
- [ ] Implement install prompts
- [ ] Create offline fallbacks

### 7. Polish & Performance (1 week)

#### Performance Optimization
- [ ] Audit and optimize bundle size
- [ ] Implement code splitting
- [ ] Add image lazy loading and optimization
- [ ] Optimize audio streaming quality selection

#### Final QA & Testing
- [x] Create database reset and seed for testing
- [x] Implement pgTAP tests for database components
- [x] Set up Docker container for database testing
- [x] Configure TypeScript type generation for better type safety
- [ ] Create end-to-end tests for critical flows
- [ ] Test cross-browser compatibility
- [ ] Validate performance metrics
- [ ] Conduct user acceptance testing

## Immediate Next Steps

1. **Database and Type Integration**
   - Run migrations to set up the database
   - Generate TypeScript types from the database schema
   - Integrate generated types into frontend components
   - Connect PostgREST to the PostgreSQL database
   - Configure API endpoints in Hono.js to use PostgREST
   - Use the Docker database containers for development

2. **Testing Pipeline**
   - Integrate database Docker containers into CI/CD pipeline
   - Set up automated tests to run on every pull request
   - Create additional pgTAP tests for new database functionality
   - Implement end-to-end tests for critical app flows
   - Set up automatic type generation in the CI pipeline

3. **Replace Placeholder Data**
   - Connect the home page recommendations to real API data
   - Implement proper data loading for album and artist pages
   - Add error states and loading indicators
   - Use generated TypeScript types for API responses

4. **Complete Authentication Flow**
   - Finish the Sui wallet integration
   - Implement proper login/logout functionality
   - Create protected routes for user-specific content

## Technical Considerations

1. **Type Safety**
   - Use generated TypeScript types for database models
   - Ensure consistent typing between database and API layers
   - Keep types up-to-date with database schema changes
   - Use type generation as part of the CI/CD pipeline

2. **Docker Development Environment**
   - Use Docker for consistent development environments
   - Run database services in Docker containers
   - Leverage PostgREST for API access to the database
   - Use pgAdmin for database administration

3. **State Management**
   - Continue using Svelte 5 runes for component-level state
   - Ensure proper state persistence for user preferences
   - Implement caching strategy for API responses

4. **Development Workflow**
   - Use Docker-based database reset and seed system for consistent development
   - Reset the database to a known state for testing
   - Create seed data for specific test scenarios
   - Run pgTAP tests to ensure database integrity
   - Generate types after schema changes

5. **Testing Strategy**
   - Use pgTAP in Docker for database unit testing
   - Use Vitest for frontend unit testing
   - Use Playwright for end-to-end testing
   - Implement continuous integration for all test types

6. **Audio Optimization**
   - Optimize audio loading for faster initial playback
   - Implement adaptive quality for different network conditions
   - Add proper error handling for audio playback issues

7. **Blockchain Integration**
   - Keep blockchain interactions minimal and focused on key features (tipping, authentication)
   - Ensure wallet connections are secure and properly handled
   - Provide clear feedback for blockchain transactions

8. **Database Security**
   - Ensure Row-Level Security policies are correctly implemented
   - Regularly rotate JWT secrets
   - Implement proper error handling for database operations
   - Monitor database performance and optimize as needed

9. **Performance**
   - Focus on Time to Interactive metrics for initial page load
   - Implement lazy loading for off-screen content
   - Optimize audio and image assets for faster loading
