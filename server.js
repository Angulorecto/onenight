import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import http from 'http';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { encodeCode, decodeCode, getUrlParameter } from './public/js/global.js';
import stuffs from './public/js/config.js';
import { config } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0 }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/code", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkcode.html'));
});

app.get("/room", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
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

  socket.on("join room", (data) => {
    const roomCode = data.roomCode;
    socket.emit("joined room", roomCode);
    console.log("Join room recieved with code: " + roomCode + ", joined room sent");
  });

  socket.on("name join", (data) => {
    console.log(data);
    socket.emit("make player", { code: data.code, name: data.name });
    console.log("Emitted make player event");
  });

  socket.on("room full", () => {
    console.log("Room is full, please try joining another room.");
  });
});

function generateRoomCode() {
  let roomCode;
  for (let i = 0; i < stuffs.reroll; i++) {
    roomCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit room code
    if (!globalRoomCodes.has(encodeCode(roomCode))) {
      return roomCode;
    }
  } // If re-rolling fails 3 times, increase code length by 1 digit
  for (let i = 0; i < stuffs.reroll; i++) {
    roomCode = Math.floor(1000000 + Math.random() * 9000000); // Generate 7-digit room code
    if (!globalRoomCodes.has(encodeCode(roomCode))) {
      return roomCode;
    }
  }
}

// Route to check if a code exists in the globalRoomCodes set
app.get("/check-code", (req, res) => {
  const code = parseInt(req.query.code);
  const encodedCode = encodeCode(code);
  if (globalRoomCodes.has(encodedCode)) {
    res.send({ exists: true });
  } else {
    res.send({ exists: false });
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
