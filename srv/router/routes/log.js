/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const logHandler = require(global.__base + '/utils/logHandler');
const express = require("express");
const cds = require('@sap/cds');

module.exports = () => {
    const app = express.Router();
	
	app.get("/count", (req, res, next) => {
        
        req.loggingContext.getLogger("/Application").info(`__filename: ${__filename}`);
        
        //let tracer = req.loggingContext.getTracer(__filename);
        //tracer.entering("/count", req, res);
        
        new logHandler(cds).getCount()
	        .then(result => res.json(result))
	        .catch(error => cds.error(401, error));
        
    });
	
	app.post("/", async(req, res, next) => {
		try {
		
			const tx = cds.transaction(req);
			let result = await new logHandler(cds).addEntry(tx, 'rest', req.body.logContent);
			await tx.commit();
			res.json({'result': 'OK'});
		
		} catch (error) {
			cds.error(401, error);
		}
	});
	
	return app;
}