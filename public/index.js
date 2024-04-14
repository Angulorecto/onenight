// Function to get the value of a URL parameter by name
function getUrlParameter(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadHome() {
  let e = document.createElement("script");
  e.src = "https://cdn.socket.io/4.7.5/socket.io.min.js";
  e.onload = () => {
    const createRoomButton = document.getElementById("hostRoom");
    const joinForm = document.getElementById("joinForm");
    const roomCodeInput = document.getElementById("roomCode");
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
        const roomCode = roomCodeInput.value;
        socket.emit("join room", roomCode);
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

    // Listen for the disconnect event and emit it to the server
    window.addEventListener("beforeunload", () => {
      socket.emit("disconnect host");
    });
  };

  document.getElementsByTagName("head")[0].appendChild(e);
}

function loadHost() {
  // Get the value of the code parameter from the URL
  var hostRoomCode = getUrlParameter('code');
  var coded = atob(atob(atob(atob(atob(atob(hostRoomCode))))));
  // Update the element's innerHTML with the hostRoomCode value
  document.getElementById("code").innerHTML = coded;
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname == "/") {
    loadHome();
  } else if (window.location.pathname == "/host") {
    loadHost();
  }
});