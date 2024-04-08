const form = document.getElementById('createRoomForm');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const roomName = document.getElementById('roomName').value;
  try {
    const response = await fetch('/createRoom', {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify({ roomName })
    });
    const { roomCode } = await response.json();
    roomCodeDisplay.innerText = `Your room code is: ${roomCode}`;
  } catch (error) {
    console.error('Error creating room:', error);
  }
});
