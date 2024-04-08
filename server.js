const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let nextRoomId = 1;
const rooms = {};

app.post('/createRoom', (req, res) => {
  const roomId = nextRoomId++;
  const roomCode = generateRoomCode();
  rooms[roomCode] = { id: roomId, players: [] };
  res.json({ roomCode });
});

app.post('/joinRoom/:code', (req, res) => {
  const { code } = req.params;
  if (rooms[code]) {
    // Add logic to join the room (e.g., add player to room)
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

function generateRoomCode() {
  // Generate a random 6-character alphanumeric room code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});