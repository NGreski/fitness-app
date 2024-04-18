let distanceTraveled = 0; // in miles
let startTime = null;
let lastPosition = null;
let timerInterval = null; // Interval ID for updating the timer
let sessionLog = []; // Array to store session history

const distanceElement = document.getElementById('distance');
const timeElement = document.getElementById('time');
const startButton = document.getElementById('startButton');
const logList = document.getElementById('logList');

startButton.addEventListener('click', () => {
    if (startButton.textContent === 'Go') {
        startTracking();
    } else {
        stopTracking();
    }
});

function startTracking() {
    startButton.textContent = 'Stop';
    startTime = new Date();
    timerInterval = setInterval(updateTimerAndDistance, 1000); // Start updating timer and distance every second
    navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError, {
        enableHighAccuracy: true // Use high accuracy for position tracking
    });
}

function stopTracking() {
    startButton.textContent = 'Go';
    clearInterval(timerInterval); // Stop updating the timer and distance
    logSession(); // Log the current session
    distanceTraveled = 0;
    startTime = null;
    updateDistanceUI();
    updateTimeUI();
    lastPosition = null;
    navigator.geolocation.clearWatch();
}

function handlePositionUpdate(position) {
    if (!startTime) return; // Tracking not started

    const { latitude, longitude } = position.coords;
    const currentPosition = { latitude, longitude };

    if (lastPosition) {
        const distanceInMiles = calculateDistance(lastPosition, currentPosition);
        distanceTraveled += distanceInMiles;
        updateDistanceUI();
    }

    lastPosition = currentPosition;
}

function updateTimerAndDistance() {
    if (startTime) {
        updateTimer();
        updateDistanceUI();
    }
}

function updateTimer() {
    if (startTime) {
        const currentTime = new Date();
        const elapsedTimeSeconds = Math.round((currentTime - startTime) / 1000);
        updateTimeUI(elapsedTimeSeconds);
    }
}

function updateDistanceUI() {
    distanceElement.textContent = `Distance: ${distanceTraveled.toFixed(2)} miles`;
}

function updateTimeUI(elapsedTimeSeconds) {
    timeElement.textContent = `Time: ${elapsedTimeSeconds} seconds`;
}

function calculateDistance(pos1, pos2) {
    const earthRadiusMiles = 3958.8; // in miles (approximate radius of Earth)
    const { latitude: lat1, longitude: lon1 } = pos1;
    const { latitude: lat2, longitude: lon2 } = pos2;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusMiles * c;
    return distance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function handlePositionError(error) {
    console.error('Error getting position:', error.message);
}

function logSession() {
    if (startTime) {
        const currentTime = new Date();
        const elapsedTimeSeconds = Math.round((currentTime - startTime) / 1000);

        // Create a new session log entry
        const sessionEntry = {
            startTime: startTime.toLocaleString(),
            duration: `${elapsedTimeSeconds} seconds`,
            distance: `${distanceTraveled.toFixed(2)} miles`
        };

        // Add session entry to the log
        sessionLog.push(sessionEntry);

        // Display the session log
        displaySessionLog();
    }
}

function displaySessionLog() {
    // Clear existing log display
    logList.innerHTML = '';

    // Iterate through sessionLog and display each entry
    sessionLog.forEach((session, index) => {
        const sessionItem = document.createElement('li');
        sessionItem.classList.add('logEntry');
        sessionItem.textContent = `Session ${index + 1}: Started at ${session.startTime}, Duration: ${session.duration}, Distance: ${session.distance}`;
        logList.appendChild(sessionItem);
    });
}


