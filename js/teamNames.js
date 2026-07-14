// Load team names from JSON and populate the draft board
// Declare as global variables so draft.js can access them
window.teamNames = [];
window.teamOwners = [];

// Fetch team names from JSON file
async function loadTeamNames() {
    try {
        const response = await fetch('./data/teamNames.json');
        const data = await response.json();
        
        // Support both old format (array of strings) and new format (array of objects)
        if (Array.isArray(data.teams) && data.teams.length > 0) {
            if (typeof data.teams[0] === 'string') {
                // Old format: array of strings
                window.teamNames = data.teams;
                window.teamOwners = Array.from({ length: data.teams.length }, () => '');
            } else {
                // New format: array of objects with name and owner
                window.teamNames = data.teams.map(team => team.name);
                window.teamOwners = data.teams.map(team => team.owner || '');
            }
        }
        populateTeamNames();
    } catch (error) {
        console.error('Error loading team names:', error);
        // Fallback to default team names if JSON fails to load
        window.teamNames = Array.from({ length: 12 }, (_, i) => `Team ${i + 1}`);
        window.teamOwners = Array.from({ length: 12 }, () => '');
        populateTeamNames();
    }
}

// Populate team names in the HTML
function populateTeamNames() {
    const teamColumns = document.querySelectorAll('.team-column');
    teamColumns.forEach((column, index) => {
        const h3 = column.querySelector('h3');
        if (h3 && window.teamNames[index]) {
            // Clear existing content
            h3.innerHTML = '';
            
            // Create team name element
            const teamNameSpan = document.createElement('div');
            teamNameSpan.className = 'team-name';
            teamNameSpan.textContent = window.teamNames[index];
            h3.appendChild(teamNameSpan);
            
            // Create owner element if owner exists
            if (window.teamOwners[index]) {
                const ownerSpan = document.createElement('div');
                ownerSpan.className = 'team-owner';
                ownerSpan.textContent = window.teamOwners[index];
                h3.appendChild(ownerSpan);
            }
        }
    });
}

// Load team names when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadTeamNames();
    // Dispatch event to notify other scripts that team names are ready
    window.dispatchEvent(new CustomEvent('teamNamesLoaded'));
});
