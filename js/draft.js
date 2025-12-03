// Keep a master list of all players (never modified)
const allPlayers = [...availablePlayers];

// Roster requirements
const rosterRequirements = {
    QB: 2,
    RB: 4,
    WRTE: 4,
    K: 2,
    DEF: 2
};

// Draft State
let draftState = {
    numTeams: 12,
    timeLimit: 120, // seconds
    snakeOrder: true,
    currentPick: 1,
    currentRound: 1,
    picks: [],
    isTimerRunning: false,
    timeRemaining: 120,
    availablePlayers: [...availablePlayers],
    draftedPlayers: [] // Track drafted players by name
};

let timerInterval = null;
let timerChannel = null;

// Initialize BroadcastChannel for timer sync
try {
    timerChannel = new BroadcastChannel('draft-timer');
    
    // Listen for messages from timer window
    timerChannel.onmessage = (event) => {
        const { action, timeRemaining: newTime } = event.data;
        
        if (action === 'start') {
            if (!draftState.isTimerRunning) {
                startTimer();
            }
        } else if (action === 'pause') {
            if (draftState.isTimerRunning) {
                pauseTimer();
            }
        } else if (action === 'reset') {
            resetTimer();
        } else if (action === 'request-sync') {
            // Timer window is requesting current state
            if (timerChannel) {
                const syncAction = draftState.isTimerRunning ? 'sync' : 'reset';
                timerChannel.postMessage({ 
                    action: syncAction, 
                    timeRemaining: draftState.timeRemaining 
                });
            }
        }
    };
} catch (e) {
    console.log('BroadcastChannel not supported, using localStorage fallback');
}

// Initialize the draft board
function initializeDraft() {
    loadDraftState();
    populatePositionDropdown();
    populatePlayerDropdown();
    updateDraftInfo();
    updateTeamColumns();
    renderAllPicks();
    updatePositionsTracker();
    syncToLocalStorage();
}

// Populate the position dropdown
function populatePositionDropdown() {
    const dropdown = document.getElementById('positionSelect');
    dropdown.innerHTML = '<option value="">Select a position...</option>';
    
    // Get unique positions from ALL players
    const positions = [...new Set(allPlayers.map(p => p.position))].sort();
    
    positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        // Show count of available players for each position
        const availableCount = draftState.availablePlayers.filter(p => p.position === position).length;
        const totalCount = allPlayers.filter(p => p.position === position).length;
        option.textContent = `${position} (${availableCount}/${totalCount})`;
        
        // If all players in this position are drafted, mark it
        if (availableCount === 0) {
            option.classList.add('drafted');
            option.disabled = true;
        }
        
        dropdown.appendChild(option);
    });
}

// Populate the player dropdown based on selected position
function populatePlayerDropdown(selectedPosition = null) {
    const dropdown = document.getElementById('playerSelect');
    dropdown.innerHTML = '<option value="">Select a player...</option>';
    
    if (!selectedPosition) {
        return; // Don't populate players until a position is selected
    }
    
    // Get ALL players for selected position (from master list)
    const allPositionPlayers = allPlayers.filter(p => p.position === selectedPosition);
    
    // Sort by name
    const sortedPlayers = [...allPositionPlayers].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedPlayers.forEach((player, index) => {
        const option = document.createElement('option');
        option.value = player.name;
        
        // Check if player is drafted
        const isDrafted = draftState.draftedPlayers.includes(player.name);
        
        if (isDrafted) {
            option.textContent = `${player.name} (DRAFTED)`;
            option.classList.add('drafted');
            option.disabled = true;
        } else {
            option.textContent = player.name;
        }
        
        dropdown.appendChild(option);
    });
}

// Load draft state from localStorage
function loadDraftState() {
    const saved = localStorage.getItem('draftState');
    if (saved) {
        const parsed = JSON.parse(saved);
        draftState = { ...draftState, ...parsed };
        
        // Ensure currentPick is at least 1
        draftState.currentPick = 1;
        
        // Always ensure timer is set to 120 seconds (2 minutes)
        draftState.timeLimit = 120;
        draftState.timeRemaining = 120;
    }
}

// Save draft state to localStorage
function saveDraftState() {
    localStorage.setItem('draftState', JSON.stringify(draftState));
    syncToLocalStorage();
}

// Sync specific values to localStorage for timer window
function syncToLocalStorage() {
    const currentTeam = getCurrentTeam();
    const teamName = teamNames[currentTeam - 1] || `Team ${currentTeam}`;
    localStorage.setItem('draftCurrentTeam', teamName);
    localStorage.setItem('draftCurrentPick', draftState.currentPick.toString());
    localStorage.setItem('draftCurrentRound', draftState.currentRound.toString());
    localStorage.setItem('draftTimeLimit', draftState.timeLimit.toString());
    localStorage.setItem('draftTimeRemaining', draftState.timeRemaining.toString());
}

// Calculate which team is currently picking
function getCurrentTeam() {
    const pickInRound = ((draftState.currentPick - 1) % draftState.numTeams) + 1;
    
    if (draftState.snakeOrder) {
        // Snake draft: even rounds go in reverse
        if (draftState.currentRound % 2 === 0) {
            return draftState.numTeams - pickInRound + 1;
        }
    }
    
    return pickInRound;
}

// Update draft info display
function updateDraftInfo() {
    document.getElementById('currentPick').textContent = draftState.currentPick;
    document.getElementById('currentRound').textContent = draftState.currentRound;
    const currentTeam = getCurrentTeam();
    const teamName = teamNames[currentTeam - 1] || `Team ${currentTeam}`;
    document.getElementById('onTheClock').textContent = teamName;
    
    // Broadcast team change to other windows
    if (timerChannel) {
        timerChannel.postMessage({ 
            action: 'update-team', 
            teamName: teamName,
            pickNumber: draftState.currentPick,
            roundNumber: draftState.currentRound
        });
    }
    
    // Highlight active team
    document.querySelectorAll('.team-column').forEach(col => {
        col.classList.remove('active');
    });
    const activeTeam = getCurrentTeam();
    const activeColumn = document.querySelector(`.team-column[data-team="${activeTeam}"]`);
    if (activeColumn) {
        activeColumn.classList.add('active');
    }
}

// Update team columns based on number of teams
function updateTeamColumns() {
    const teamsContainer = document.querySelector('.teams-header');
    teamsContainer.innerHTML = '';
    
    // Apply special layout for 12 teams
    if (draftState.numTeams === 12) {
        teamsContainer.classList.add('teams-12');
    } else {
        teamsContainer.classList.remove('teams-12');
        teamsContainer.style.gridTemplateColumns = `repeat(${draftState.numTeams}, 1fr)`;
    }
    
    for (let i = 1; i <= draftState.numTeams; i++) {
        const teamCol = document.createElement('div');
        teamCol.className = 'team-column';
        teamCol.setAttribute('data-team', i);
        const teamName = teamNames[i - 1] || `Team ${i}`;
        teamCol.innerHTML = `
            <h3>${teamName}</h3>
            <div class="team-picks" id="team${i}Picks"></div>
        `;
        teamsContainer.appendChild(teamCol);
    }
    
    updateDraftInfo();
}

// Add a pick
function addPick() {
    const positionDropdown = document.getElementById('positionSelect');
    const playerDropdown = document.getElementById('playerSelect');
    const selectedPlayerName = playerDropdown.value;
    
    if (!selectedPlayerName) {
        alert('Please select a position and player');
        return;
    }
    
    // Find the player in available players by name
    const playerIndex = draftState.availablePlayers.findIndex(
        p => p.name === selectedPlayerName
    );
    
    if (playerIndex === -1) {
        alert('Player not found');
        return;
    }
    
    const player = draftState.availablePlayers[playerIndex];
    
    const currentTeam = getCurrentTeam();
    const pick = {
        pickNumber: draftState.currentPick,
        round: draftState.currentRound,
        team: currentTeam,
        player: player.name,
        position: player.position
    };
    
    draftState.picks.push(pick);
    
    // Add to drafted players list
    draftState.draftedPlayers.push(player.name);
    
    // Remove player from available players
    draftState.availablePlayers.splice(playerIndex, 1);
    
    renderPick(pick);
    
    // Move to next pick
    draftState.currentPick++;
    if (draftState.currentPick > draftState.numTeams * draftState.currentRound) {
        draftState.currentRound++;
    }
    
    updateDraftInfo();
    updatePositionsTracker();
    saveDraftState();
    resetTimer();
    
    // Refresh dropdowns and reset selections
    populatePositionDropdown();
    populatePlayerDropdown(); // Reset player dropdown to show only default option
    positionDropdown.value = ''; // Reset position to "Select a position..."
    playerDropdown.value = ''; // Reset player to blank
    positionDropdown.focus();
}

// Render a single pick
function renderPick(pick) {
    const teamPicks = document.getElementById(`team${pick.team}Picks`);
    if (!teamPicks) return;
    
    const pickCard = document.createElement('div');
    pickCard.className = 'pick-card';
    pickCard.setAttribute('data-position', pick.position);
    pickCard.innerHTML = `
        <div class="pick-number">Pick ${pick.pickNumber} (Rd ${pick.round})</div>
        <div class="pick-player">${pick.player} - ${pick.position}</div>
    `;
    
    teamPicks.appendChild(pickCard);
}

// Render all picks
function renderAllPicks() {
    // Clear all team picks
    document.querySelectorAll('.team-picks').forEach(picks => {
        picks.innerHTML = '';
    });
    
    // Render each pick
    draftState.picks.forEach(pick => renderPick(pick));
}

// Undo last pick
function undoLastPick() {
    if (draftState.picks.length === 0) {
        alert('No picks to undo');
        return;
    }
    
    const lastPick = draftState.picks.pop();
    
    // Remove from drafted players list
    const draftedIndex = draftState.draftedPlayers.indexOf(lastPick.player);
    if (draftedIndex > -1) {
        draftState.draftedPlayers.splice(draftedIndex, 1);
    }
    
    // Add player back to available players
    draftState.availablePlayers.push({
        name: lastPick.player,
        position: lastPick.position
    });
    
    // Update current pick and round
    draftState.currentPick = lastPick.pickNumber;
    draftState.currentRound = lastPick.round;
    
    renderAllPicks();
    updateDraftInfo();
    updatePositionsTracker();
    populatePositionDropdown();
    document.getElementById('positionSelect').value = '';
    populatePlayerDropdown();
    saveDraftState();
    resetTimer();
}

// Reset the entire draft
function resetDraft() {
    const confirmReset = confirm('Are you sure you want to reset the entire draft? This will clear all picks and cannot be undone.');
    if (!confirmReset) return;
    
    draftState.currentPick = 1;
    draftState.currentRound = 1;
    draftState.picks = [];
    draftState.timeRemaining = draftState.timeLimit;
    draftState.availablePlayers = [...availablePlayers];
    draftState.draftedPlayers = [];
    
    renderAllPicks();
    updateDraftInfo();
    updatePositionsTracker();
    populatePositionDropdown();
    document.getElementById('positionSelect').value = '';
    populatePlayerDropdown();
    saveDraftState();
    resetTimer();
}

// Timer functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    document.getElementById('timerDisplay').textContent = formatTime(Math.max(0, draftState.timeRemaining));
}

function startTimer() {
    if (draftState.isTimerRunning) return;
    
    // Reset to full time limit if timer has expired or is at 0
    if (draftState.timeRemaining <= 0) {
        draftState.timeRemaining = draftState.timeLimit;
        updateTimerDisplay();
    }
    
    draftState.isTimerRunning = true;
    localStorage.setItem('draftTimerCommand', 'start');
    localStorage.setItem('draftTimeRemaining', draftState.timeRemaining.toString());
    
    // Broadcast to other windows
    if (timerChannel) {
        timerChannel.postMessage({ action: 'start', timeRemaining: draftState.timeRemaining });
    }
    
    timerInterval = setInterval(() => {
        draftState.timeRemaining--;
        updateTimerDisplay();
        localStorage.setItem('draftTimeRemaining', draftState.timeRemaining.toString());
        
        // Broadcast sync update every second to prevent drift
        if (timerChannel) {
            timerChannel.postMessage({ action: 'sync', timeRemaining: draftState.timeRemaining });
        }
        
        if (draftState.timeRemaining <= 0) {
            pauseTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!draftState.isTimerRunning) return;
    
    draftState.isTimerRunning = false;
    clearInterval(timerInterval);
    localStorage.setItem('draftTimerCommand', 'pause');
    localStorage.setItem('draftTimeRemaining', draftState.timeRemaining.toString());
    
    // Broadcast to other windows
    if (timerChannel) {
        timerChannel.postMessage({ action: 'pause', timeRemaining: draftState.timeRemaining });
    }
}

function resetTimer() {
    pauseTimer();
    draftState.timeRemaining = draftState.timeLimit;
    updateTimerDisplay();
    localStorage.setItem('draftTimerCommand', 'reset');
    localStorage.setItem('draftTimeRemaining', draftState.timeRemaining.toString());
    
    // Broadcast to other windows
    if (timerChannel) {
        timerChannel.postMessage({ action: 'reset', timeRemaining: draftState.timeRemaining });
    }
}

// Apply settings
function applySettings() {
    const numTeams = parseInt(document.getElementById('numTeams').value);
    const timeLimit = parseInt(document.getElementById('timeLimit').value);
    const snakeOrder = document.getElementById('snakeOrder').checked;
    
    if (numTeams < 2 || numTeams > 20) {
        alert('Number of teams must be between 2 and 20');
        return;
    }
    
    if (timeLimit < 30 || timeLimit > 300) {
        alert('Time limit must be between 30 and 300 seconds');
        return;
    }
    
    const confirmChange = confirm('Changing settings will reset the draft. Continue?');
    if (!confirmChange) return;
    
    draftState.numTeams = numTeams;
    draftState.timeLimit = timeLimit;
    draftState.snakeOrder = snakeOrder;
    draftState.currentPick = 1;
    draftState.currentRound = 1;
    draftState.picks = [];
    draftState.timeRemaining = timeLimit;
    draftState.availablePlayers = [...availablePlayers];
    
    updateTeamColumns();
    renderAllPicks();
    updateDraftInfo();
    updatePositionsTracker();
    populatePositionDropdown();
    document.getElementById('positionSelect').value = '';
    populatePlayerDropdown();
    saveDraftState();
    resetTimer();
}

// Open timer window
function openTimerWindow() {
    const width = 800;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    window.open(
        'timer.html',
        'SMFFL Draft Timer',
        `width=${width},height=${height},left=${left},top=${top}`
    );
}

// Event Listeners
document.getElementById('addPick').addEventListener('click', addPick);

document.getElementById('positionSelect').addEventListener('change', (e) => {
    const selectedPosition = e.target.value;
    const playerDropdown = document.getElementById('playerSelect');
    playerDropdown.value = ''; // Reset player selection when position changes
    populatePlayerDropdown(selectedPosition);
});

document.getElementById('playerSelect').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPick();
    }
});

document.getElementById('undoPick').addEventListener('click', undoLastPick);

document.getElementById('resetDraft').addEventListener('click', resetDraft);

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
document.getElementById('resetTimer').addEventListener('click', resetTimer);
document.getElementById('openTimerWindow').addEventListener('click', openTimerWindow);

document.getElementById('applySettings').addEventListener('click', applySettings);

// Initialize settings inputs
document.getElementById('numTeams').value = draftState.numTeams;
document.getElementById('timeLimit').value = draftState.timeLimit;
document.getElementById('snakeOrder').checked = draftState.snakeOrder;

// Initialize the draft on page load
initializeDraft();

// Listen for timer commands from the timer window
window.addEventListener('storage', (e) => {
    if (e.key === 'draftTimerCommand') {
        if (e.newValue === 'start') {
            startTimer();
        } else if (e.newValue === 'pause') {
            pauseTimer();
        } else if (e.newValue === 'reset') {
            resetTimer();
        }
    }
});

const teamNames = ['White Panther', 'Vikes', 'Centurions', 'Bengals', 'Pepsi 40024', 'Rainbows', 'Cards', 'Peruvian Ambush', 'Lord of Wiz', 'Rhino Chasers', 'Fearless Trojans', 'Shockers'];

// Calculate positions remaining for each team
function getTeamPositionCounts() {
    const counts = {};
    
    // Initialize counts for all teams
    for (let i = 1; i <= draftState.numTeams; i++) {
        counts[i] = { ...rosterRequirements };
    }
    
    // Subtract drafted players
    draftState.picks.forEach(pick => {
        if (counts[pick.team] && counts[pick.team][pick.position] !== undefined) {
            counts[pick.team][pick.position] = Math.max(0, counts[pick.team][pick.position] - 1);
        }
    });
    
    return counts;
}

// Update the positions tracker display
function updatePositionsTracker() {
    const grid = document.getElementById('positionsGrid');
    if (!grid) return;
    
    const counts = getTeamPositionCounts();
    const positions = Object.keys(rosterRequirements);
    
    // Clear existing content
    grid.innerHTML = '';
    
    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'positions-row positions-header-row';
    
    const teamHeader = document.createElement('div');
    teamHeader.className = 'positions-cell team-cell';
    teamHeader.textContent = 'Team';
    headerRow.appendChild(teamHeader);
    
    positions.forEach(pos => {
        const posHeader = document.createElement('div');
        posHeader.className = 'positions-cell position-header';
        posHeader.textContent = pos;
        posHeader.setAttribute('data-position', pos);
        headerRow.appendChild(posHeader);
    });
    
    grid.appendChild(headerRow);
    
    // Create team rows
    for (let i = 1; i <= draftState.numTeams; i++) {
        const teamRow = document.createElement('div');
        teamRow.className = 'positions-row';
        if (i === getCurrentTeam()) {
            teamRow.classList.add('active-team-row');
        }
        
        const teamCell = document.createElement('div');
        teamCell.className = 'positions-cell team-cell';
        teamCell.textContent = `Team ${i}`;
        teamRow.appendChild(teamCell);
        
        positions.forEach(pos => {
            const posCell = document.createElement('div');
            posCell.className = 'positions-cell';
            const remaining = counts[i][pos];
            posCell.textContent = remaining;
            posCell.setAttribute('data-position', pos);
            
            // Add class based on remaining count
            if (remaining === 0) {
                posCell.classList.add('complete');
            } else if (remaining === rosterRequirements[pos]) {
                posCell.classList.add('empty');
            } else {
                posCell.classList.add('partial');
            }
            
            teamRow.appendChild(posCell);
        });
        
        grid.appendChild(teamRow);
    }
}
