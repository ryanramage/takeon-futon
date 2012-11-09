var jam = {
    "packages": [
        {
            "name": "async",
            "location": "jam/async",
            "main": "./lib/async"
        },
        {
            "name": "bootstrap",
            "location": "jam/bootstrap"
        },
        {
            "name": "couchr",
            "location": "jam/couchr",
            "main": "couchr-browser.js"
        },
        {
            "name": "domReady",
            "location": "jam/domReady",
            "main": "domReady.js"
        },
        {
            "name": "events",
            "location": "jam/events",
            "main": "events.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "jquery.js"
        },
        {
            "name": "JSONStream",
            "location": "jam/JSONStream",
            "main": "index.js"
        },
        {
            "name": "lessc",
            "location": "jam/lessc",
            "main": "lessc.js"
        },
        {
            "name": "querystring",
            "location": "jam/querystring",
            "main": "querystring.js"
        },
        {
            "name": "stream",
            "location": "jam/stream",
            "main": "stream.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "jam/underscore",
            "main": "underscore.js"
        },
        {
            "name": "url",
            "location": "jam/url",
            "main": "url.js"
        }
    ],
    "version": "0.2.11",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: jam.packages, shim: jam.shim});
}
else {
    var require = {packages: jam.packages, shim: jam.shim};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}