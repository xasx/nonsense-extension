async function loadInfo() {
    let pi = await chrome.runtime.getPlatformInfo();

    const osf = document.getElementById("os") as HTMLInputElement;
    osf.value = pi.os.toString();
    const archf = document.getElementById("arch") as HTMLInputElement;
    archf.value = pi.arch.toString();

    const manifest = chrome.runtime.getManifest();
    
    const title = document.getElementById("title") as HTMLHeadingElement;
    title.innerHTML = manifest.name + " v" + manifest.version;
    const desc = document.getElementById("description") as HTMLHeadingElement;
    desc.innerHTML = manifest.description;

    const closebtn = document.getElementById("closebtn") as HTMLButtonElement;
    closebtn.addEventListener("click", () => {
        window.close();
    });


}

document.addEventListener("DOMContentLoaded", loadInfo);
