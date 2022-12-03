window.addEventListener("load", () => {
    chrome.storage.local.get(["blacklistItems"], (data) => {
        var show = true;
        const host = window.location.hostname;
        
        for (const item of data.blacklistItems) {
            if (host.includes(item)) {
                console.debug("Hostname blacklisted", host, item);
                show = false;
                break;
            }
        }
        if (show) {
            window.addEventListener("scroll", (e) => {
                conditionalScrollButton();
            });
            conditionalScrollButton();
        }
    });
});

function conditionalScrollButton() {
    if (window.scrollY > 0 || window.scrollX > 0) {
        if (document.getElementById("scrollToTop") === null) {
            addScrollButton();
        }
    } else {
        removeScrollButton();
    }
}

function addScrollButton() {
    const button = document.createElement("button") as HTMLButtonElement;
    button.id = "scrollToTop";
    button.type = "button";

    button.style.position = "fixed";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.right = "5px";
    button.style.bottom = "5px";
    button.style.borderRadius = "50%";
    button.style.background = "white";
    button.style.fontSize = "32px";
    button.style.fontFamily = "Helvetica";
    button.style.borderWidth = "0px";
    button.style.boxShadow = "0 0 0 1px rgb(0 0 0 / 8%), 0 4px 12px 1px rgb(0 0 0 / 20%)";
    button.style.color = "grey";
    button.style.textAlign = "center";
    button.style.margin = "0";
    button.style.padding = "0";
    button.style.alignContent = "center";
    button.style.justifyContent = "center";
    button.style.alignmentBaseline = "center";
    button.style.zIndex = "10240";

    button.style.borderColor = "grey";

    button.title = chrome.i18n.getMessage("scrollToTop");
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGElement;
    svg.setAttribute("fill", "grey");
    svg.setAttribute("stroke", "grey");
    svg.setAttribute("viewBox", "0 0 1000 1000");
    svg.setAttribute("width", "50%"); 
    svg.setAttribute("height", "50%");
    svg.id = "upArrowSvg";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path") as SVGPathElement;

    svg.appendChild(path);
    button.appendChild(svg);

    path.setAttribute("d",
        "M585.2,61.5L585.2,61.5c-12.9-12.9-28.7-22.7-45.8-28.6c-4.9-1.7-10-3.1-15.2-4.2c-22.6-4.8-46.8-2.6-68.3," +
        "5.8c-15.4,6-29.4,15.3-41.2,27l0,0L45.3,431c-47.1,47.1-47.1,123.3,0,170.4c47.1,47.1,123.3,47.1,170.4,0l" +
        "163.8-163.8v415.7c0,66.6,53.9,120.5,120.5,120.5c66.6,0,120.5-53.9,120.5-120.5V437.6l163.8,163.8c23.5,23.5," +
        "54.3,35.2,85.2,35.2s61.6-11.7,85.2-35.2c47.1-47.1,47.1-123.3,0-170.4L585.2,61.5z"
    );

    button.addEventListener("click", (event) => {
        //window.scrollTo(0, 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    button.addEventListener("mouseover", (event) => {
        button.style.borderColor = "darkblue";
        button.style.color = "white";
        button.style.backgroundColor = "cornflowerblue";
        svg.setAttribute("fill", "white");
    });

    button.addEventListener("mouseout", (event) => {
        button.style.borderColor = "grey";
        button.style.color = "grey";
        button.style.backgroundColor = "white";
        svg.setAttribute("fill", "grey");
    });

    button.addEventListener("contextmenu", (event) => {
        button.remove();
        event.preventDefault();
    });


    document.body.appendChild(button);
}

function removeScrollButton() {
    const button = document.getElementById("scrollToTop") as HTMLButtonElement;
    if (button) {
        button.remove();
    }
}

chrome.runtime.onMessage.addListener((message, sender, cb) => {
    console.debug("onMessage", message, sender);

    if (message.msg === "checkScrollButton") {
        removeScrollButton();
        conditionalScrollButton();
    }
    cb();

});

