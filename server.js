const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const globalRoomCodes = new Set();

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
  res.sendFile(path.join(__dirname, 'public', 'host.html'), { hostRoomCode });
});

http.listen(3000, () => {
  console.log("Server running on port 3000");
});