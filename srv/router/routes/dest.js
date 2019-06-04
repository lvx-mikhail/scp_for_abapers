/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const Destination = require(global.__base + '/utils/destination');
const express = require("express");

module.exports = () => {
    const app = express.Router();
	
	app.get("/:NAME?", async (req, res, next) => {
		let logger = req.loggingContext.getLogger("/Application");
		
		logger.info(`!!!!destination name: ${req.params.NAME}`);
		
		if (typeof req.params.NAME === "undefined" || req.params.NAME === null) {
			let destinationList = await new Destination(logger).getDestinationList();
			logger.info(`!!!!destinationList: ${destinationList}`);
			res.json(JSON.stringify(destinationList));
		}else{
			let destination = await new Destination(logger).getDestination(req.params.NAME);
			logger.info(`!!!!destination: ${destination}`);
			res.json(JSON.stringify(destination));	
		}
	});
	
	return app;
}