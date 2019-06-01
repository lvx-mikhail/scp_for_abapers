"use strict";

const https = require("https");
const port = process.env.PORT || 3000;
const server = require("http").createServer();
const cds = require("@sap/cds");
const xsenv = require("@sap/xsenv");
const xsHDBConn = require("@sap/hdbext");
const logging = require("@sap/logging");
const express = require("express");
const bodyParser = require('body-parser');
const schedule = require("node-schedule");

global.__base = __dirname + "/";

const app = express();

const appContext = logging.createAppContext();

logMode = "warning";
if (process.argv[2] === "--debug") {
	logMode = "debug";
} else {
	appContext.setLevel('/Application/*', 'warning');
}

app.use(logging.middleware({
	appContext: appContext
}));

app.use('/rest', bodyParser.json());

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
    logLevel: logMode,
    credentials: hanaOptions.hana
});

cds.serve("gen/csn.json", {
		logLevel: logMode,
        crashOnError: false
    })
    .at("/odata/v4/")
    .in(app)
    .catch(err => {
        console.log(err);
		process.exit(1);
    });
    
require("./router")(app, server);

schedule.scheduleJob('matchLoader', '* 10 * * * *', 
		require("./jobs/matchLoader.js")());

app.use(function (err, req, res, next) {
        res.status(500).send({
            "msgId": "",
            "type": "Error",
            "msg": err.message
        });
});

server.on("request", app);
server.listen(port, () => console.info(`HTTP Server: ${server.address().port}`));