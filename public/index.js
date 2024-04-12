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
document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname == "/") {
    loadHome();
  }
});