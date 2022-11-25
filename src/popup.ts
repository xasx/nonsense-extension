function zoomIt() {
    console.log("zooming request message...");
    chrome.runtime.sendMessage({ msg: "zoomit"});
}

document.getElementById("zbtn").addEventListener("click", zoomIt);