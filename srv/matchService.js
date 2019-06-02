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
	
	srv.before('CREATE', 'Matches', async (req) => {
		match = req.data;
		if (!match.name_home)  return req.error (400, 'Bad request: Home name is missing');
		if (!match.name_away)  return req.error (400, 'Bad request: Away name is missing');
		if (!match.liga_id)  return req.error (400, 'Bad request: Liga id is missing');
		match.history_createdByT = req._.req.ip;
		match.history_createAtT = new Date().toJSON();
		return Promise.resolve();
	});
	
	srv.after(['READ', 'CREATE', 'UPDATE', 'DELETE'], ['Ligas', 'Matches'], async (res, req) => {
		
	 	const logContent = JSON.stringify(req.query) 
	 		+ JSON.stringify(req.attr) 
	 		+ JSON.stringify(req.target.name) + 
	 		+ JSON.stringify(req.data);		
	 	
	 	const tx = cds.transaction(req);
		const result = await new logHandler(cds).addEntry(tx, 'odata', logContent);
		
		req.log.debug(`!!!!!Logs added via odata call: ${result}, content: ${logContent}`);
		
	 });
	
}