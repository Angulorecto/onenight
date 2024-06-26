import { encodeCode, decodeCode, getUrlParameter } from './global.js';
import stuffs from './config.js';
// Function to get the value of a URL parameter by name

function loadSocket() {
  let e = document.createElement("script");
  e.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
  document.getElementsByTagName("head")[0].appendChild(e);
  return e;
}

function loadHome() {
  let e = loadSocket();
  e.onload = () => {
    const createRoomButton = document.getElementById("hostRoom");
    const joinForm = document.getElementById("joinForm");
    const checkCodeForm = document.getElementById("checkCodeForm");
    const resultMessage = document.getElementById("resultMessage");
    const socket = io();

    if (createRoomButton) {
      createRoomButton.addEventListener("click", () => {
        socket.emit("create room");
      });
    }

    if (joinForm) {
      joinForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const roomCode = document.getElementById("code").value;
        socket.emit("join room", { roomCode: encodeCode(roomCode) });
      });
    }

    if (checkCodeForm) {
      checkCodeForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const code = document.getElementById("code").value;
        const response = await fetch(`/check-code?code=${code}`);
        const data = await response.json();
        resultMessage.textContent = data.exists ? "Code exists!" : "Code does not exist.";
      });
    }

    socket.on("room code", (roomCode) => {
      window.location.href = `/host?code=${roomCode}`;
    });

    socket.on("joined room", (roomCode) => {
      window.location.href = `/room?code=${roomCode}`;
    });
  
    socket.on("room full", () => {
      console.log("Room is full, please try joining another room.");
    });

    // Listen for the disconnect event and emit it to the server
    window.addEventListener("beforeunload", () => {
      socket.emit("disconnect host");
    });
  };
}

function loadHost() {
  let e = loadSocket();
  e.onload = () => {
    const hostRoomCode = getUrlParameter('code');
    const decoded = decodeCode(hostRoomCode);
    document.getElementById("code").innerHTML = decoded;
    const start = document.getElementsByClassName("startGame")[0];
    const socket = io();

    socket.on("make player", (data) => {
      start.style.backgroundColor = 'rgb(255, 0, 0)';
    });

    start.addEventListener("click", function() {
      start.style.backgroundColor = '#FF0000';
    });
  };
}

function loadRoom() {
  let e = loadSocket();
  e.onload = () => {
    const nameForm = document.getElementById("nameForm");
    const socket = io();

    nameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;
      socket.emit("name join", { code: getUrlParameter("code"), name: name });
      nameForm.style.animation = "fadeOut 0.5s forwards";
    });
  };
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname == "/") {
    loadHome();
  } else if (window.location.pathname == "/host") {
    loadHost();
  } else if (window.location.pathname == "/room") {
    loadRoom();
  }
});