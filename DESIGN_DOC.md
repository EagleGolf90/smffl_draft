# SMFFL Draft Board - Design Document

**Version:** 1.0  
**Date:** July 12, 2026  
**Project:** SMFFL Fantasy Football Draft Application

---

## Executive Summary

The SMFFL Draft Board is a web-based fantasy football draft management application designed for live draft events. It provides an interactive draft board with real-time timer synchronization, player tracking, and multi-window support. The application enables commissioners and participants to conduct organized drafts with visual feedback, audio alerts, and automatic state management.

### Key Features

- **Interactive Draft Board**: Visual grid displaying all teams and their picks
- **Snake Draft Support**: Automatic calculation of draft order for snake-style drafts
- **Multi-Window Architecture**: Separate synchronized windows for timer and player lists
- **Real-time Synchronization**: Cross-window communication using BroadcastChannel API
- **Persistent State Management**: Automatic draft state saving via localStorage
- **Save/Load Draft**: Export draft to JSON file and import saved drafts
- **Player Database**: Pre-loaded roster of 200+ fantasy football players
- **Position Filtering**: Quick access to available players by position
- **Audio Alerts**: Timer warnings at critical intervals

---

## System Architecture

### Technology Stack

- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript (ES6+)
- **Data Storage**: Browser localStorage for persistent state
- **Communication**: BroadcastChannel API for cross-window messaging
- **Architecture Pattern**: Event-driven, component-based vanilla JS

### Application Structure

```
┌─────────────────────────────────────────────────────┐
│                 Main Draft Board                     │
│              (index.html + draft.js)                 │
│                                                      │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────┐│
│  │ Draft Info   │  │ Controls   │  │ Team Grid   ││
│  │ Display      │  │ & Inputs   │  │ (12 teams)  ││
│  └──────────────┘  └────────────┘  └─────────────┘│
└──────────────┬───────────┬───────────────────────────┘
               │           │
               │           │ BroadcastChannel
               │           │ + localStorage
               │           │
       ┌───────▼───┐   ┌──▼──────────┐
       │   Timer   │   │   Players   │
       │  Window   │   │   Window    │
       │(timer.html)│   │(players.html)│
       └───────────┘   └─────────────┘
```

### File Structure

```
draft/
├── index.html              # Main draft board interface
├── players.html            # Available players list window
├── timer.html              # Draft timer display window
├── Readme.md              # Project documentation
├── css/
│   ├── styles.css         # Main draft board styles
│   └── players.css        # Players list styles
├── data/
│   └── teamNames.json     # Team names configuration
├── js/
│   ├── draft.js           # Main draft logic and state management
│   ├── teamNames.js       # Team names loader
│   ├── availablePlayers.js # Player database (200+ players)
│   └── players.js         # Players list window logic
└── images/                 # (Reserved for team logos/assets)
```

---

## Core Features & Functionality

### 1. Draft Board Management

**Purpose**: Central interface for conducting the fantasy football draft

**Features**:

- Visual grid displaying all 12 teams in two rows (6 teams each)
- Round-by-round pick display with color-coded positions
- Active team highlighting with pulse animation
- Current pick/round/team information header
- Responsive auto-scrolling to keep active team visible

**User Interactions**:

- Select position from dropdown (shows available count)
- Select player from filtered list based on position
- Click "Add Pick" to record selection
- Click "Undo Last Pick" to revert mistakes
- Click "Reset Draft" to clear all picks and restart

### 2. Snake Draft Order

**Purpose**: Automatically calculate pick order for snake-style drafts

**Logic**:

- **Odd Rounds** (1, 3, 5...): Teams pick in order 1→12
- **Even Rounds** (2, 4, 6...): Teams pick in reverse 12→1
- Configurable via `draftState.snakeOrder` boolean flag
- Alternative: Linear draft (always 1→12)

**Example Snake Pattern (12 teams)**:

```
Round 1:  Team 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
Round 2:  Team 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
Round 3:  Team 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
...
```

### 3. Timer Window

**Purpose**: Large-display countdown timer for group visibility

**Features**:

- Full-screen countdown display (8em font)
- Current team "on the clock" display
- Pick and round number information
- Visual warnings:
  - **Normal**: White text on purple gradient
  - **30 seconds**: Yellow text with pulse animation
  - **10 seconds**: Red text with rapid pulse
- Audio beeps at 30s, 10s, and expiration
- Synchronized with main board via BroadcastChannel

**Controls**:

- Start/Pause button
- Reset button
- Sound toggle (mute/unmute)
- Request sync button (fetches current state from main board)

### 4. Players List Window

**Purpose**: Reference window for tracking available/drafted players

**Features**:

- Search bar for player name filtering
- Position filter buttons (ALL, QB, RB, WR, TE, DEF, K)
- Player cards with position badges
- Visual "DRAFTED" indicator on selected players
- Real-time sync with draft board (5-second polling)
- Player count statistics (showing/total)

**Design**:

- Color-coded position badges matching draft board
- Greyed-out cards for drafted players
- Responsive grid layout
- Empty state when no players match filters

### 5. State Management

**Purpose**: Preserve draft progress across browser refreshes and window closures

**Persistent Data** (localStorage):

```javascript
draftState = {
    numTeams: 12,              // Number of teams (configurable)
    timeLimit: 120,            // Timer duration in seconds
    snakeOrder: true,          // Snake vs. linear draft
    currentPick: 1,            // Overall pick number
    currentRound: 1,           // Current round
    picks: [],                 // Array of all picks made
    availablePlayers: [...],   // Remaining undrafted players
    draftedPlayers: [],        // Array of drafted player names
    isTimerRunning: false,     // Timer state
    timeRemaining: 120         // Current countdown value
}
```

**Synchronization Keys**:

- `draftState` - Main state object (JSON)
- `draftCurrentTeam` - Current team name (string)
- `draftCurrentPick` - Pick number (string)
- `draftCurrentRound` - Round number (string)
- `draftedPlayers` - JSON array of drafted players

### 6. Save/Load Draft (JSON Export/Import)

**Purpose**: Allow users to save draft state to a file and load it later

**Features**:

- **Export to JSON**: Downloads complete draft state as a JSON file
- **Import from JSON**: Loads previously saved draft from file
- **Data Validation**: Verifies file format before importing
- **User Confirmation**: Prompts before overwriting current draft
- **Timestamped Filenames**: Auto-generates filename with date and time
- **Complete State Preservation**: Saves all picks, team names, and settings

**Export Data Structure**:

```javascript
{
    version: "1.0",
    timestamp: "2026-07-12T10:30:00.000Z",
    exportDate: "7/12/2026, 10:30:00 AM",
    draftState: {
        numTeams: 12,
        currentPick: 25,
        currentRound: 3,
        picks: [...],
        // ... all state properties
    },
    teamNames: [...]
}
```

**User Interactions**:

- Click "💾 Save Draft" to download current draft as JSON file
- Click "📂 Load Draft" to select and import a saved draft file
- Confirmation dialog shows draft details before import
- Success/error messages provide feedback

**File Format**: `smffl-draft-YYYY-MM-DD-HH-MM-SS.json`

**Use Cases**:

- Backup draft progress during long drafts
- Share draft results with league members
- Archive completed drafts for future reference
- Transfer draft between devices
- Recover from accidental reset or browser issues

### 7. Cross-Window Communication

**Purpose**: Keep multiple windows synchronized in real-time

**Technology**: BroadcastChannel API with localStorage fallback

**Message Types**:

```javascript
// Timer control messages
{ action: 'start' }                    // Start timer
{ action: 'pause' }                    // Pause timer
{ action: 'reset' }                    // Reset timer to timeLimit
{ action: 'sync', timeRemaining: 120 } // Sync current time

// State update messages
{
    action: 'update-team',
    teamName: 'Team 1',
    pickNumber: 1,
    roundNumber: 1
}

// Timer window requests
{ action: 'request-sync' }             // Request current state
```

**Channel Name**: `'draft-timer'`

---

## Data Model

### Team Configuration

**Source**: `data/teamNames.json`

**Structure**:

```json
{
    "teams": [
        "Team Name 1",
        "Team Name 2",
        "Team Name 3",
        ...
        "Team Name 12"
    ]
}
```

**Fallback**: If JSON fails to load, generates default names: "Team 1", "Team 2", etc.

### Player Database

**Source**: `js/availablePlayers.js`

**Structure**:

```javascript
const availablePlayers = [
    { name: "Christian McCaffrey", position: "RB" },
    { name: "Tyreek Hill", position: "WR" },
    { name: "Josh Allen", position: "QB" },
    ...
]
```

**Positions**:

- **QB**: Quarterback (Red)
- **RB**: Running Back (Blue)
- **WR**: Wide Receiver (Green)
- **TE**: Tight End (Orange)
- **K**: Kicker (Purple)
- **DEF**: Defense (Dark Gray)

**Player Count**: 200+ players across all positions

### Pick Data Structure

**Format**:

```javascript
{
    pickNumber: 1,              // Overall pick number
    round: 1,                   // Round number
    team: 1,                    // Team number (1-12)
    player: "Christian McCaffrey",
    position: "RB"
}
```

**Storage**: Appended to `draftState.picks` array

### Roster Requirements

**Configured Limits** (stored in `rosterRequirements` object):

```javascript
{
    QB: 2,      // 2 Quarterbacks
    RB: 4,      // 4 Running Backs
    WR: 2,      // 2 Wide Receivers
    TE: 2,      // 2 Tight Ends
    K: 2,       // 2 Kickers
    DEF: 2      // 2 Defenses
}
```

**Note**: Currently displayed but not enforced in the UI

---

## Technical Implementation Details

### Core Functions (draft.js)

#### State Management

```javascript
initializeDraft(); // Load state, populate dropdowns, render UI
loadDraftState(); // Read from localStorage
saveDraftState(); // Write to localStorage
syncToLocalStorage(); // Sync specific keys for timer window
```

#### Draft Logic

```javascript
getCurrentTeam(); // Calculate active team based on pick/round/snake
addPick(); // Record player selection, update state
undoPick(); // Remove last pick, restore player availability
resetDraft(); // Clear all picks, reset to initial state
```

#### UI Updates

```javascript
updateDraftInfo(); // Refresh header (pick/round/team)
updateTeamColumns(); // Rebuild team grid based on numTeams
renderAllPicks(); // Populate all pick cells from state
populatePositionDropdown(); // Build position select with counts
populatePlayerDropdown(); // Build player select for chosen position
```

#### Timer Management

```javascript
startTimer(); // Begin countdown, broadcast to timer window
pauseTimer(); // Stop countdown
resetTimer(); // Reset to timeLimit (120s default)
tickTimer(); // Decrement timeRemaining, check for alerts
```

#### Player Management

```javascript
filterAvailablePlayers(); // Remove drafted players from pool
isPlayerDrafted(); // Check if player already selected
getPositionColor(); // Return CSS class for position badge
```

### Event Listeners

**Main Draft Board**:

```javascript
// DOM Ready
document.addEventListener("DOMContentLoaded", initializeDraft);

// Position selection changes player dropdown
positionSelect.addEventListener("change", populatePlayerDropdown);

// Add pick on button click or Enter key
addPickBtn.addEventListener("click", addPick);
playerSelect.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addPick();
});

// Window buttons
openTimerBtn.addEventListener("click", openTimerWindow);
openPlayersBtn.addEventListener("click", openPlayersWindow);

// Undo and reset
undoBtn.addEventListener("click", undoPick);
resetBtn.addEventListener("click", resetDraft);
```

**Timer Window**:

```javascript
// Request state sync on load
window.addEventListener("load", requestSync);

// Control buttons
startBtn.addEventListener("click", sendStartMessage);
pauseBtn.addEventListener("click", sendPauseMessage);
resetBtn.addEventListener("click", sendResetMessage);

// BroadcastChannel messages
timerChannel.onmessage = handleTimerMessage;
```

**Players Window**:

```javascript
// Search input
searchInput.addEventListener("input", filterAndRenderPlayers);

// Position filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", setActiveFilter);
});

// Storage changes (cross-tab sync)
window.addEventListener("storage", (e) => {
  if (e.key === "draftedPlayers") refreshPlayers();
});

// Auto-refresh polling
setInterval(checkForUpdates, 5000);
```

### CSS Architecture

**Color Scheme**:

- **Primary**: Purple gradient (#667eea → #764ba2)
- **Positions**:
  - QB: `#dc3545` (Red)
  - RB: `#007bff` (Blue)
  - WR: `#28a745` (Green)
  - TE: `#fd7e14` (Orange)
  - K: `#6f42c1` (Purple)
  - DEF: `#343a40` (Dark Gray)

**Key Classes**:

- `.team-column.active` - Highlighted current team
- `.pulse` - Animation for team turn changes
- `.position-badge` - Colored position indicators
- `.timer-display.warning` - Yellow at 30s
- `.timer-display.danger` - Red at 10s
- `.drafted` - Greyed out drafted players

**Layout**:

- Main board: CSS Grid (2 rows × 6 columns)
- Players list: Flexbox with wrapping cards
- Timer: Flexbox centering with viewport height

### Browser Compatibility

**Required Features**:

- ES6+ JavaScript (arrow functions, destructuring, template literals)
- CSS Grid and Flexbox
- localStorage API
- BroadcastChannel API (with graceful degradation)
- Audio API (for timer beeps)

**Tested Browsers**:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Fallback Behavior**:

- If BroadcastChannel unavailable, timer window relies on localStorage polling
- Audio beeps can be disabled if not supported

---

## User Workflows

### Starting a New Draft

1. Open `index.html` in browser
2. Application loads team names from `teamNames.json`
3. Draft state initializes with defaults or loads saved state
4. Click "Open Timer Window" to launch timer display
5. Click "Open Players" to launch player reference
6. Configure settings if needed (currently hardcoded)
7. Begin drafting

### Making a Pick

1. Select position from dropdown (e.g., "RB")
2. Player dropdown populates with available RBs
3. Select player name
4. Click "Add Pick" or press Enter
5. System:
   - Adds pick to current team's column
   - Removes player from available pool
   - Advances to next team/round
   - Updates active team highlight
   - Saves state to localStorage
   - Broadcasts update to other windows
6. Timer resets to 120 seconds for next pick

### Using the Timer

1. Timer window shows current team "on the clock"
2. Click "Start Timer" to begin countdown
3. Visual warnings appear at 30s (yellow) and 10s (red)
4. Audio beeps play at 30s, 10s, and 0s
5. Click "Pause" to stop timer mid-countdown
6. Click "Reset" to return to 120s
7. Timer automatically resets when pick is added on main board

### Undoing a Mistake

1. Realize pick was entered incorrectly
2. Click "Undo Last Pick" on main board
3. System:
   - Removes last pick from display
   - Returns player to available pool
   - Decrements pick/round counters
   - Updates dropdowns to show player again
   - Saves corrected state
4. Re-enter correct pick

### Searching for Players

1. Open Players window
2. Type player name in search bar (live filtering)
3. OR click position filter button (QB, RB, WR, etc.)
4. Drafted players show greyed out with "DRAFTED" label
5. Window auto-refreshes every 5 seconds to stay in sync

---

## Design Decisions & Rationale

### Why Vanilla JavaScript?

**Decision**: Use pure JavaScript without frameworks (React, Vue, etc.)

**Rationale**:

- Lightweight - no dependencies, instant load times
- Simple deployment - single HTML file opens in browser
- Low barrier to entry for modifications
- Sufficient complexity for the scope
- No build process required

### Why BroadcastChannel + localStorage?

**Decision**: Dual synchronization strategy

**Rationale**:

- BroadcastChannel provides instant real-time updates
- localStorage ensures persistence across refreshes
- Fallback support for older browsers
- No server/backend required
- Works offline

### Why Separate Windows?

**Decision**: Timer and players list in separate browser windows

**Rationale**:

- Timer can be displayed on secondary monitor/TV for room visibility
- Players list can be kept open on laptop for quick reference
- Main board stays focused on draft grid
- Each window optimized for its specific purpose
- Participants can share timer URL without seeing picks

### Why 120-Second Fixed Timer?

**Decision**: Hardcoded 2-minute timer with no UI configuration

**Rationale**:

- Standard fantasy football draft pick time
- Simplifies UI (less settings clutter)
- Easy to modify in code if needed
- Consistent experience for all users

### Why Two Rows for 12 Teams?

**Decision**: Display teams in 2 rows of 6 instead of 1 row of 12

**Rationale**:

- Better readability on standard monitors
- Avoids excessive horizontal scrolling
- Keeps team names and picks visible
- Easier to track picks across rounds

---

## Known Limitations & Future Enhancements

### Current Limitations

1. **No Settings UI**: Team count, timer duration, and snake mode are hardcoded
2. **No Keeper Support**: Cannot pre-assign players before draft starts
3. **No Auction Mode**: Only supports snake/linear draft order
4. **No Trade Support**: Cannot swap picks or players mid-draft
5. **No Multi-Draft**: Only one draft can be active per browser
6. **No User Authentication**: Anyone with the URL can view/edit
7. **No Player Images**: Only text display, no photos or logos
8. **No Statistics**: No player projections or previous season stats
9. **No Mobile Optimization**: Best experience on desktop browsers
10. **No Statistics**: No player projections or previous season stats
11. **No Mobile Optimization**: Best experience on desktop browsers

### Future Enhancement Ideas

#### Phase 1: Core Improvements

- [x] Export draft results to JSON (Completed)
- [x] Import draft from JSON file (Completed)
- [ ] Settings modal for team count, timer, snake mode
- [ ] Export draft results to CSV/PDF
- [ ] Print-friendly draft recap page
- [ ] Keeper/auction draft modes
- [ ] Draft history log (all picks chronologically)
- [ ] Team roster summary sidebar

#### Phase 2: Advanced Features

- [ ] Player search on main board (autocomplete input)
- [ ] Custom player rankings import
- [ ] Player news/notes integration
- [ ] Trade/pick swap functionality
- [ ] Multiple saved draft profiles
- [ ] Draft simulation mode (test strategies)

#### Phase 3: Data & Analytics

- [ ] Player statistics and projections display
- [ ] Draft grade calculator (value-based)
- [ ] Position scarcity indicators
- [ ] Team needs suggestions
- [ ] Best available player (BAP) rankings
- [ ] Sleeper/breakout player highlights

#### Phase 4: Collaboration

- [ ] Multi-user real-time collaboration
- [ ] WebSocket/WebRTC for remote drafts
- [ ] Commissioner controls (pause draft, assign picks)
- [ ] Chat/messaging between participants
- [ ] Anonymous draft mode (hide team identities)
- [ ] Video call integration

#### Phase 5: Mobile & UX

- [ ] Responsive mobile design
- [ ] Progressive Web App (PWA) support
- [ ] Touch gestures for mobile picks
- [ ] Dark mode toggle
- [ ] Customizable color themes
- [ ] Keyboard shortcuts

#### Phase 6: Backend Integration

- [ ] Server-side draft state storage
- [ ] User accounts and authentication
- [ ] Draft invitations via email
- [ ] Scheduled draft reminders
- [ ] Integration with fantasy platforms (ESPN, Yahoo, etc.)
- [ ] Automatic league sync

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Players list only renders visible cards (potential future enhancement)
2. **Debounced Search**: Search input uses input event (consider debounce for large datasets)
3. **Minimal Re-renders**: Only update changed DOM elements, not entire board
4. **Event Delegation**: Use event bubbling for dynamic player cards
5. **LocalStorage Throttling**: Save state on change, not on every keystroke

### Scalability

**Current Capacity**:

- 200+ players: Instant performance
- 12 teams × 16 rounds = 192 picks: No noticeable lag
- 3 concurrent windows: Smooth synchronization

**Potential Bottlenecks**:

- 1000+ players: May need virtualized scrolling in players list
- 20+ teams: Would require layout redesign
- 50+ rounds: Pick rendering may slow down

**Mitigation**:

- Pagination for player list
- Virtual scrolling for large datasets
- IndexedDB for massive player databases

---

## Security & Privacy

### Data Storage

**Location**: Browser localStorage (client-side only)

**Risks**:

- Data visible to anyone with device access
- No encryption at rest
- Cleared if user clears browser data

**Mitigations**:

- No sensitive personal information stored
- Draft state is low-risk data (player names only)
- User education on public computer usage

### Cross-Window Communication

**Mechanism**: BroadcastChannel (same-origin only)

**Security**:

- Cannot receive messages from different domains
- No injection risks (messages are structured objects)
- No authentication required (local device only)

### Input Validation

**Current State**:

- Minimal validation (checks for empty player selection)
- No sanitization needed (no user-generated HTML)
- Dropdown-only input prevents injection

**Potential Risks**:

- None identified for current implementation
- If adding text input: XSS risk from player names

---

## Testing Strategy

### Manual Testing Checklist

#### Draft Flow

- [ ] Add pick successfully records player
- [ ] Undo removes last pick correctly
- [ ] Snake order alternates properly on even rounds
- [ ] Reset clears all picks and restores state
- [ ] Draft survives page refresh (state persists)
- [ ] Dropdowns update correctly after each pick

#### Timer Synchronization

- [ ] Timer window receives start/pause/reset commands
- [ ] Main board can control timer window
- [ ] Timer window displays correct team name
- [ ] Audio beeps play at 30s, 10s, and 0s
- [ ] Sound toggle mutes/unmutes alerts
- [ ] Timer resets automatically after pick added

#### Player Tracking

- [ ] Players list marks drafted players correctly
- [ ] Search filters players by name
- [ ] Position filters work for all positions
- [ ] Drafted count updates in real-time
- [ ] Storage polling detects changes from main board

#### UI/UX

- [ ] Active team highlights correctly
- [ ] Pulse animation plays on team change
- [ ] Auto-scroll keeps active team visible
- [ ] Position badges display correct colors
- [ ] Team names load from JSON
- [ ] Responsive layout works on different screen sizes

#### Edge Cases

- [ ] Selecting position with 0 available players
- [ ] Adding pick when all players drafted in position
- [ ] Opening timer window when already open
- [ ] Closing and reopening windows maintains sync
- [ ] Multiple browser tabs/windows stay synchronized
- [ ] localStorage quota exceeded (unlikely but possible)

### Browser Compatibility Testing

Test on:

- [ ] Google Chrome (latest)
- [ ] Mozilla Firefox (latest)
- [ ] Microsoft Edge (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Automated Testing Opportunities

**Unit Tests** (potential additions):

- `getCurrentTeam()` with various pick/round combinations
- Snake order calculation edge cases
- Player filtering and search logic
- State serialization/deserialization

**Integration Tests**:

- End-to-end draft simulation (12 teams, 16 rounds)
- Cross-window message passing
- localStorage read/write operations

**Test Framework Suggestions**:

- Jest for unit tests
- Playwright or Puppeteer for E2E tests

---

## Deployment & Installation

### Local Deployment

**Steps**:

1. Clone or download project files
2. No build process required
3. Open `index.html` in web browser
4. Grant popup permissions for timer/players windows

**Requirements**:

- Modern web browser
- JavaScript enabled
- localStorage enabled
- ~2MB disk space

### Web Server Deployment

**Simple Hosting**:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

**Static Hosting Platforms**:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

**Configuration**:

1. Upload all files to hosting platform
2. Set `index.html` as entry point
3. Enable CORS if loading from subdomain
4. No backend or database required

### Customization Guide

**Change Team Names**:

```json
// Edit data/teamNames.json
{
    "teams": [
        "Your Team Name 1",
        "Your Team Name 2",
        ...
    ]
}
```

**Change Timer Duration**:

```javascript
// Edit js/draft.js, line ~10
const draftState = {
    timeLimit: 180, // Change from 120 to 180 (3 minutes)
    ...
}
```

**Change Number of Teams**:

```javascript
// Edit js/draft.js, line ~9
const draftState = {
    numTeams: 10, // Change from 12 to 10
    ...
}
```

**Add/Remove Players**:

```javascript
// Edit js/availablePlayers.js
const availablePlayers = [
    { name: "New Player", position: "RB" },
    ...
]
```

**Customize Colors**:

```css
/* Edit css/styles.css */
:root {
    --color-qb: #dc3545;  /* Change QB color */
    --color-rb: #007bff;  /* Change RB color */
    ...
}
```

---

## Maintenance & Support

### Version History

- **v1.1** (July 2026): Save/Load Feature
  - JSON export functionality for draft backup
  - JSON import functionality to restore saved drafts
  - Timestamped filenames for easy organization
  - Data validation and user confirmation on import
- **v1.0** (July 2026): Initial release
  - 12-team snake draft support
  - Timer window with audio alerts
  - Players list tracking
  - localStorage persistence
  - BroadcastChannel synchronization

### Change Log Template

```markdown
## [Version] - YYYY-MM-DD

### Added

- New features

### Changed

- Updates to existing features

### Fixed

- Bug fixes

### Removed

- Deprecated features
```

### Bug Reporting

**Information to Collect**:

1. Browser and version
2. Operating system
3. Steps to reproduce
4. Expected vs. actual behavior
5. Console errors (F12 Developer Tools)
6. localStorage contents (if relevant)

### Common Issues & Solutions

**Issue**: Timer window not syncing

- **Solution**: Check BroadcastChannel support, clear localStorage and refresh

**Issue**: Players showing as drafted incorrectly

- **Solution**: Clear localStorage key `draftedPlayers`, refresh players window

**Issue**: Team names not loading

- **Solution**: Verify `teamNames.json` is in `/data/` folder, check console for errors

**Issue**: Undo button not working

- **Solution**: Check if `picks` array exists in localStorage, may need to reset draft

**Issue**: Dropdowns not populating

- **Solution**: Ensure `availablePlayers.js` loads before `draft.js`, check console

---

## Glossary

**Snake Draft**: Draft format where pick order reverses each round (1→12, then 12→1, then 1→12, etc.)

**On the Clock**: The team currently making their pick selection

**BroadcastChannel**: Web API for communication between browser windows/tabs from same origin

**localStorage**: Browser storage API for persisting data across sessions

**Pick**: A single player selection in the draft

**Round**: Complete cycle of all teams making one pick each

**Position**: Player role (QB, RB, WR, TE, K, DEF)

**Available Players**: Players not yet drafted, still in the pool

**Drafted Players**: Players already selected by teams

**State**: Current data/configuration of the draft (picks, round, timer, etc.)

---

## Conclusion

The SMFFL Draft Board is a feature-rich, browser-based fantasy football draft application designed for ease of use and flexibility. Its vanilla JavaScript architecture ensures fast performance, simple deployment, and easy customization. The multi-window design with real-time synchronization provides an optimal experience for both live in-person drafts and remote draft parties.

Future enhancements can expand functionality while maintaining the core simplicity that makes the application accessible to users of all technical levels. The persistent state management ensures drafts can be paused and resumed without data loss, while the position-based filtering and visual indicators streamline the selection process.

This design document serves as a comprehensive reference for developers, commissioners, and users looking to understand, customize, or extend the SMFFL Draft Board application.

---

**Document Maintained By**: Development Team  
**Last Updated**: July 12, 2026  
**Next Review**: As needed for version updates
