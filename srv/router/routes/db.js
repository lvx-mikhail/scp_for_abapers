/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

module.exports = () => {
    const app = express.Router();

    app.get("/jdbc", async (req, res, next) => {
	
		let client = require("@sap/hana-client");
		
		const xsenv = require("@sap/xsenv");
		let hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		
		let conn = client.createConnection();
		var connParams = {
			serverNode: hanaOptions.hana.host + ":" + hanaOptions.hana.port,
			uid: hanaOptions.hana.user,
			pwd: hanaOptions.hana.password,
			CURRENTSCHEMA: hanaOptions.hana.schema
		};
		
		conn.connect(connParams, (err) => {
			if (err) {
				return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			} else {
				conn.exec(`SELECT * FROM LEV_DB_USER_USER`, (err, result) => {
					if (err) {
						return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					} else {
						conn.disconnect();
						return res.type("application/json").status(200).send(result);
					}
				});
			}
			return null;
		});		
		
    });
    
	app.get("/reqdb", (req, res) => {
		let client = req.db;
		client.prepare(`SELECT * FROM LEV_DB_USER_USER`,
			(err, statement) => {
				if (err) {
					return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				statement.exec([],
					(err, results) => {
						if (err) {
							return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
						} else {
							var result = JSON.stringify({
								Objects: results
							});
							return res.type("application/json").status(200).send(result);
						}
					});
				return null;
			});
	});    
    
	var async = require("async");
	app.get("/reqdb_async", (req, res) => {
		let client = req.db;
		async.waterfall([
			function prepare(callback) {
				client.prepare(`SELECT * FROM LEV_DB_USER_USER`,
					(err, statement) => {
						callback(null, err, statement);
					});
			},

			function execute(err, statement, callback) {
				statement.exec([], (execErr, results) => {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				} else {
					var result = JSON.stringify({
						Objects: results
					});
					res.type("application/json").status(200).send(result);
				}
				return callback();
			}
		]);
	});    
    
	app.get("/reqdb_promise", (req, res) => {
		const dbClass = require(global.__base + "utils/dbPromises");
		let db = new dbClass(req.db);
		db.preparePromisified(`SELECT * FROM LEV_DB_USER_USER`)
			.then(statement => {
				db.statementExecPromisified(statement, [])
					.then(results => {
						let result = JSON.stringify({
							Objects: results
						});
						return res.type("application/json").status(200).send(result);
					})
					.catch(err => {
						return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					});
			})
			.catch(err => {
				return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			});
	});    
    
	app.get("/reqdb_await", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(req.db);
			const statement = await db.preparePromisified(`SELECT * FROM LEV_DB_USER_USER`);
			const results = await db.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				Objects: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});    

    return app;
};