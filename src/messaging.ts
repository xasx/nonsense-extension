
chrome.storage.local.get(["delay", "mode"]).then(function (data) {

    if (data.mode === "auto") {
        if (data.delay > 0) {
            setTimeout(requestZoom, data.delay);
        } else {
            requestZoom();
        }
    } else if (data.mode === "semi") {
        console.debug("semi mode");
    }
});

function requestZoom() {
    chrome.runtime.sendMessage({ msg: "zoomit" }, (response) => {
        console.debug("handling response", response);

        if (response.msg === "zoomed") {
            console.debug("zoomed");

        }
    });
}
