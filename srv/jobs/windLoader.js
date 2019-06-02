/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const logHandler = require(global.__base + '/utils/logHandler');
const request = require('request-promise');
const cds = require('@sap/cds');

module.exports = () => {
	return async(context) => {
		
		try {
		
			let requestData = JSON.parse(await request({
				url: `https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22`,
			}));
			
			console.log(requestData.wind);
			
			const tx = cds.transaction(context);
			const result = await new logHandler(cds).addEntry(tx, 'job', JSON.stringify(requestData.wind));
			await tx.commit();
			
			console.log(`insert result ${result}`);
			
		} catch (e) {
			console.log(`my exc ${e}`);
		}
		
	}
}