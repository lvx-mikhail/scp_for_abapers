using db.soccer as soccer from '../db/soccer';

service odata {
    //entity Ligas @readonly as projection on soccer.Liga;

    entity Ligas @readonly as projection on soccer.Liga;
    
    entity Matches @(
		Capabilities: {
			InsertRestrictions: {Insertable: true},
			UpdateRestrictions: {Updatable: true},
			DeleteRestrictions: {Deletable: true}
		}
	) as projection on soccer.Match;
    
}