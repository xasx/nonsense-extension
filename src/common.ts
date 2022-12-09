export async function isNotBlacklisted(url: string) {
    const data = await chrome.storage.local.get(["blacklistItems"]);
    const bl = data.blacklistItems as Array<string>;
    return !bl.find(bi => url.includes(bi));
}
