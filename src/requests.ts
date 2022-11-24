const req = new XMLHttpRequest();

req.onreadystatechange = handleApi;

function handleApi(response) {
    if (req.readyState === 4) {
        console.log("response", response.target.response);
    }
}

//req.open("GET", "https://api.github.com/users/xasx", false);
//req.send();
