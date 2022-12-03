chrome.runtime.onInstalled.addListener((details) => {
    console.debug("installed", details);
    chrome.storage.local.get(["showOptions"], (data) => {
        if (data.showOptions) {
            chrome.runtime.openOptionsPage(() => {
                console.debug("opened options page");
            });
        }
    });
})

chrome.bookmarks.onCreated.addListener((_, bm) => {
    console.debug("New bookmark", bm);
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    console.debug("onMessage", message, sender, response);

    if (message.msg === "zoomit") {
        var tabId: number;
        if (sender.tab !== undefined) {
            tabId = sender.tab.id;
        } else {
            getCurrentTab().then((tab) => { tabId = tab.id; });
        }

        var zoomfactor: number;

        chrome.storage.local.get(["zoomfactor"]).then((value) => {
            console.debug("zoom factor loaded", value);
            zoomfactor = value.zoomfactor;

            if (zoomfactor === undefined) {
                zoomfactor = 0;
            }
            if (zoomfactor >= 0) {
                const bt = zoomfactor > 0 ? zoomfactor.toString() : "•••";
                setBadgeText(bt, tabId);


                chrome.tabs.setZoom(tabId, zoomfactor / 100, () => {
                    console.debug("zoomed tab", tabId, zoomfactor);

                });

                addResetMenuItem();
                
                response({ msg: "zoomed", factor: zoomfactor });
            }
        });
    }
    return true;
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "zoomReset") {

        chrome.tabs.setZoom(tab.id, 0, () => {
            console.debug("reset zoom", info, tab);
            chrome.contextMenus.remove("zoomReset");
            chrome.action.setBadgeText({ text: "", tabId: tab.id });
        });
        return true;
    }

});

chrome.tabs.onActivated.addListener((tai) => {
    console.debug("tab activated", tai);
    chrome.tabs.sendMessage(tai.tabId, { msg: "checkScrollButton"})
                    .catch((reason) => { console.error("error sending message", reason); });
});

chrome.action.onClicked.addListener((tab) => {
    console.debug("clicked", tab);
});

function addResetMenuItem() {
    chrome.contextMenus.create({
        id: "zoomReset",
        title: "Reset zoom",
        type: "normal",
        contexts: ["all"]
    }, () => {
        console.debug("context menu item reset zoom created");
    });
}

function setBadgeText(bt: string, tabId: number) {
    chrome.action.setBadgeText({ text: bt, tabId });
    chrome.action.setBadgeBackgroundColor({ color: "cornflowerblue", tabId });
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
