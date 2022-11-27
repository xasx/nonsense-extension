chrome.runtime.onInstalled.addListener((details) => {
    console.log("installed", details);
    chrome.storage.local.get(["showOptions"], (data) => {
        if (data.showOptions) {
            chrome.runtime.openOptionsPage(() => {
                console.log("opened options page");
            });
        }
    });
})

chrome.bookmarks.onCreated.addListener((_, bm) => {
    console.log("New bookmark", bm);
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    console.log("onMessage", message, sender, response);

    if (message.msg === "zoomit") {
        var tabId: number;
        if (sender.tab !== undefined) {
            tabId = sender.tab.id;
        } else {
            getCurrentTab().then((tab) => { tabId = tab.id; });
        }

        var zoomfactor: number;

        chrome.storage.local.get(["zoomfactor"]).then((value) => {
            console.log("zoom factor", value);
            zoomfactor = value.zoomfactor;

            if (zoomfactor === undefined) {
                zoomfactor = 0;
            }
            if (zoomfactor >= 0) {
                const bt = zoomfactor > 0 ? zoomfactor.toString() : "•••";
                setBadgeText(bt, tabId);


                chrome.tabs.setZoom(tabId, zoomfactor / 100, () => {
                    console.log("zoomed tab");

                });

                addResetMenuItem();
                //chrome.tabs.sendMessage(tab.id, { msg: "zoomed" });
                response({ msg: "zoomed", factor: zoomfactor });
            }
        });
    }
    return true;
});

chrome.contextMenus.removeAll(() => {
    console.log("context menus removed");

    chrome.contextMenus.create({
        id: "topMenu",
        title: "AS special functions",
        checked: false,
        type: "normal",
    });
    chrome.contextMenus.create({
        id: "info",
        title: "Info",
        checked: true,
        type: "checkbox",
        parentId: "topMenu"
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "zoomReset") {

        chrome.tabs.setZoom(tab.id, 0, () => {
            console.log("reset zoom", info, tab);
            chrome.contextMenus.remove("zoomReset");
            chrome.action.setBadgeText({ text: "", tabId: tab.id });
        });
    }

    if (info.menuItemId === "info") {
        chrome.tabs.sendMessage(tab.id, { msg: "info" }, (response) => {
            console.log(response);
        });
        chrome.tabs.create({
            url: chrome.runtime.getURL("info.html"),
            active: true,
        });
    }
});

chrome.tabs.onActivated.addListener((tai) => {
    console.log("tab activated", tai);


});

chrome.action.onClicked.addListener((tab) => {
    console.log("clicked", tab);
});

function addResetMenuItem() {
    chrome.contextMenus.create({
        id: "zoomReset",
        title: "Reset zoom",
        checked: false,
        type: "normal",
        contexts: ["all"]
    }, () => {
        console.log("context menu created");

    });
}

function setBadgeText(bt: string, tabId: number) {
    chrome.action.setBadgeText({ text: bt, tabId });
    chrome.action.setBadgeBackgroundColor({ color: "cornflowerblue", tabId });
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
