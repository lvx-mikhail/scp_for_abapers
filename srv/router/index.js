"use strict";

module.exports = (app, server) => {
	app.use("/rest/log", require("./routes/log")());
};