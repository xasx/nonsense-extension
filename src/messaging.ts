

setTimeout(() => {

    chrome.runtime.sendMessage({ msg: "zoomit" }, (response) => {
        console.log("handling response", response);

        if (response.msg === "zoomed") {
            console.log("zoomed");

        }
    });

    const player = document.getElementById("movie_player") as unknown as YT.Player;
    console.log("YouTube player: ", player);
    console.log(typeof player);
    player.pauseVideo();
},
    3333);


chrome.runtime.onMessage.addListener((message, sender, cb) => {
    console.log("onMessage", message, sender);

    if (message.msg === "info") {
        console.log("info");
        
    }
    cb("nothing");

});