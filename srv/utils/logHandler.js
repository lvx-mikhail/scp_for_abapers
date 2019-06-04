"use strict";

const uuid = require('uuid/v4');

class LogHandler {
	
	constructor(cds){
		this._cds = cds;
	}
	
	async addEntry(tx, type, logContent) {
		
	 	const statement = INSERT.into('db.logging.Log')
    		.columns('ID','TYPE','TIME','CONTENT')
    		.rows([[uuid(), type, new Date().toJSON().slice(0,19), logContent]]);
	    return tx.run (statement);		
		
	}
	
	async getCount() {
		
		//return this._cds.run(SELECT.from('db.logging.Log'));
		return this._cds.run(`SELECT COUNT(ID) AS COUNT FROM DB_LOGGING_LOG`);
		
		//cds.run(`SELECT * FROM DB_LOGGING_LOG`)
		//.then(select => res.json(select))
		//.catch(err => console.log(err));
        
        //cds.run(SELECT.from('db.logging.Log'))
        //.then(select => res.json(select))
        //.catch(err => console.log(err));
		
	}
	
}

module.exports = LogHandler;