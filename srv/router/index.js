"use strict";

module.exports = (app, server) => {
    app.use("/cars", require("./routes/cars")());
    app.use("/db", require("./routes/db")());
};