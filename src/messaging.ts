
chrome.storage.local.get(["delay", "mode"]).then(function (data) {

    if (data.mode === "auto") {
        if (data.delay > 0) {
            setTimeout(requestZoom, data.delay);
        } else {
            requestZoom();
        }
    } else if (data.mode === "semi") {
        console.log("semi mode");
    }
});


chrome.runtime.onMessage.addListener((message, sender, cb) => {
    console.log("onMessage", message, sender);

    if (message.msg === "info") {
        console.log("info");

    }
    cb("nothing");

});

function requestZoom() {
    chrome.runtime.sendMessage({ msg: "zoomit" }, (response) => {
        console.log("handling response", response);

        if (response.msg === "zoomed") {
            console.log("zoomed");

        }
    });
}
