"use strict";

const logHandler = require('./utils/logHandler');

module.exports = (srv) => {
	
	srv.on ('READ', 'Ligas', () => {
		return [
			 { ID: 99, name: 'Mock Liga' },
			 { ID: 999, name: 'Mockky Liga' }
		];
	})	
	
	srv.after ('READ', 'Ligas', each => {
		 each.name += ' final!';
	});
	
	srv.before('CREATE', 'Matches', req => {
		match = req.data;
		if (!match.name_home) return req.error (400, 'Bad request: Home name is missing');
		if (!match.name_away) return req.error (400, 'Bad request: Away name is missing');
		if (!match.liga_id) return req.error (400, 'Bad request: Liga id is missing');
		match.history_createdByT = req._.req.ip;
		match.history_createAtT = new Date().toJSON();
	});
	
	srv.after(['READ', 'CREATE', 'UPDATE', 'DELETE'], ['Ligas', 'Matches'], (res, req) => {
		
	 	const logContent = req.target["@Common.Label"]
	 		+ JSON.stringify(req.query) 
	 		+ JSON.stringify(req.attr) 
	 		+ JSON.stringify(req.target.name) + 
	 		+ JSON.stringify(req.data);		
	 	
	 	const tx = cds.transaction(req);
		new logHandler(cds).addEntry(tx, 'odata', logContent)
			.then(result => req.log.info(`!!!!!Logs added via odata call: ${result}, content: ${logContent}`))
			.catch(error => req.log.error(error));
		
	 });
	
}