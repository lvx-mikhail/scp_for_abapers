/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const logHandler = require(global.__base + '/utils/logHandler');
const express = require("express");
const cds = require('@sap/cds');

module.exports = () => {
    const app = express.Router();
	
	app.get("/count", async (req, res, next) => {
        
        new logHandler(cds).getCount()
        .then(result => res.json(result))
        .catch(err => cds.error(401, err));
        
    });
	
	app.post("/", async (req, res, next) => {
		const result = await new logHandler(cds).addEntry(req, 'rest', req.body.logContent);
		req.loggingContext.getLogger("/Application").info(`!!!!!Logs added via rest call: ${result}, content: ${req.body.logContent}`);
		res.type("application/json").status(200).send({result: 'OK'});
	});
	
	return app;
}