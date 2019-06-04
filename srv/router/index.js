"use strict";

module.exports = (app, server) => {
	app.use("/rest/log", require("./routes/log")());
	app.use("/rest/dest", require("./routes/dest")());
	app.use("/rest/con", require("./routes/con")());
};