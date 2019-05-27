/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        try {
            res.type("application/json").status(200).send(JSON.stringify({text: "Cars get works"}));
        } catch (e) {
            next(e);
        }
    });

    app.get("/select_via_select/:USID?", async (req, res, next) => {
        try {
        	const dbClass = require(global.__base + "utils/dbPromises");
        	const db = new dbClass(req.db);
        	let sql = "";
        	let par = [];
			if (typeof req.params.USID === "undefined" || req.params.USID === null) {
				sql = `SELECT * FROM LEV_DB_USER_USER`;
			} else {
				sql = `SELECT * FROM LEV_DB_USER_USER WHERE USID = ?`;
				par.push(req.params.USID);
			}
        	const statement = await db.preparePromisified(sql);
        	const results = await db.statementExecPromisified(statement, par);
        	let result = JSON.stringify({
        		input: par,
				output: results
			});
            res.type("application/json").status(200).send(result);
        } catch (e) {
            next(e);
        }
    });
    
    app.post("/", async (req, res, next) => {
        try {
        	const dbClass = require(global.__base + "utils/dbPromises");
        	const db = new dbClass(req.db);
        	let statement = await db.preparePromisified(`SELECT "usid".NEXTVAL AS "ID" FROM "DUMMY"`);
        	let results = await db.statementExecPromisified(statement, []);
        	statement = await db.preparePromisified(`INSERT INTO LEV_DB_USER_USER (USID, NAME) VALUES (?,?)`);
			const insertResult = await db.statementExecPromisified(statement, [results[0].ID, req.body.NAME]);
            res.type("application/json").status(201).send(JSON.stringify(insertResult));
        } catch (e) {
        	console.log(e);
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
        	if(req.body.length < 1){
        		throw 'payload is empty';
        	}
        	const dbClass = require(global.__base + "utils/dbPromises");
        	const db = new dbClass(req.db);
        	let statement = await db.preparePromisified(`SELECT * FROM LEV_DB_USER_USER WHERE USID = ?`);
        	let results = await db.statementExecPromisified(statement, [req.body.USID]);        	
        	Object.keys(req.body).forEach(function (key) {
				results[0][key] = req.body[key];
			});
			statement = await db.preparePromisified(`UPDATE LEV_DB_USER_USER SET NAME = ? WHERE USID = ?`);
			results = await db.statementExecPromisified(statement, [results[0].NAME, results[0].USID]);			
            res.type("application/json").status(200).send(JSON.stringify(results));
        } catch (e) {
            next(e);
        }
    });

    return app;
};