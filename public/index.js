function newStyle(styleurl) {
  if (document.getElementById("style")) {
    document.getElementById("style").remove();
  }
  let style = document.createElement("link");
  style.id = "style";
  style.rel = "stylesheet";
  style.href = styleurl;
  document.getElementsByTagName("head")[0].appendChild(style);
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
    newStyle('styles/hostRoom.css');
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
      alert('Joined room successfully!');
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
