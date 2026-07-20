// Available Players List
console.log("availablePlayers.js is loading...");

// Declare as global variable
let availablePlayers = [];

// Load players from JSON file
async function loadAvailablePlayers() {
  try {
    const response = await fetch("data/availablePlayers.json");
    const data = await response.json();
    availablePlayers = data;
    console.log("availablePlayers.js loaded successfully!");
    console.log("Total players:", availablePlayers.length);
  } catch (error) {
    console.error("Error loading available players:", error);
    availablePlayers = [];
  }
}

// Load players when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  await loadAvailablePlayers();
  // Dispatch event to notify other scripts that players are ready
  window.dispatchEvent(new CustomEvent("playersLoaded"));
  console.log("playersLoaded event dispatched");
});
