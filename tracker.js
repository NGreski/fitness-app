let distanceTraveled = 0; // in miles
let startTime = null;
let lastPosition = null;
let timerInterval = null; // Interval ID for updating the timer

const distanceElement = document.getElementById('distance');
const timeElement = document.getElementById('time');
const startButton = document.getElementById('startButton');

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
    timerInterval = setInterval(updateTimer, 1000); // Start updating timer every second
    navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError);
}

function stopTracking() {
    startButton.textContent = 'Go';
    clearInterval(timerInterval); // Stop updating the timer
    distanceTraveled = 0;
    startTime = null;
    distanceElement.textContent = 'Distance: 0 miles';
    timeElement.textContent = 'Time: 0 seconds';
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
    }

    updateDistanceUI();
    lastPosition = currentPosition;
}

function updateTimer() {
    if (startTime) {
        const currentTime = new Date();
        const elapsedTimeSeconds = Math.round((currentTime - startTime) / 1000);
        timeElement.textContent = `Time: ${elapsedTimeSeconds} seconds`;
    }
}

function updateDistanceUI() {
    distanceElement.textContent = `Distance: ${distanceTraveled.toFixed(2)} miles`;
}

function calculateDistance(pos1, pos2) {
    const earthRadiusMiles = 3958.8; // in miles (approximate radius of Earth)
    const lat1 = pos1.latitude;
    const lon1 = pos1.longitude;
    const lat2 = pos2.latitude;
    const lon2 = pos2.longitude;

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
