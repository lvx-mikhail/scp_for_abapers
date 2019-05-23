/*eslint no-console: 0, no-unused-vars: 0, dot-notation: 0*/
"use strict";

function selectMatchSQL(){
	var conn = $.hdb.getConnection();
	var rs = conn.executeQuery(`SELECT * FROM "app_db::Soccer.Match"`);
	$.response.setBody(JSON.stringify(rs));
	$.response.contentType = "application/json";
	$.response.status = $.net.http.OK;		
}

function selectMatchProcedure(){
	var connection = $.hdb.getConnection();
	var matchList = connection.loadProcedure("app_db::get_match_list");

	var procResult = matchList('"goal_home" > 0');
	var matchListResult = procResult.EX_MATCH_LIST;
	
	var out = [];
	for(var i=0; i<matchListResult.length;i++){
		out.push(matchListResult[i]);
	}
	
	$.response.setBody(JSON.stringify(out));
	$.response.contentType = "application/json";
	$.response.status = $.net.http.OK;	
}

var aCmd = $.request.parameters.get("cmd");
switch (aCmd) {
case "selectMatchSQL":
	selectMatchSQL();
	break; 
case "selectMatchProcedure":
	selectMatchProcedure();
	break;  	
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody("Invalid Request Method");
}