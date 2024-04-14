const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/code", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkcode.html'));
});

app.get("/host", (req, res) => {
  const hostRoomCode = req.query.code;
  res.sendFile(path.join(__dirname, 'public', 'host.html'), { hostRoomCode });
});

const globalRoomCodes = new Set();

io.on("connection", (socket) => {
  socket.on("create room", () => {
    const roomCode = generateRoomCode();
    globalRoomCodes.add(encodeCode(roomCode));
    socket.emit("room code", encodeCode(roomCode));
  });

  socket.on("disconnect host", () => {
    for (let code of globalRoomCodes) {
      if (globalRoomCodes.has(code)) {
        globalRoomCodes.delete(code);
        break;
      }
    }
  });

  socket.on("join room", (roomCode) => {
    if (globalRoomCodes.has(roomCode)) {
      socket.join(roomCode);
      socket.emit("joined room", roomCode);
    } else {
      socket.emit("invalid room code");
    }
  });
});

function generateRoomCode() {
  let roomCode;
  for (let i = 0; i < 3; i++) {
    roomCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit room code
    if (!globalRoomCodes.has(encodeCode(roomCode))) {
      return roomCode;
    }
  } // If re-rolling fails 3 times, increase code length by 1 digit
  for (let i = 0; i < 3; i++) {
    roomCode = Math.floor(1000000 + Math.random() * 9000000); // Generate 7-digit room code
    if (!globalRoomCodes.has(encodeCode(roomCode))) {
      return roomCode;
    }
  }
}

function encodeCode(code) {
  let encoded = code.toString();
  for (let i = 0; i < 6; i++) {
    encoded = btoa(encoded);
  }
  return encoded;
}

function decodeCode(encoded) {
  let decoded = encoded;
  for (let i = 0; i < 6; i++) {
    decoded = atob(decoded);
  }
  return parseInt(decoded);
} // Route to check if a code exists in the globalRoomCodes set

app.get("/check-code", (req, res) => {
  const code = parseInt(req.query.code);
  const encodedCode = encodeCode(code);
  if (globalRoomCodes.has(encodedCode)) {
    res.send({ exists: true });
  } else {
    res.send({ exists: false });
  }
}); // Route to handle joining a room using a code

app.get("/join-room", (req, res) => {
  const roomCode = req.query.code;
  io.emit("join room", roomCode);
  res.send("Joining room...");
});

http.listen(3000, () => {
  console.log("Server running on port 3000");
});