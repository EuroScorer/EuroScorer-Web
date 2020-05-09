// Take a URL and callback function is call when is success
function ajaxGet(url, callback) {
// Creation HTTP request
    var req = new XMLHttpRequest();
// synchrone request
    req.open("GET", url);
// Management event in the end of the request
    req.addEventListener("load", function () {
        //Server okay
        if (req.status >= 200 && req.status < 400 ){
            // Display the answer get by the request
            callback(req.responseText)
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }

    });
    req.addEventListener("error", function () {
        // Server not okay
        console.error("Network error with URL");
    });
    req.send(null);
}