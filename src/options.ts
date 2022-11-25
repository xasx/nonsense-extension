function saveSettings() {
    const mode = document.querySelector('input[name="mode"]:checked') as HTMLInputElement;
    if (mode === null) {
            return;
        }


    let settings = { mode: mode.value };
    chrome.storage.local.set(settings, function() {
        console.log('Settings saved.');
        const status = document.getElementById("status") as HTMLDivElement;
        status.textContent = "Settings saved.";
    });
}

function loadSettings() {   
    chrome.storage.local.get('mode', function(data) {
        
        const mode = document.getElementById("m" + data.mode) as HTMLInputElement;
        mode.checked = true;
        document.getElementById("status").textContent = "Settings loaded.";
    });
}

document.getElementById("save").addEventListener("click", saveSettings);
document.addEventListener("DOMContentLoaded", loadSettings);