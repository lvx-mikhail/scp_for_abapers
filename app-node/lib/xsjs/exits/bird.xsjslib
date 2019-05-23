"use strict";

function validateBird(bird) {
	return bird.birdName.length > 2 && bird.eggSize > 0.1;
}

function bird_create_before(param) {
	$.trace.error("Bird exit: before event");
}

/**
 @param {connection} Connection - The SQL connection used in the OData request
 @param {beforeTableName} String - The name of a temporary table with the single entry before the operation (UPDATE and DELETE events only)
 @param {afterTableName} String -The name of a temporary table with the single entry after the operation (CREATE and UPDATE events only)
 */
function bird_create(param) {
	try {
	
		$.trace.error("Bird exit: create event");
		
		var after = param.afterTableName;
	    var	pStmt = param.connection.prepareStatement(`select * from "${after}"`);
	    var rs = pStmt.executeQuery();
	    
	    var bird = {};
	    if (rs.next()) {
	    	bird.birdName = rs.getString(2);
	    	bird.eggSize = rs.getDecimal(3);
	    }
	    pStmt.close();
	    
	    $.trace.error(JSON.stringify(bird));
	    
	    if (!validateBird(bird)) {
	    	throw `Invalid Bird ${JSON.stringify(bird)}`;
	    }
    	
    	var eggId = -1;
        pStmt = param.connection.prepareStatement(`select "ID" from "app_db::Space.Egg" where "SIZE" = ?`);
        pStmt.setDecimal(1, bird.eggSize);	
        var rs = pStmt.executeQuery();
        if (rs.next()) {
           	eggId = rs.getInteger(1);
        }
        pStmt.close();
        $.trace.error(`Result of looking for egg: ${eggId}`);
        
        if(eggId == -1){
			pStmt = param.connection.prepareStatement("INSERT INTO \"app_db::Space.Egg\" (SIZE) VALUES(?)");
			pStmt.setDecimal(1, bird.eggSize);
			pStmt.execute();   
			
			pStmt = param.connection.prepareStatement(`select CURRENT_IDENTITY_VALUE() from dummy`);
			rs = pStmt.executeQuery();
			if (rs.next()) {
				eggId = rs.getInteger(1);
			}
			pStmt.close();		
			
			$.trace.error(`New egg was created: ${eggId}`);
        }
        
        if(eggId == -1){
        	throw `Egg not applicable problem`;
        }
        
        pStmt = param.connection.prepareStatement("INSERT INTO \"app_db::Space.Bird\" (NAME,STATUS,\"EGG.ID\") VALUES(?,'A',?)");
		pStmt.setString(1, bird.birdName);
		pStmt.setInteger(2, eggId);
		pStmt.execute();
		pStmt.close();
    
	} catch (e) {
		$.trace.error(e.toString());
		throw e;
	}    
    
}