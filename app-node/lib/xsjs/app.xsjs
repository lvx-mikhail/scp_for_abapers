/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
"use strict";

function fillSessionInfo(){
	var body = "";
	body = JSON.stringify({
		"session" : [{"UserName": $.session.getUsername(), "Language": $.session.language}]
	});
	$.response.contentType = "application/json";
	$.response.setBody(body);
	$.response.status = $.net.http.OK; 
}
function fillOSInfo(){
	var os = $.require("os");
	var output = {};
	
	output.tmpdir = os.tmpdir();
	output.endianness = os.endianness();
	output.hostname = os.hostname();
	output.type = os.type();
	output.platform = os.platform();
	output.arch = os.arch();
	output.release = os.release();
	output.uptime = os.uptime();
	output.loadavg = os.loadavg();
	output.totalmem = os.totalmem();
	output.freemem = os.freemem();
	output.cpus = os.cpus();
	output.networkInfraces = os.networkInterfaces();	
	
	$.response.status = $.net.http.OK;
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(output));	
}

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
case "getSessionInfo":
	fillSessionInfo();
	break; 
case "getOSInfo":
	fillOSInfo();
	break; 	
case "trace":
	$.trace.info("zzz - info");
	$.trace.error("zzz - error");
	$.trace.debug("zzz - debug");
	break; 	
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody("Invalid Request Method");
}