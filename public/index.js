function loadHost() {
  document.getElementById("code").innerHTML = localStorage.getItem("code");
  checkHome();
}

function loadHome() {
  localStorage.removeItem("code");
}

function setName(event) {
  event.preventDefault();
  localStorage.setItem("name", document.getElementById("name").value);
  document.getElementsByClassName("index")[0].style.animation = "0.5s fadeOut forwards";
}

function checkHome() {
  const referrer = document.referrer;
  
  if (referrer.endsWith("/")) {
    // user came from '/'
    if (window.location.pathname == "/room") {
      document.getElementById("name").value = localStorage.getItem("name");
    } else {
      return
    }
    
    // Perform whatever action you want here for users coming from '/door'
  } else {
    // user did not come from '/' 
    window.location.href = "/";
  }
}

async function hostRoom() {
  try {
    const response = await fetch('/createRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const { roomCode } = await response.json();
    localStorage.setItem("code", `${roomCode}`);
    window.location.href = "/host";
  } catch (error) {
    console.error('Error creating room:', error);
  }
}

async function joinRoom(event) {
  event.preventDefault();
  const code = document.getElementById('code').value;
  try {
    const response = await fetch(`/joinRoom/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.success) {
      window.location.href = "/room";
    } else {
      alert('Failed to join room. Please check the room code and try again.');
    }
  } catch (error) {
    console.error('Error joining room:', error);
  }
}