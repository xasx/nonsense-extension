async function zoomIt() {
    console.log("zooming request message...");
    await chrome.runtime.sendMessage({ msg: "zoomit" });
}

document.getElementById("zbtn").addEventListener("click", zoomIt);
chrome.storage.local.get("mode").then(function (mode) {
    document.getElementById("container").innerText = "Mode: " + mode.mode;
});

async function info() {
    await chrome.tabs.create({
        url: chrome.runtime.getURL("info.html"),
        active: true,
    });
}

document.getElementById("info").addEventListener("click", info);