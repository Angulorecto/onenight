const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(bodyParser.json());

let nextRoomId = 1;

app.locals.rooms = {};

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

// Routes for serving HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/host', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'host.html'));
});

app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

// Create a new room and generate a room code
app.post('/createRoom', (req, res) => {
  const roomId = nextRoomId++;
  const roomCode = generateRoomCode();
  app.locals.rooms[roomCode] = { id: roomId, players: [] };
  res.json({ roomCode });
});

// Join a room with a specific code
app.post('/joinRoom/:code', (req, res) => {
  const { code } = req.params;
  if (app.locals.rooms[code]) {
    const { playerName } = req.body;
    addPlayerToRoom(code, playerName);
    res.json({ success: true, playerId: app.locals.rooms[code].players[app.locals.rooms[code].players.length - 1].id });
  } else {
    res.json({ success: false });
  }
});

function generateRoomCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generatePlayerId() {
  return Math.random().toString(36).substr(2, 9);
}

function addPlayerToRoom(roomCode, playerName) {
  const player = { id: generatePlayerId(), name: playerName };
  app.locals.rooms[roomCode].players.push(player);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});