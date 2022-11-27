function zoomIt() {
    console.log("zooming request message...");
    chrome.runtime.sendMessage({ msg: "zoomit"});
}

document.getElementById("zbtn").addEventListener("click", zoomIt);
chrome.storage.local.get("mode").then(function (mode) {
    document.getElementById("container").innerText = "Mode: " + mode.mode;
});