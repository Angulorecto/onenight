function loadHost() {
  document.getElementById("code").innerHTML = localStorage.getItem("code");
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

if (document.getElementById("style")) {
  console.log('Stylesheet exists!');
} else {
  newStyle('styles/index.css');
}
