/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const Destination = require(global.__base + '/utils/destination');
const Connectivity = require(global.__base + '/utils/connectivity');
const express = require("express");

module.exports = () => {
    const app = express.Router();
	
	app.get("/", async (req, res, next) => {
		let logger = req.loggingContext.getLogger("/Application");
		
		let destination = await new Destination(logger).getDestination('S4G');
		
		logger.info(`!!!!destination: ${JSON.stringify(destination)}`);
		
		let connectivity = await new Connectivity(destination, logger);
		
	    let requestOptions = {
	        method: 'GET',
			qs: {
				"sap-language": 'en',
        		"$format": "json",
        		"$select": "PaymentTerms,PaymentTermsName,NetPaymentDays",
        		"$orderby": "PaymentTerms,NetPaymentDays"
			}
	    };		
		
		res.json(await request(await connectivity.getRequestOptions(requestOptions, 
			'/sap/opu/odata/sap/MM_PUR_PO_MAINT_V2_SRV/C_MM_PaymentTermValueHelp')));
	});
	
	return app;
}