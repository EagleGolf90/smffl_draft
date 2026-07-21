// Team names and owners
let teamNames = [];
let teamOwners = [];

// Password protection
const ADMIN_PASSWORD = 'admin'; // Change this to your desired password

function checkPassword(action = 'perform this action') {
    const password = prompt(`Enter password to ${action}:`);
    if (password === null) {
        return false; // User cancelled
    }
    if (password !== ADMIN_PASSWORD) {
        alert('Incorrect password!');
        return false;
    }
    return true;
}

// Load team names from JSON file
async function loadTeamNames() {
  try {
    const response = await fetch("./data/teamNames.json");
    const data = await response.json();

    // Support both old format (array of strings) and new format (array of objects)
    if (Array.isArray(data.teams) && data.teams.length > 0) {
      if (typeof data.teams[0] === "string") {
        // Old format: array of strings
        teamNames = data.teams;
        teamOwners = Array.from({ length: data.teams.length }, () => "");
      } else {
        // New format: array of objects with name and owner
        teamNames = data.teams.map((team) => team.name);
        teamOwners = data.teams.map((team) => team.owner || "");
      }
    }

    console.log("Team names loaded:", teamNames);
    console.log("Team owners loaded:", teamOwners);

    // Update positions tracker after loading team names
    updatePositionsTracker();
  } catch (error) {
    console.error("Error loading team names:", error);
    // Fallback to default team names if JSON fails to load
    teamNames = Array.from({ length: 12 }, (_, i) => `Team ${i + 1}`);
    teamOwners = Array.from({ length: 12 }, () => "");
  }
}

// Timer state
let timeRemaining = 120; // default 120 seconds (match draft.js)
let timerInterval = null;
let isRunning = false;
let soundEnabled = true;
let timerChannel = null;
let lastSyncTime = Date.now();
let lastBeepTime = null; // Track last time we played a beep to prevent duplicates
let controlledByMainWindow = false; // Track if timer is controlled by main window

// Initialize BroadcastChannel for timer sync
try {
  timerChannel = new BroadcastChannel("draft-timer");

  // Listen for messages from main window
  timerChannel.onmessage = (event) => {
    const {
      action,
      timeRemaining: newTime,
      teamName: newTeamName,
      pickNumber,
      roundNumber,
    } = event.data;

    if (action === "start") {
      if (newTime !== undefined) {
        timeRemaining = newTime;
        updateDisplay();
      }
      if (!isRunning) {
        startTimerInternal(true); // true = controlled by main window
      }
    } else if (action === "pause") {
      if (newTime !== undefined) {
        timeRemaining = newTime;
        updateDisplay();
      }
      if (isRunning) {
        pauseTimerInternal();
      }
    } else if (action === "reset") {
      if (newTime !== undefined) {
        timeRemaining = newTime;
      }
      resetTimerInternal();
    } else if (action === "sync") {
      // Force sync time to prevent drift - just update display, don't run own timer
      if (newTime !== undefined) {
        timeRemaining = newTime;
        updateDisplay();
        lastSyncTime = Date.now();
        
        // Ensure timer is in "running" state if receiving sync messages
        if (!isRunning) {
          isRunning = true;
          controlledByMainWindow = true;
          startBtn.textContent = "Running...";
          startBtn.disabled = true;
        }
      }
    } else if (action === "update-team") {
      // Update team info from main window
      if (newTeamName !== undefined) {
        document.getElementById("teamName").textContent = newTeamName;
      }
      if (pickNumber !== undefined) {
        document.getElementById("pickNumber").textContent = pickNumber;
      }
      if (roundNumber !== undefined) {
        document.getElementById("roundNumber").textContent = roundNumber;
      }
      updatePositionsTracker();
    }
  };
} catch (e) {
  console.log(
    "BroadcastChannel not supported, using localStorage fallback",
  );
}

// Roster requirements
const rosterRequirements = {
  QB: 2,
  RB: 4,
  WR: 4,
  DP: 2,
  DEF: 2,
  K: 2
};

// Get references to elements
const timerDisplay = document.getElementById("timerDisplay");
const statusMessage = document.getElementById("statusMessage");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const soundToggle = document.getElementById("soundToggle");
const teamName = document.getElementById("teamName");
const pickNumber = document.getElementById("pickNumber");
const roundNumber = document.getElementById("roundNumber");

// Audio context for beeps
const audioContext = new (
  window.AudioContext || window.webkitAudioContext
)();

function playBeep(frequency = 800, duration = 200) {
  if (!soundEnabled) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration / 1000,
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

// Check and play beeps for specific time thresholds
function checkAndPlayBeeps(currentTime) {
  // Prevent duplicate beeps within 1 second
  const now = Date.now();
  if (lastBeepTime && (now - lastBeepTime) < 1000) {
    return;
  }

  if (currentTime === 30) {
    playBeep(600, 200);
    lastBeepTime = now;
  } else if (currentTime === 10) {
    playBeep(800, 300);
    lastBeepTime = now;
  } else if (currentTime <= 3 && currentTime > 0) {
    playBeep(1000, 200);
    lastBeepTime = now;
  } else if (currentTime === 0) {
    playBeep(400, 1000);
    lastBeepTime = now;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(Math.max(0, timeRemaining));

  // Update styling based on time remaining
  timerDisplay.classList.remove("warning", "danger");
  if (timeRemaining <= 10 && timeRemaining > 0) {
    timerDisplay.classList.add("danger");
  } else if (timeRemaining <= 30 && timeRemaining > 10) {
    timerDisplay.classList.add("warning");
  }

  // Update status message
  if (timeRemaining <= 0) {
    statusMessage.textContent = "TIME EXPIRED!";
    statusMessage.classList.add("expired");
  } else {
    statusMessage.textContent = "";
    statusMessage.classList.remove("expired");
  }
  
  // Check for beeps at appropriate thresholds
  checkAndPlayBeeps(timeRemaining);
}

function startTimerInternal(controlledByMain = false) {
  if (isRunning) return;

  // Reset to full time limit if timer has expired or is at 0
  if (timeRemaining <= 0) {
    timeRemaining =
      parseInt(localStorage.getItem("draftTimeLimit")) || 120;
    updateDisplay();
  }

  isRunning = true;
  controlledByMainWindow = controlledByMain;
  startBtn.textContent = "Running...";
  startBtn.disabled = true;
  lastSyncTime = Date.now();

  // Only run our own countdown timer if not controlled by main window
  // If controlled by main, we rely on sync messages every second from draft.js
  if (!controlledByMain) {
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateDisplay();

      if (timeRemaining <= 0) {
        pauseTimerInternal();
      }
    }, 1000);
  }
}

function startTimer() {
  // Reset to full time limit if timer has expired or is at 0
  if (timeRemaining <= 0) {
    timeRemaining =
      parseInt(localStorage.getItem("draftTimeLimit")) || 120;
    updateDisplay();
  }

  startTimerInternal();
  // Notify main window
  if (timerChannel) {
    timerChannel.postMessage({ action: "start", timeRemaining });
  }
  localStorage.setItem("draftTimerCommand", "start");
}

function pauseTimerInternal() {
  if (!isRunning) return;

  isRunning = false;
  controlledByMainWindow = false;
  clearInterval(timerInterval);
  timerInterval = null;
  startBtn.textContent = "Start";
  startBtn.disabled = false;
}

function pauseTimer() {
  pauseTimerInternal();
  // Notify main window
  if (timerChannel) {
    timerChannel.postMessage({ action: "pause", timeRemaining });
  }
  localStorage.setItem("draftTimerCommand", "pause");
  localStorage.setItem("draftTimeRemaining", timeRemaining.toString());
}

function resetTimerInternal() {
  pauseTimerInternal();
  controlledByMainWindow = false;
  timeRemaining = parseInt(localStorage.getItem("draftTimeLimit")) || 120;
  updateDisplay();
}

function resetTimer() {
  resetTimerInternal();
  // Notify main window
  if (timerChannel) {
    timerChannel.postMessage({ action: "reset", timeRemaining });
  }
  localStorage.setItem("draftTimerCommand", "reset");
}

function toggleSound() {
  if (!checkPassword('toggle sound')) {
    return;
  }
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
}

// Event listeners
startBtn.addEventListener("click", () => {
  startTimer();
});
pauseBtn.addEventListener("click", () => {
  pauseTimer();
});
resetBtn.addEventListener("click", () => {
  resetTimer();
});
soundToggle.addEventListener("click", toggleSound);

// Update positions tracker
function updatePositionsTracker() {
  const grid = document.getElementById("positionsGrid");
  if (!grid) return;

  const draftState = JSON.parse(
    localStorage.getItem("draftState") || "{}",
  );
  const numTeams = draftState.numTeams || 12;
  const picks = draftState.picks || [];
  const currentPick =
    parseInt(localStorage.getItem("draftCurrentPick")) || 1;
  const currentRound =
    parseInt(localStorage.getItem("draftCurrentRound")) || 1;
  const snakeOrder = draftState.snakeOrder !== false;

  // Calculate current team
  const pickInRound = ((currentPick - 1) % numTeams) + 1;
  let currentTeam = pickInRound;
  if (snakeOrder && currentRound % 2 === 0) {
    currentTeam = numTeams - pickInRound + 1;
  }

  // Calculate position counts for each team
  const counts = {};
  for (let i = 1; i <= numTeams; i++) {
    counts[i] = { ...rosterRequirements };
  }

  picks.forEach((pick) => {
    if (
      counts[pick.team] &&
      counts[pick.team][pick.position] !== undefined
    ) {
      counts[pick.team][pick.position] = Math.max(
        0,
        counts[pick.team][pick.position] - 1,
      );
    }
  });

  const positions = Object.keys(rosterRequirements);
  grid.innerHTML = "";

  // Header row
  const headerRow = document.createElement("div");
  headerRow.className = "positions-row positions-header-row";

  const teamHeader = document.createElement("div");
  teamHeader.className = "positions-cell team-cell";
  teamHeader.textContent = "Team";
  headerRow.appendChild(teamHeader);

  positions.forEach((pos) => {
    const posHeader = document.createElement("div");
    posHeader.className = "positions-cell";
    posHeader.textContent = pos;
    headerRow.appendChild(posHeader);
  });

  grid.appendChild(headerRow);

  // Team rows
  for (let i = 1; i <= numTeams; i++) {
    const teamRow = document.createElement("div");
    teamRow.className = "positions-row";
    if (i === currentTeam) {
      teamRow.classList.add("active-team-row");
    }

    const teamCell = document.createElement("div");
    teamCell.className = "positions-cell team-cell";

    // Get team name and owner from loaded data
    const teamName =
      (teamNames.length > 0 && teamNames[i - 1]) || `Team ${i}`;
    const teamOwner = (teamOwners.length > 0 && teamOwners[i - 1]) || "";

    // Create team name div
    const teamNameDiv = document.createElement("div");
    teamNameDiv.className = "team-name";
    teamNameDiv.textContent = teamName;
    teamCell.appendChild(teamNameDiv);

    // Create team owner div if owner exists
    if (teamOwner) {
      const teamOwnerDiv = document.createElement("div");
      teamOwnerDiv.className = "team-owner";
      teamOwnerDiv.textContent = teamOwner;
      teamCell.appendChild(teamOwnerDiv);
    }

    teamRow.appendChild(teamCell);

    positions.forEach((pos) => {
      const posCell = document.createElement("div");
      posCell.className = "positions-cell";
      const remaining = counts[i][pos];
      posCell.textContent = remaining;

      if (remaining === 0) {
        posCell.classList.add("complete");
      } else if (remaining === rosterRequirements[pos]) {
        posCell.classList.add("empty");
      } else {
        posCell.classList.add("partial");
      }

      teamRow.appendChild(posCell);
    });

    grid.appendChild(teamRow);
  }
}

// Listen for updates from main window (localStorage fallback)
window.addEventListener("storage", (e) => {
  if (e.key === "draftCurrentTeam") {
    teamName.textContent = e.newValue || "Team 1";
  } else if (e.key === "draftCurrentPick") {
    pickNumber.textContent = e.newValue || "1";
    updatePositionsTracker();
  } else if (e.key === "draftCurrentRound") {
    roundNumber.textContent = e.newValue || "1";
    updatePositionsTracker();
  } else if (e.key === "draftTimeLimit") {
    // Don't update if timer is running
    if (!isRunning) {
      timeRemaining = parseInt(e.newValue) || 120;
      updateDisplay();
    }
  } else if (e.key === "draftTimeRemaining") {
    // Sync time remaining (fallback for browsers without BroadcastChannel)
    if (!timerChannel) {
      const newTime = parseInt(e.newValue);
      if (!isNaN(newTime)) {
        timeRemaining = newTime;
        updateDisplay();
      }
    }
  } else if (e.key === "draftTimerCommand") {
    // Fallback for browsers without BroadcastChannel
    if (!timerChannel) {
      const storedTime = parseInt(
        localStorage.getItem("draftTimeRemaining"),
      );
      if (!isNaN(storedTime)) {
        timeRemaining = storedTime;
      }

      if (e.newValue === "start" && !isRunning) {
        startTimerInternal();
      } else if (e.newValue === "pause" && isRunning) {
        pauseTimerInternal();
      } else if (e.newValue === "reset") {
        resetTimerInternal();
      }
    }
  } else if (e.key === "draftState") {
    updatePositionsTracker();
  }
});

// Periodic sync health check - detect if main window has stopped sending sync messages
setInterval(() => {
  if (controlledByMainWindow && isRunning) {
    const timeSinceLastSync = Date.now() - lastSyncTime;
    // If we haven't received a sync in 3 seconds, take over the countdown
    if (timeSinceLastSync > 3000) {
      console.log('Sync lost from main window, taking over countdown');
      controlledByMainWindow = false;
      // Start our own interval if we don't have one
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          timeRemaining--;
          updateDisplay();
          if (timeRemaining <= 0) {
            pauseTimerInternal();
          }
        }, 1000);
      }
    }
  }
}, 1000);

// Initialize from localStorage
async function initializeTimer() {
  // Load team names first
  await loadTeamNames();

  teamName.textContent =
    localStorage.getItem("draftCurrentTeam") || "Team 1";
  pickNumber.textContent =
    localStorage.getItem("draftCurrentPick") || "1";
  roundNumber.textContent =
    localStorage.getItem("draftCurrentRound") || "1";

  const storedTimeRemaining = localStorage.getItem("draftTimeRemaining");
  const storedTimeLimit = localStorage.getItem("draftTimeLimit");
  timeRemaining = storedTimeRemaining
    ? parseInt(storedTimeRemaining)
    : storedTimeLimit
      ? parseInt(storedTimeLimit)
      : 120;

  updateDisplay();
  updatePositionsTracker();

  // Request sync from main window
  if (timerChannel) {
    timerChannel.postMessage({ action: "request-sync" });
  }
}

// Initialize when page loads
initializeTimer();
