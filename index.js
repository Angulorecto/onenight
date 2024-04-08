function newStyle(styleurl) {
  let style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = styleurl;
}
function hostRoom() {
  
}

if ((localStorage.getItem("ingame") == false) or (localStorage.getItem("ingame") === null)) {
  newStyle("styles/index.css");
}
