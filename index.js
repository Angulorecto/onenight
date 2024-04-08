function newStyle(styleurl) {
  if (document.getElementById("style")) {
    document.getElementById("style").remove();
  }
  let style = document.createElement("link");
  style.id = "style";
  style.rel = "stylesheet";
  style.href = styleurl;
  document.getElementsByTagName("head")[0].appendChild(style);
}
function hostRoom() {
  
}

if ((localStorage.getItem("ingame") == false) or (localStorage.getItem("ingame") === null) or (localStorage.getItem("ingame") === undefined)) {
  newStyle("styles/index.css");
}
