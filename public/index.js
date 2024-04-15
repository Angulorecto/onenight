// Function to get the value of a URL parameter by name
function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadSocket() {
  let e = document.createElement("script");
  e.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
  document.getElementsByTagName("head")[0].appendChild(e);
  return e;
}

function loadHome() {
  let e = document.createElement("script");
  e.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
  e.onload = () => {
    const createRoomButton = document.getElementById("hostRoom");
    const joinForm = document.getElementById("joinForm");
    const roomCodeInput = document.getElementById("code");
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
        socket.emit("join room", { roomCode: btoa(btoa(btoa(btoa(btoa(btoa(roomCode)))))) });
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

  document.getElementsByTagName("head")[0].appendChild(e);
}

function loadHost() {
  var hostRoomCode = getUrlParameter('code');
  var decoded = atob(atob(atob(atob(atob(atob(hostRoomCode))))));
  document.getElementById("code").innerHTML = decoded;
  let e = document.createElement("script");
  e.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
  e.onload = () => {
    const nameForm = document.getElementsByClassName("nameForm")[0];
    const socket = io();

    socket.on("make player", (data) => {
      if (data.code == getUrlParameter("code")) {
        const e = document.createElement("p");
        e.innerHTML = data.name;
        document.getElementsByClassName("players")[0].appendChild(e);
      }
    });
  };

  document.getElementsByTagName("head")[0].appendChild(e);
}
function loadRoom() {
  let e = document.createElement("script");
  e.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
  e.onload = () => {
    const nameForm = document.getElementsByClassName("nameForm")[0];
    const socket = io();

    nameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;
      socket.emit("name join", { code: getUrlParameter("code"), name: name });
      nameForm.style.animation = "0.5 fadeOut forwards";
    });

    socket.on("room code", (roomCode) => {
      window.location.href = `/host?code=${roomCode}`;
    });
  };

  document.getElementsByTagName("head")[0].appendChild(e);
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