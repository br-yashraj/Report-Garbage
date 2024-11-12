// ! Current Location
const locIcon = document.getElementById("Locationicon");

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

function showError(error) {
  switch (error.code) {
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
locIcon.addEventListener("click", getLocation);

// ! Real time Video Capturing
const videoElement = document.getElementById("videoElement");
const startButton = document.getElementById("startRecordingButton");
const stopButton = document.getElementById("stopRecordingButton");
const recordedVideo = document.getElementById("recordedVideo");

let mediaRecorder;
let recordedChunks = [];
let stream;

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
  alert("Your browser does not support video capture or recording.");
} else {
  function startVideoCapture() {
    const constraints = {
      video: {
        facingMode: "environment", // Use the rear camera
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (userStream) {
        stream = userStream;
        videoElement.srcObject = stream;
      })
      .catch(function (error) {
        console.error("Error accessing the camera: ", error);
      });
  }

  function startRecording() {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = function () {
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(videoBlob);
      recordedVideo.src = videoUrl;
    };

    mediaRecorder.start();
    startButton.disabled = true;
    stopButton.disabled = false;
  }

  function stopRecording() {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
  }

  window.onload = startVideoCapture;

  startButton.addEventListener("click", startRecording);
  stopButton.addEventListener("click", stopRecording);
}

// ! Submit to Authority with Validation
const submitBtn = document.getElementById("btn-send");
const mobileInput = document.getElementById("mob");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

// Function to check if inputs are filled
function checkInputs() {
  const isMobileFilled = mobileInput.value.trim() !== "";
  const isLatitudeFilled = latitudeInput.value.trim() !== "";
  const isLongitudeFilled = longitudeInput.value.trim() !== "";

  submitBtn.disabled = !(isMobileFilled && isLatitudeFilled && isLongitudeFilled);
}

// Add event listeners to monitor changes in the input fields
mobileInput.addEventListener("input", checkInputs);
latitudeInput.addEventListener("input", checkInputs);
longitudeInput.addEventListener("input", checkInputs);

// Click event with validation
submitBtn.addEventListener("click", () => {
  const isMobileFilled = mobileInput.value.trim() !== "";
  const isLatitudeFilled = latitudeInput.value.trim() !== "";
  const isLongitudeFilled = longitudeInput.value.trim() !== "";

  // Show alert if any field is empty
  if (!isMobileFilled || !isLatitudeFilled || !isLongitudeFilled) {
    alert("Please fill in your mobile number and location (latitude and longitude) before submitting.");
    return; // Stop further execution if fields are not filled
  }

  // Proceed with submission if all fields are filled
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("lastSubmissionDate", today);
  alert("Submission successful!");
  submitBtn.disabled = true;
});
