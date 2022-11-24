chrome.runtime.onInstalled.addListener((details) => {
    console.log("installed", details);
})

chrome.bookmarks.onCreated.addListener((_, bm) => {
    console.log("New bookmark", bm);
})

chrome.runtime.onMessage.addListener((message, sender, response) => {
    console.log("onMessage", message, sender, response);

    if (message.msg === "zoomit") {
        const tabId = sender.tab.id;
        chrome.action.setBadgeText({ text: "z75", tabId });
        chrome.action.setBadgeBackgroundColor({ color: "red", tabId });

        
        chrome.tabs.setZoom(tabId, .75, () => {
            console.log("zoomed tab");

        });

        //chrome.tabs.sendMessage(tab.id, { msg: "zoomed" });
        response({ msg: "zoomed" }); // doesn't work in zoom cb

        chrome.contextMenus.create({
            id: "zoomReset",
            title: "Reset zoom",
            checked: false,
            type: "normal",
            
        }, () => {
            console.log("context menu created");
            
        });

    }
});

chrome.contextMenus.create({
    id: "topMenu",
    title: "AS special functions",
    checked: false,
    type: "normal",
});
chrome.contextMenus.create({
    id: "info",
    title: "Info",
    checked: false,
    type: "checkbox",
    parentId: "topMenu"
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "zoomReset") {

        chrome.tabs.setZoom(tab.id, 0, () => {
            console.log("reset zoom", info, tab);
            chrome.contextMenus.remove("zoomReset");
            chrome.action.setBadgeText({text: "", tabId: tab.id });
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

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
