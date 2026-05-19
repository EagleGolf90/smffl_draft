// Load team names from JSON and populate the draft board
let teamNames = [];

// Fetch team names from JSON file
async function loadTeamNames() {
    try {
        const response = await fetch('./data/teamNames.json');
        const data = await response.json();
        teamNames = data.teams;
        populateTeamNames();
    } catch (error) {
        console.error('Error loading team names:', error);
        // Fallback to default team names if JSON fails to load
        teamNames = Array.from({ length: 12 }, (_, i) => `Team ${i + 1}`);
        populateTeamNames();
    }
}

// Populate team names in the HTML
function populateTeamNames() {
    const teamColumns = document.querySelectorAll('.team-column');
    teamColumns.forEach((column, index) => {
        const h3 = column.querySelector('h3');
        if (h3 && teamNames[index]) {
            h3.textContent = teamNames[index];
        }
    });
}

// Load team names when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    await loadTeamNames();
    // Dispatch event to notify other scripts that team names are ready
    window.dispatchEvent(new CustomEvent('teamNamesLoaded'));
});
