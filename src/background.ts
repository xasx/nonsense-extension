import { isNotBlacklisted } from "./common";

chrome.runtime.onInstalled.addListener(async (details) => {
    console.debug("installed", details);
    let data = await chrome.storage.local.get(["showOptions"]);
    if (data.showOptions) {
        chrome.runtime.openOptionsPage();
    }

});

chrome.bookmarks.onCreated.addListener((_, bm) => {
    console.debug("New bookmark", bm);
});

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    console.debug("onMessage", message, sender, response);

    if (message.msg === "zoomit") {
        let tabId: number;
        if (sender.tab !== undefined) {
            tabId = sender.tab.id;
        } else {
            let tab = await getCurrentTab();
            tabId = tab.id;
        }

        let zoomfactor: number;

        let value = await chrome.storage.local.get(["zoomfactor"]);

        console.debug("zoom factor loaded", value);
        zoomfactor = value.zoomfactor;

        if (zoomfactor === undefined) {
            zoomfactor = 0;
        }
        if (zoomfactor >= 0) {
            const bt = zoomfactor > 0 ? zoomfactor.toString() : "•••";
            await setBadgeText(bt, tabId);


            await chrome.tabs.setZoom(tabId, zoomfactor / 100);

            addResetMenuItem();

            response({ msg: "zoomed", factor: zoomfactor });
        }

    }
    return true;
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "zoomReset") {

        await chrome.tabs.setZoom(tab.id, 0);

        console.debug("reset zoom", info, tab);
        chrome.contextMenus.remove("zoomReset");
        await chrome.action.setBadgeText({ text: "", tabId: tab.id });

        return true;
    }

});

chrome.tabs.onActivated.addListener(async (tai) => {
    console.debug("tab activated", tai);
    let tab = await chrome.tabs.get(tai.tabId)

    let url = new URL(tab.url);
    if (await isNotBlacklisted(url.hostname)) {
        chrome.tabs.sendMessage(tai.tabId, { msg: "checkScrollButton" })
            .catch((reason) => { console.error("error sending message", reason); });
    } else {
        console.debug("Blacklisted hostname in tab", tab, url);
    }

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

async function setBadgeText(bt: string, tabId: number) {
    await chrome.action.setBadgeText({ text: bt, tabId });
    await chrome.action.setBadgeBackgroundColor({ color: "cornflowerblue", tabId });
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


