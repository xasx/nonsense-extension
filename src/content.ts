window.onload = () => {
    const button = document.createElement("button");
    button.id = "dmButton";
    button.textContent = chrome.i18n.getMessage("dmButtonText");

    button.addEventListener("click", () => enableDarkMode());

    const toggle = document.createElement("input");
    toggle.id = "dmToggle";
    toggle.type = "checkbox";

    toggle.addEventListener("click", () => storeSetting()); 
    

    const end = document.querySelector("#end");
    end?.prepend(button, toggle);

    checkSetting();
}

function checkSetting() {
    chrome.storage.local.get(["enabled"], (result) => {
        const dmToggle = document.getElementById("dmToggle") as HTMLInputElement;
        dmToggle.checked = result.enabled;

        if (result.enabled) {
            enableDarkMode();
        }
    })
}

function storeSetting() {
    const dmToggle = document.getElementById("dmToggle") as HTMLInputElement;
    const isEnabled = dmToggle.checked;
    const setting = { enabled: isEnabled };

    chrome.storage.local.set(setting, () => {
        console.log("Saved", setting);
    });

}

function enableDarkMode() {
    const ytApp = document.getElementsByTagName("ytd-app")[0] as HTMLElement;
    ytApp.style.backgroundColor = "black";

}