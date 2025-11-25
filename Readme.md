# SMFFL Draft Board

A Fantasy Football draft board application with an integrated timer for managing your SMFFL draft.

## Features

- **Interactive Draft Board**: Visual display of all teams and their picks
- **Snake Draft Support**: Automatic snake order calculation
- **Draft Timer**: Separate timer window with countdown clock
- **Pick Management**: Add picks with player names and positions
- **Undo Functionality**: Undo the last pick if needed
- **Customizable Settings**: Configure number of teams, time limits, and draft order
- **Persistent Storage**: Draft state saved automatically using localStorage
- **Visual Indicators**: Color-coded positions and active team highlighting
- **Audio Alerts**: Timer beeps at 30s, 10s, and when time expires

## How to Use

1. Open `index.html` in your web browser
2. Configure your draft settings (number of teams, time limit, snake order)
3. Click "Open Timer Window" to launch the separate timer display
4. Enter player names and positions as picks are made
5. Click "Add Pick" or press Enter to record each selection
6. Use "Start Timer" to begin the countdown for each pick
7. The draft board automatically tracks rounds and turn order

## Files

- `index.html` - Main draft board interface
- `timer.html` - Separate timer window for display
- `styles.css` - Styling for the draft board
- `draft.js` - Draft logic and functionality

## Position Codes

- QB: Quarterback (Red)
- RB: Running Back (Blue)
- WR: Wide Receiver (Green)
- TE: Tight End (Orange)
- K: Kicker (Purple)
- DEF: Defense (Dark Gray)

## Timer Features

- Visual countdown display
- Color warnings (yellow at 30s, red at 10s)
- Audio beeps at key intervals
- Toggleable sound on/off
- Synchronized with main draft board
