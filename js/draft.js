// Available Players List
const availablePlayers = [
    { name: "Christian McCaffrey", position: "RB" },
    { name: "Tyreek Hill", position: "WR" },
    { name: "CeeDee Lamb", position: "WR" },
    { name: "Bijan Robinson", position: "RB" },
    { name: "Breece Hall", position: "RB" },
    { name: "Amon-Ra St. Brown", position: "WR" },
    { name: "Justin Jefferson", position: "WR" },
    { name: "Ja'Marr Chase", position: "WR" },
    { name: "Saquon Barkley", position: "RB" },
    { name: "Josh Allen", position: "QB" },
    { name: "Patrick Mahomes", position: "QB" },
    { name: "Lamar Jackson", position: "QB" },
    { name: "Jalen Hurts", position: "QB" },
    { name: "A.J. Brown", position: "WR" },
    { name: "Garrett Wilson", position: "WR" },
    { name: "Puka Nacua", position: "WR" },
    { name: "Travis Kelce", position: "TE" },
    { name: "Sam LaPorta", position: "TE" },
    { name: "Derrick Henry", position: "RB" },
    { name: "De'Von Achane", position: "RB" },
    { name: "Jonathan Taylor", position: "RB" },
    { name: "Jahmyr Gibbs", position: "RB" },
    { name: "Kenneth Walker III", position: "RB" },
    { name: "Kyren Williams", position: "RB" },
    { name: "Davante Adams", position: "WR" },
    { name: "Stefon Diggs", position: "WR" },
    { name: "Drake London", position: "WR" },
    { name: "Deebo Samuel", position: "WR" },
    { name: "Chris Olave", position: "WR" },
    { name: "Mike Evans", position: "WR" },
    { name: "DJ Moore", position: "WR" },
    { name: "Nico Collins", position: "WR" },
    { name: "Brandon Aiyuk", position: "WR" },
    { name: "Mark Andrews", position: "TE" },
    { name: "Trey McBride", position: "TE" },
    { name: "Dalton Kincaid", position: "TE" },
    { name: "George Kittle", position: "TE" },
    { name: "Kyle Pitts", position: "TE" },
    { name: "Evan Engram", position: "TE" },
    { name: "David Njoku", position: "TE" },
    { name: "Joe Burrow", position: "QB" },
    { name: "C.J. Stroud", position: "QB" },
    { name: "Dak Prescott", position: "QB" },
    { name: "Brock Purdy", position: "QB" },
    { name: "Trevor Lawrence", position: "QB" },
    { name: "Justin Herbert", position: "QB" },
    { name: "Tua Tagovailoa", position: "QB" },
    { name: "Anthony Richardson", position: "QB" },
    { name: "Jordan Love", position: "QB" },
    { name: "Geno Smith", position: "QB" },
    { name: "Isiah Pacheco", position: "RB" },
    { name: "James Cook", position: "RB" },
    { name: "Rachaad White", position: "RB" },
    { name: "Najee Harris", position: "RB" },
    { name: "Travis Etienne Jr.", position: "RB" },
    { name: "Aaron Jones", position: "RB" },
    { name: "Alvin Kamara", position: "RB" },
    { name: "Rhamondre Stevenson", position: "RB" },
    { name: "Joe Mixon", position: "RB" },
    { name: "D'Andre Swift", position: "RB" },
    { name: "Javonte Williams", position: "RB" },
    { name: "Tony Pollard", position: "RB" },
    { name: "Zach Charbonnet", position: "RB" },
    { name: "James Conner", position: "RB" },
    { name: "Marvin Harrison Jr.", position: "WR" },
    { name: "Cooper Kupp", position: "WR" },
    { name: "Amari Cooper", position: "WR" },
    { name: "DK Metcalf", position: "WR" },
    { name: "Terry McLaurin", position: "WR" },
    { name: "Calvin Ridley", position: "WR" },
    { name: "Zay Flowers", position: "WR" },
    { name: "Christian Kirk", position: "WR" },
    { name: "George Pickens", position: "WR" },
    { name: "Keenan Allen", position: "WR" },
    { name: "Marquise Brown", position: "WR" },
    { name: "Jaxon Smith-Njigba", position: "WR" },
    { name: "Michael Pittman Jr.", position: "WR" },
    { name: "DeVonta Smith", position: "WR" },
    { name: "Diontae Johnson", position: "WR" },
    { name: "Tyler Lockett", position: "WR" },
    { name: "Jaylen Waddle", position: "WR" },
    { name: "Courtland Sutton", position: "WR" },
    { name: "Jordan Addison", position: "WR" },
    { name: "Rashee Rice", position: "WR" },
    { name: "Tank Dell", position: "WR" },
    { name: "Romeo Doubs", position: "WR" },
    { name: "Jakobi Meyers", position: "WR" },
    { name: "Dallas Goedert", position: "TE" },
    { name: "T.J. Hockenson", position: "TE" },
    { name: "Jake Ferguson", position: "TE" },
    { name: "Chigoziem Okonkwo", position: "TE" },
    { name: "Tyler Conklin", position: "TE" },
    { name: "Taysom Hill", position: "TE" },
    { name: "Cole Kmet", position: "TE" },
    { name: "Hunter Henry", position: "TE" },
    { name: "Jonnu Smith", position: "TE" },
    { name: "Luke Musgrave", position: "TE" },
    { name: "49ers", position: "DEF" },
    { name: "Ravens", position: "DEF" },
    { name: "Cowboys", position: "DEF" },
    { name: "Browns", position: "DEF" },
    { name: "Bills", position: "DEF" },
    { name: "Jets", position: "DEF" },
    { name: "Chiefs", position: "DEF" },
    { name: "Saints", position: "DEF" },
    { name: "Steelers", position: "DEF" },
    { name: "Eagles", position: "DEF" },
    { name: "Justin Tucker", position: "K" },
    { name: "Harrison Butker", position: "K" },
    { name: "Jake Moody", position: "K" },
    { name: "Tyler Bass", position: "K" },
    { name: "Brandon Aubrey", position: "K" },
    { name: "Jason Sanders", position: "K" },
    { name: "Evan McPherson", position: "K" },
    { name: "Younghoe Koo", position: "K" },
    { name: "Cameron Dicker", position: "K" },
    { name: "Jake Elliott", position: "K" }
];

// Roster requirements
const rosterRequirements = {
    QB: 1,
    RB: 2,
    WR: 3,
    TE: 1,
    K: 1,
    DEF: 1
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
    timeRemaining: 90,
    availablePlayers: [...availablePlayers]
};

let timerInterval = null;

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
    
    // Get unique positions from available players
    const positions = [...new Set(draftState.availablePlayers.map(p => p.position))].sort();
    
    positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = position;
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
    
    // Filter players by selected position
    const filteredPlayers = draftState.availablePlayers.filter(p => p.position === selectedPosition);
    
    // Sort by name
    const sortedPlayers = [...filteredPlayers].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedPlayers.forEach((player, index) => {
        const option = document.createElement('option');
        // Store the actual player name as value for easier lookup
        option.value = player.name;
        option.textContent = player.name;
        dropdown.appendChild(option);
    });
}

// Load draft state from localStorage
function loadDraftState() {
    const saved = localStorage.getItem('draftState');
    if (saved) {
        const parsed = JSON.parse(saved);
        draftState = { ...draftState, ...parsed };
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
    localStorage.setItem('draftCurrentTeam', `Team ${currentTeam}`);
    localStorage.setItem('draftCurrentPick', draftState.currentPick.toString());
    localStorage.setItem('draftCurrentRound', draftState.currentRound.toString());
    localStorage.setItem('draftTimeLimit', draftState.timeLimit.toString());
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
    document.getElementById('onTheClock').textContent = `Team ${getCurrentTeam()}`;
    
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
        teamCol.innerHTML = `
            <h3>Team ${i}</h3>
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
    positionDropdown.value = '';
    populatePlayerDropdown();
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
    
    draftState.isTimerRunning = true;
    localStorage.setItem('draftTimerCommand', 'start');
    
    timerInterval = setInterval(() => {
        draftState.timeRemaining--;
        updateTimerDisplay();
        
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
}

function resetTimer() {
    pauseTimer();
    draftState.timeRemaining = draftState.timeLimit;
    updateTimerDisplay();
    localStorage.setItem('draftTimerCommand', 'reset');
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
    populatePlayerDropdown(selectedPosition);
});

document.getElementById('playerSelect').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPick();
    }
});

document.getElementById('undoPick').addEventListener('click', undoLastPick);

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

// Function to get all team names into an array and print
// function getAllTeamNames() {
//     const teamNames = [];
//     for (let i = 1; i <= draftState.numTeams; i++) {
//         teamNames.push(`Team ${i}`);
//     }
//     console.log('All Team Names:', teamNames);
//     return teamNames;
// }

// Call the function to print all team names
// const teams = getAllTeamNames();
// console.log('Teams Array:', teams);

teamNames = ['White Panthers', 'Vikes', 'Centurions', 'Red Raiders', 'Sharks', 'Warriors', 'Dragons', 'Titans', 'Wolves', 'Hawks', 'Raptors', 'Bulldogs'];

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
