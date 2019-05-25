/*eslint no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";

const express = require("express");

module.exports = () => {
    const app = express.Router();

    app.get("/", async (req, res, next) => {
        try {
            res.type("application/json").status(201).send(JSON.stringify({text: "Cars get works"}));
        } catch (e) {
            next(e);
        }
    });

    app.post("/", async (req, res, next) => {
        try {
            res.type("application/json").status(201).send(JSON.stringify(req.body));
        } catch (e) {
            next(e);
        }
    });

    app.put("/", async (req, res, next) => {
        try {
            res.type("application/json").status(200).send(JSON.stringify(req.body));
        } catch (e) {
            next(e);
        }
    });

    return app;
};