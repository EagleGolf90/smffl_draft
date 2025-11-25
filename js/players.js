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

// State
let currentFilter = 'ALL';
let searchQuery = '';
let draftedPlayers = [];

// DOM Elements
const playersContainer = document.getElementById('playersContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalPlayersEl = document.getElementById('totalPlayers');
const shownPlayersEl = document.getElementById('shownPlayers');

// Load drafted players from localStorage
function loadDraftedPlayers() {
    try {
        const stored = localStorage.getItem('draftedPlayers');
        if (stored) {
            draftedPlayers = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading drafted players:', error);
        draftedPlayers = [];
    }
}

// Check if player is drafted
function isPlayerDrafted(playerName) {
    return draftedPlayers.some(p => p.name === playerName);
}

// Filter players based on position and search
function getFilteredPlayers() {
    return availablePlayers.filter(player => {
        const matchesPosition = currentFilter === 'ALL' || player.position === currentFilter;
        const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesPosition && matchesSearch;
    });
}

// Create player card HTML
function createPlayerCard(player) {
    const isDrafted = isPlayerDrafted(player.name);
    const draftedClass = isDrafted ? 'drafted' : '';
    
    return `
        <div class="player-card ${draftedClass}">
            <div class="position-badge ${player.position}">
                ${player.position}
            </div>
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-position">${getPositionFullName(player.position)}</div>
            </div>
            ${isDrafted ? '<span class="drafted-label">DRAFTED</span>' : ''}
        </div>
    `;
}

// Get full position name
function getPositionFullName(position) {
    const positions = {
        'QB': 'Quarterback',
        'RB': 'Running Back',
        'WR': 'Wide Receiver',
        'TE': 'Tight End',
        'DEF': 'Defense',
        'K': 'Kicker'
    };
    return positions[position] || position;
}

// Render players
function renderPlayers() {
    const filteredPlayers = getFilteredPlayers();
    
    // Update stats
    totalPlayersEl.textContent = availablePlayers.length;
    shownPlayersEl.textContent = filteredPlayers.length;
    
    if (filteredPlayers.length === 0) {
        playersContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-text">No players found</div>
                <div class="empty-state-subtext">Try adjusting your filters or search query</div>
            </div>
        `;
        return;
    }
    
    playersContainer.innerHTML = filteredPlayers
        .map(player => createPlayerCard(player))
        .join('');
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPlayers();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update filter
        currentFilter = button.dataset.position;
        renderPlayers();
    });
});

// Listen for storage changes (when draft is updated in another tab/window)
window.addEventListener('storage', (e) => {
    if (e.key === 'draftedPlayers') {
        loadDraftedPlayers();
        renderPlayers();
    }
});

// Auto-refresh every 5 seconds to sync with draft board
setInterval(() => {
    const oldDraftedCount = draftedPlayers.length;
    loadDraftedPlayers();
    if (draftedPlayers.length !== oldDraftedCount) {
        renderPlayers();
    }
}, 5000);

// Initialize
loadDraftedPlayers();
renderPlayers();
