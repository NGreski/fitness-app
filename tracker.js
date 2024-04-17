let distanceTraveled = 0; // in meters
let startTime = null;
let lastPosition = null;

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
    navigator.geolocation.watchPosition(handlePositionUpdate, handlePositionError);
}

function stopTracking() {
    startButton.textContent = 'Go';
    distanceTraveled = 0;
    startTime = null;
    distanceElement.textContent = 'Distance: 0 meters';
    timeElement.textContent = 'Time: 0 seconds';
    lastPosition = null; // Reset lastPosition when stopping tracking
    navigator.geolocation.clearWatch();
}

function handlePositionUpdate(position) {
    if (!startTime) return; // Tracking not started

    const { latitude, longitude } = position.coords;
    const currentPosition = new google.maps.LatLng(latitude, longitude);

    if (lastPosition) {
        const distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(lastPosition, currentPosition);
        distanceTraveled += distanceInMeters;
    }

    const currentTime = new Date();
    const elapsedTimeSeconds = Math.round((currentTime - startTime) / 1000);
    distanceElement.textContent = `Distance: ${distanceTraveled.toFixed(2)} meters`;
    timeElement.textContent = `Time: ${elapsedTimeSeconds} seconds`;

    lastPosition = currentPosition;
}

function handlePositionError(error) {
    console.error('Error getting position:', error.message);
}
