window.onload = () => {
    chrome.storage.local.get(["blacklistItems"], (data) => {
        var show = true;
        const host = window.location.hostname;
        console.log(host);
        for (const item of data.blacklistItems) {
            if (host.includes(item)) { 
                console.log("url blacklisted", host, item);
                show = false; 
                break;
            }
        }
        if (show) {
            addScrollButton();
        }
    });
}
function addScrollButton() {
    const button = document.createElement("button") as HTMLButtonElement;
    button.id = "scrollToTop";

    button.style.position = "fixed";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.right = "5px";
    button.style.bottom = "5px";
    button.style.borderRadius = "50%";
    button.style.background = "white";
    button.style.fontSize = "32px";
    button.style.fontFamily = "Helvetica";
    button.style.borderWidth = "1px";
    button.style.boxShadow = "-1px 1px 2px 2px grey";
    button.style.color = "black";
    button.style.textAlign = "center";
    button.style.margin = "0";
    button.style.padding = "0";
    button.style.alignContent = "center";
    button.style.justifyContent = "center";
    button.style.alignmentBaseline = "center";
    button.style.zIndex = "10240";

    button.style.borderColor = "grey";

    button.innerHTML = "&uArr;";

    button.addEventListener("click", (event) => {
        window.scrollTo(0, 0);
    });

    button.addEventListener("contextmenu", (event) => {
        button.remove();
        event.preventDefault();
    });


    document.body.appendChild(button);
}

