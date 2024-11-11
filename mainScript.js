
// ! Curent Loction
const locIcon = document.getElementById('Locationicon');


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLoc, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showLoc(pos) {
    document.getElementById("latitude").value = pos.coords.latitude;
    document.getElementById("longitude").value = pos.coords.longitude;
}
// Handle Error If any
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
// Add event listener to the location icon to trigger geolocation
locIcon.addEventListener('click', getLocation);

// ! Real time Video Capturing
const videoElement = document.getElementById('videoElement');
const startButton = document.getElementById('startRecordingButton');
const stopButton = document.getElementById('stopRecordingButton');
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder;
let recordedChunks = [];
let stream;

// Feature detection: check if getUserMedia and MediaRecorder are supported
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
    alert("Your browser does not support video capture or recording.");
} else {
    // Start video capture using the rear camera
    function startVideoCapture() {
        const constraints = {
            video: {
                facingMode: "environment" // Use the rear camera
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (userStream) {
                stream = userStream;
                videoElement.srcObject = stream;
            })
            .catch(function (error) {
                console.error('Error accessing the camera: ', error);
            });
    }

    // Start recording
    function startRecording() {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (event) {
            recordedChunks.push(event.data);
        };

        mediaRecorder.onstop = function () {
            const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(videoBlob);

            recordedVideo.src = videoUrl;
        };

        mediaRecorder.start();
        startButton.disabled = true;
        stopButton.disabled = false;
    }

    // Stop recording
    function stopRecording() {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    // Start video capture when the page loads
    window.onload = startVideoCapture;

    // Button event listeners
    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
}