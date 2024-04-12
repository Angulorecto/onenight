const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(bodyParser.json());

const globalRoomCodes = new Set();

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

// Routes for serving HTML files
app.get('/', (req, res) => {
  const userAgent = req.headers['user-agent'];
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  // Change stylesheet settings based on the result
  if (isMobile) {
    // For example, send a different HTML file for mobile devices
    res.sendFile(path.join(__dirname, 'public', 'mobileIndex.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

io.on("connection", (socket) => {
  socket.on("create room", () => {
    const roomCode = generateRoomCode();
    globalRoomCodes.add(roomCode);
    
    socket.emit("room code", roomCode);
  });
});

function generateRoomCode() {
  let roomCode;
  do {
    roomCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit room code
  } while (globalRoomCodes.has(roomCode));
  
  return roomCode;
}

app.get("/host", (req, res) => {
  const hostRoomCode = req.query.code;
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