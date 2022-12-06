function saveSettings() {
    const mode = document.querySelector('input[name="mode"]:checked') as HTMLInputElement;
    if (mode === null) {
        setStatus("No mode selected. Please select one.");
        return;
    }

    const zoomfactor = document.getElementById("zoomfactor") as HTMLInputElement;

    if (zoomfactor === null || !isFinite(Number(zoomfactor.value))) {
        setStatus("Invalid Zoom factor value. Must be a positive number.");
        return;
    }

    const delay = document.getElementById("delay") as HTMLInputElement;

    if (delay === null || !isFinite(Number(delay.value))) {
        setStatus("Invalid value for Delay. Must be a positive number.");
        return;
    }

    const showOptions = document.getElementById("showOptions") as HTMLInputElement;

    const blacklist = document.getElementById("blacklist") as HTMLTextAreaElement;
    const blacklistItems = blacklist.value.split("\n").sort().filter(bli => bli.length > 0);

    console.debug("Blacklist", blacklistItems);
    blacklist.value = blacklistItems.join("\n");

    let settings = { mode: mode.value, zoomfactor: zoomfactor.value, delay: delay.value, showOptions: showOptions.checked, blacklistItems };
    chrome.storage.local.set(settings).then(function () {
        console.debug('Settings saved');
        setStatus("Settings saved.");
    });
}

function setStatus(statusText: string) {
    const status = document.getElementById("status") as HTMLDivElement;

    status.textContent = statusText;
}

function loadSettings() {
    chrome.storage.local.get(['mode', "zoomfactor", "delay", "showOptions", "blacklistItems"])
        .then(function (data) {

            const mode = document.getElementById("m" + data.mode) as HTMLInputElement;
            mode.checked = true;

            const zoomfactor = document.getElementById("zoomfactor") as HTMLInputElement;
            zoomfactor.value = data.zoomfactor;

            const delay = document.getElementById("delay") as HTMLInputElement;
            delay.value = data.delay;

            const showOptions = document.getElementById("showOptions") as HTMLInputElement;
            showOptions.checked = data.showOptions;

            const blacklist = document.getElementById("blacklist") as HTMLTextAreaElement;
            blacklist.value = data.blacklistItems.join("\n");

            document.getElementById("status").textContent = "Settings loaded.";
        });
}

document.getElementById("save").addEventListener("click", saveSettings);
document.addEventListener("DOMContentLoaded", loadSettings);