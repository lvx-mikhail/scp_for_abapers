"use strict";

const https = require("https");
const port = process.env.PORT || 3000;
const server = require("http").createServer();
const cds = require("@sap/cds");
const xsenv = require("@sap/xsenv");
const xsHDBConn = require("@sap/hdbext");
const express = require("express");
const bodyParser = require('body-parser');

https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + "/";

const app = express();

app.use(bodyParser.json());

var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});

hanaOptions.hana.pooling = true;

app.use(
    xsHDBConn.middleware(hanaOptions.hana)
);

cds.connect({
    kind: "hana",
    logLevel: "error",
    credentials: hanaOptions.hana
});

cds.serve("gen/csn.json", {
        crashOnError: false
    })
    .at("/odata/v4/")
    .in(app)
    .catch(err => {
        // do not crash on error ???
        console.log(err);
		process.exit(1);
    });
    
require("./router")(app, server);

server.on("request", app);
server.listen(port, () => console.info(`HTTP Server: ${server.address().port}`));