/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const logHandler = require(global.__base + '/utils/logHandler');
const Destination = require(global.__base + '/utils/destination');
const request = require('request-promise');
const cds = require('@sap/cds');

async function loadUrl(tx, url, logger){
	let requestData = JSON.parse(await request({
		url: url,
	}));	
	const result = await new logHandler(cds).addEntry(tx, 'job', JSON.stringify(requestData.wind));
	logger.info(`insert result ${result} for ${requestData.wind}`);
}

module.exports = (appContext) => {
	return async () => {
		var logger = appContext.createLogContext().getLogger('/Application');
			
		try {
			
			let destination = await new Destination(logger).getDestination('windCFSubAcc');
			
			const tx = cds.transaction();
			
			await Promise.all([
				`${destination.URL}data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22`,
				`${destination.URL}data/2.5/weather?id=2172797&appid=b1b15e88fa797225412429c1c50c122a1`
				].map(url => loadUrl(tx, url, logger)));
			
			logger.info(`!!!!loadAll is done!!!!!`);
			
			await tx.commit();
	
		} catch (error) {
			logger.error(error);
		}	
	}
}