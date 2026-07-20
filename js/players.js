// State
let currentFilter = "ALL";
let searchQuery = "";
let draftedPlayers = [];

// Password protection
const ADMIN_PASSWORD = "admin"; // Change this to your desired password

function checkPassword(action = "perform this action") {
  const password = prompt(`Enter password to ${action}:`);
  if (password === null) {
    return false; // User cancelled
  }
  if (password !== ADMIN_PASSWORD) {
    alert("Incorrect password!");
    return false;
  }
  return true;
}

// DOM Elements
const playersContainer = document.getElementById("playersContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const totalPlayersEl = document.getElementById("totalPlayers");
const shownPlayersEl = document.getElementById("shownPlayers");

// Load drafted players from localStorage
function loadDraftedPlayers() {
  try {
    const stored = localStorage.getItem("draftedPlayers");
    if (stored) {
      draftedPlayers = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading drafted players:", error);
    draftedPlayers = [];
  }
}

// Check if player is drafted
function isPlayerDrafted(playerName) {
  return draftedPlayers.some((p) => p.name === playerName);
}

// Filter players based on position and search
function getFilteredPlayers() {
  return availablePlayers.filter((player) => {
    const matchesPosition =
      currentFilter === "ALL" || player.position === currentFilter;
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesPosition && matchesSearch;
  });
}

// Create player card HTML
function createPlayerCard(player) {
  const isDrafted = isPlayerDrafted(player.name);
  const draftedClass = isDrafted ? "drafted" : "";

  return `
        <div class="player-card ${draftedClass}">
            <div class="position-badge ${player.position}">
                ${player.position}
            </div>
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-position">${getPositionFullName(player.position)}</div>
            </div>
            ${isDrafted ? '<span class="drafted-label">DRAFTED</span>' : ""}
        </div>
    `;
}

// Get full position name
function getPositionFullName(position) {
  const positions = {
    QB: "Quarterback",
    RB: "Running Back",
    WR: "Wide Receiver",
    TE: "Tight End",
    DEF: "Defense",
    DP: "Defense Player",
    K: "Kicker",
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
    .map((player) => createPlayerCard(player))
    .join("");
}

// Event Listeners
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderPlayers();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Update active state
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Update filter
    currentFilter = button.dataset.position;
    renderPlayers();
  });
});

// Listen for storage changes (when draft is updated in another tab/window)
window.addEventListener("storage", (e) => {
  if (e.key === "draftedPlayers") {
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

// Initialize after players are loaded
window.addEventListener("playersLoaded", () => {
  console.log("Players loaded in players.js, initializing...");
  loadDraftedPlayers();
  renderPlayers();
});
