# Feature Specification: The Realm Atlas

**Feature Branch**: `001-realm-atlas`
**Created**: 2026-05-05
**Status**: Draft
**Input**: User description: "I want to build a project called The Realm Atlas, a full-stack web application designed for Dungeon Masters to manage a living, evolving campaign world. The app will allow users to create a world, organize it into regions, and add events that can change over time based on user interaction or inaction. Each event will have a status (such as active, resolved, or ignored) and may include branching outcomes that affect the state of the world. The system will include user authentication, a database to store worlds, regions, events, and outcomes, and a RESTful API to handle CRUD operations and filtering (such as viewing events by region or status). The frontend will provide a dashboard-style interface where users can navigate regions, manage events, and update their progression. The goal is to create a structured but flexible tool that demonstrates full-stack development concepts including database design, API development, state management, and user interaction."

## Clarifications

### Session 2026-04-28

- Q: Password Security Requirements → A: Minimum 8 characters with at least one number and one letter
- Q: Event Status Transition Rules → A: Allow any status change (active ↔ resolved ↔ ignored freely)
- Q: Outcome-to-Status Relationship → A: Manual: marking outcome as "occurred" does NOT automatically change event status
- Q: Dashboard Overview Content → A: World list with counts: world name, total events, active events count per world
- Q: Account Deletion and Data Retention → A: Account deletion available, removes all user data permanently (no recovery)

### Session 2026-04-30

- Q: Database Technology Selection → A: PostgreSQL
- Q: Server-Side Rendering Framework → A: Next.js (React-based SSR framework with API routes and hybrid rendering)
- Q: Authentication Implementation Strategy → A: NextAuth.js with Credentials Provider for username/password authentication
- Q: Database ORM/Query Layer → A: Prisma ORM for type-safe database access and schema management
- Q: UI Component & Styling Strategy → A: Tailwind CSS with shadcn/ui component library for dashboard interface

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication (Priority: P1)

Dungeon Masters need to create personal accounts and securely log in to access their campaign worlds. Each user's worlds, regions, and events should be private to their account, ensuring campaign data remains isolated and secure.

**Why this priority**: This is foundational infrastructure. Without authentication, the application cannot support multiple users or protect campaign data. All other features depend on user identity.

**Independent Test**: Can be fully tested by registering a new account, logging out, and logging back in successfully. Delivers secure access control to the application.

**Acceptance Scenarios**:

1. **Given** a new user visits the application, **When** they provide valid credentials (unique username and password with minimum 8 characters including at least one number and one letter), **Then** their account is created and they are logged in to their dashboard
2. **Given** an existing user with valid credentials, **When** they enter their username and password on the login screen, **Then** they are authenticated and see their list of worlds
3. **Given** a user enters incorrect credentials, **When** they attempt to login, **Then** they see an error message "Invalid credentials" and remain on the login screen
4. **Given** a user tries to register with a username already in use, **When** they submit registration, **Then** they see an error message "Username already exists"
5. **Given** a user provides a password that doesn't meet requirements (less than 8 characters or missing number/letter), **When** they attempt registration, **Then** they see a validation error "Password must be at least 8 characters with at least one number and one letter"
6. **Given** a logged-in user, **When** they log out, **Then** their session ends and they are redirected to the login page
7. **Given** an unauthenticated user, **When** they attempt to access protected pages directly, **Then** they are redirected to the login page
8. **Given** a logged-in user accesses account settings, **When** they request account deletion and confirm, **Then** their account and all associated data (worlds, regions, events, outcomes) are permanently deleted with no recovery option

---

### User Story 2 - Create and Manage Campaign Worlds (Priority: P1)

Dungeon Masters can create multiple campaign worlds (e.g., "Forgotten Realms Campaign", "Homebrew World"), each with a name and description. They can view a list of all their worlds, select a world to manage, and delete worlds they no longer need.

**Why this priority**: This is the core container for all campaign content. A Dungeon Master needs at least one world to organize their campaign, making this the minimum viable product.

**Independent Test**: Can be fully tested by creating a new world with a name and description, viewing it in the world list, and editing or deleting it. Delivers immediate value as a campaign organizer.

**Acceptance Scenarios**:

1. **Given** an authenticated user on their dashboard, **When** they create a new world with name "Forgotten Realms Campaign" and description "Standard D&D setting", **Then** the world is saved and appears in their worlds list
2. **Given** a user has multiple worlds, **When** they view their dashboard, **Then** they see all their worlds listed with names, total event counts, and active event counts (e.g., "Forgotten Realms Campaign - 15 events (8 active)")
3. **Given** a user selects a world, **When** they click on it, **Then** they are taken to the world detail view showing regions and events
4. **Given** a user has a world, **When** they edit the world name or description, **Then** the changes are saved and reflected immediately
5. **Given** a user has a world, **When** they delete it, **Then** the world and all its regions and events are permanently removed
6. **Given** a user tries to create a world without a name, **When** they submit the form, **Then** they see a validation error "World name is required"

---

### User Story 3 - Organize Worlds into Regions (Priority: P1)

Within each world, Dungeon Masters can create regions (e.g., "Waterdeep", "The Underdark", "Sword Coast") to organize geographic or thematic areas. Each region has a name and optional description. They can view all regions within a world and delete regions as needed.

**Why this priority**: Regions provide essential organizational structure for events. Without regions, events would be unorganized and difficult to navigate. This completes the basic hierarchy needed for the MVP.

**Independent Test**: Can be fully tested by creating a world, adding regions to it, viewing the regions, and deleting a region. Delivers structured organization for campaign locations.

**Acceptance Scenarios**:

1. **Given** a user is viewing a world, **When** they create a new region with name "Waterdeep" and description "City of Splendors", **Then** the region is saved and appears in the world's region list
2. **Given** a world has multiple regions, **When** the user views the world, **Then** they see all regions listed with names and event counts (e.g., "Waterdeep (3 events)")
3. **Given** a user selects a region, **When** they click on it, **Then** they see all events associated with that region
4. **Given** a user has a region, **When** they edit the region name or description, **Then** the changes are saved and reflected immediately
5. **Given** a user has a region with events, **When** they delete the region, **Then** they see a confirmation prompt warning that all events will also be deleted
6. **Given** a user confirms region deletion, **When** the deletion proceeds, **Then** the region and all its events are permanently removed

---

### User Story 4 - Create and View Events (Priority: P2)

Dungeon Masters can add events to regions to track campaign developments (e.g., "Goblin raids on trade routes", "Political uprising in the palace"). Each event has a title, description, and status (active, resolved, or ignored). They can view all events within a region or across all regions, and filter events by status.

**Why this priority**: This is the core tracking feature that delivers the primary value proposition. Events are what make the world "living and evolving." This builds directly on the P1 foundation.

**Independent Test**: Can be fully tested by creating events in a region, viewing them in a list, and filtering by status. Delivers the core campaign tracking functionality.

**Acceptance Scenarios**:

1. **Given** a user is viewing a region, **When** they create a new event with title "Goblin raids", description "Trade routes are under attack", and status "active", **Then** the event is saved and appears in the region's event list
2. **Given** a region has multiple events, **When** the user views the region, **Then** they see all events with their titles, descriptions, and status indicators
3. **Given** a user is viewing their world, **When** they filter events by status "active", **Then** they see only events with active status across all regions
4. **Given** a user is viewing events, **When** they filter by region "Waterdeep", **Then** they see only events from that specific region
5. **Given** a user has created an event, **When** they view the event details, **Then** they see the full title, description, status, and creation date
6. **Given** a user tries to create an event without a title, **When** they submit the form, **Then** they see a validation error "Event title is required"

---

### User Story 5 - Update Event Status and Track Progression (Priority: P2)

Dungeon Masters can update the status of events as the campaign progresses. They can freely change an event between "active", "resolved", and "ignored" states at any time, allowing flexibility to adjust event tracking as the campaign evolves. The system tracks when status changes occur to maintain campaign history.

**Why this priority**: This enables the "evolving world" concept where events change based on player interaction. It's essential for tracking campaign progression and demonstrates state management.

**Independent Test**: Can be fully tested by creating an active event, changing its status to resolved, changing it back to active, and verifying all changes are saved with timestamps. Delivers dynamic campaign tracking.

**Acceptance Scenarios**:

1. **Given** a user is viewing an active event, **When** they update the status to "resolved", **Then** the event status changes and displays as resolved
2. **Given** a user updates an event status, **When** they save the change, **Then** the timestamp of the status change is recorded
3. **Given** a user views an event's history, **When** they check the timeline, **Then** they see when the event was created and when its status last changed
4. **Given** a user has resolved events, **When** they filter by "resolved" status, **Then** they see only events marked as resolved
5. **Given** a user changes an event status multiple times, **When** they view the event, **Then** the current status accurately reflects the most recent change
6. **Given** a user has a resolved event, **When** they change it back to "active", **Then** the status update is saved and the event appears in active filters

---

### User Story 6 - Branching Outcomes for Events (Priority: P3)

Dungeon Masters can define multiple potential outcomes for each event, representing different ways the situation could evolve based on player choices. Each outcome has a description and can be marked as "occurred" when it happens in the campaign. Marking outcomes as occurred does not automatically change the event status, giving DMs flexibility to track outcomes independently from event resolution.

**Why this priority**: This is an advanced feature that enhances campaign planning but isn't essential for basic tracking. It adds sophisticated scenario planning capabilities for experienced DMs.

**Independent Test**: Can be fully tested by creating an event, adding multiple potential outcomes, marking one as occurred, and verifying the event status remains unchanged. Delivers advanced scenario planning functionality.

**Acceptance Scenarios**:

1. **Given** a user is viewing an event, **When** they add an outcome with description "Players negotiate peace", **Then** the outcome is saved and listed under the event
2. **Given** an event has multiple outcomes, **When** the user views the event, **Then** they see all potential outcomes with their descriptions
3. **Given** a user selects one outcome, **When** they mark it as "occurred", **Then** that outcome is highlighted but the event status remains unchanged
4. **Given** an event has outcomes, **When** the user marks one as occurred, **Then** other outcomes remain visible and can still be marked as "occurred" or remain "not taken"
5. **Given** a user views their world, **When** they look at events with outcomes, **Then** they can see which outcomes occurred regardless of the event's current status
6. **Given** a user marks multiple outcomes as "occurred", **When** they view the event, **Then** all marked outcomes are highlighted (supporting complex scenarios where multiple paths happen)

---

### Edge Cases

- What happens when a user tries to delete a world with many regions and events? (Confirmation required with count of items to be deleted)
- How does the system handle events without a region assigned? (System requires region selection during event creation)
- What happens if a user tries to access another user's world directly? (Access denied, redirected to own dashboard)
- How does the system handle very long event descriptions? (Character limit of 2000 characters enforced with validation)
- What happens when multiple outcomes are marked as "occurred" for the same event? (System allows this for complex scenarios where multiple outcomes happen; event status remains independent and must be updated manually)
- How does filtering work when a user has no events matching the criteria? (Display "No events found" message with clear filter status)
- What happens if a user's session expires while editing an event? (Changes are lost, user is redirected to login with message "Session expired")
- What happens when a user deletes their account? (All user data including worlds, regions, events, and outcomes are permanently deleted immediately with confirmation prompt; no recovery mechanism)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to register accounts with unique usernames and passwords (minimum 8 characters with at least one number and one letter)
- **FR-002**: System MUST authenticate users before granting access to any campaign data
- **FR-003**: System MUST ensure users can only access their own worlds, regions, and events
- **FR-004**: System MUST allow users to create, view, edit, and delete campaign worlds
- **FR-005**: System MUST allow users to create, view, edit, and delete regions within worlds
- **FR-006**: System MUST allow users to create, view, edit, and delete events within regions
- **FR-007**: System MUST support three event statuses: active, resolved, and ignored
- **FR-008**: System MUST allow users to freely change event status between any states (active, resolved, ignored) at any time
- **FR-009**: System MUST timestamp all status changes for historical tracking
- **FR-010**: System MUST allow users to filter events by region
- **FR-011**: System MUST allow users to filter events by status
- **FR-012**: System MUST allow users to define multiple potential outcomes for each event
- **FR-013**: System MUST allow users to mark outcomes as "occurred" or "not taken"
- **FR-014**: System MUST validate required fields (world name, region name, event title)
- **FR-015**: System MUST provide confirmation prompts before deleting worlds or regions with content
- **FR-016**: System MUST persist all data permanently until explicitly deleted by the user
- **FR-017**: System MUST display event counts within each region for quick overview
- **FR-018**: System MUST enforce character limits on text fields (titles: 100 characters, descriptions: 2000 characters)
- **FR-019**: System MUST redirect unauthenticated users to login page when accessing protected resources
- **FR-020**: System MUST allow users to log out and end their session securely
- **FR-021**: System MUST allow users to delete their account, permanently removing all associated data (worlds, regions, events, outcomes) with confirmation prompt and no recovery mechanism

### Key Entities

- **User**: Represents a Dungeon Master with unique username, secure password credentials, and ownership of all campaign data
- **World**: Represents a campaign setting owned by a User. Contains a name (required), description (optional), creation timestamp, and one-to-many relationship with Regions
- **Region**: Represents a geographic or thematic area within a World. Contains a name (required), description (optional), and one-to-many relationship with Events. Belongs to exactly one World
- **Event**: Represents a campaign development or situation within a Region. Contains a title (required), description (required), status (active/resolved/ignored), creation timestamp, status update timestamp, and one-to-many relationship with Outcomes. Belongs to exactly one Region
- **Outcome**: Represents a potential result or consequence for an Event. Contains a description (required), occurrence status (occurred/not taken), and belongs to exactly one Event

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can create a complete campaign structure (world → regions → events) in under 5 minutes
- **SC-002**: Users can filter and view events by region or status with results appearing in under 2 seconds
- **SC-003**: System maintains data integrity with zero data loss when users navigate between pages or refresh the browser
- **SC-004**: Users can update event status with changes visible immediately without page reload
- **SC-005**: Dashboard displays each world with its name, total event count, and active event count without requiring additional clicks or navigation
- **SC-006**: 90% of users successfully create their first world and event within their first session
- **SC-007**: System supports at least 50 concurrent users managing their campaigns simultaneously
- **SC-008**: All forms provide clear validation feedback within 1 second of user input
- **SC-009**: Users can navigate from dashboard to specific event details in 3 clicks or fewer
- **SC-010**: Deletion operations complete with confirmation in under 3 seconds

### Assumptions

- Users are Dungeon Masters familiar with tabletop role-playing games and campaign management concepts
- Users will primarily access the system from desktop/laptop devices (mobile optimization is not a priority for v1)
- Users are comfortable with English-language interfaces
- Average campaign will contain 1-5 worlds, 5-20 regions per world, and 10-50 events per region
- Users will manage their own campaigns independently without real-time collaboration features
- Session timeout follows standard web application practices (30 minutes of inactivity)
- Username/password authentication is an acceptable security level; multi-factor authentication is not required for v1
- Data backup and export features are not required for the initial version
- Account deletion is permanent with no recovery mechanism; users accept responsibility for backing up campaign data before deletion
- Users accept that data is stored on hosted servers without offline access
