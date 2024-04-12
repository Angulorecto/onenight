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
    const socket = io();

    createRoomButton.addEventListener("click", () => {
        socket.emit("create room");
    });

    socket.on("room code", (roomCode) => {
        window.location.href = `/host?code=${roomCode}`;
    });
  };

  document.getElementsByTagName("head")[0].appendChild(e);
}

function loadHost() {
  // Get the value of the code parameter from the URL
  var hostRoomCode = getUrlParameter('code');
  // Update the element's innerHTML with the hostRoomCode value
  document.getElementById("code").innerHTML = hostRoomCode;
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname == "/") {
    loadHome();
  } else if (window.location.pathname == "/host") {
    loadHost();
  }
});