namespace db.match.view;

using db.soccer.Match from './soccer';

define view MatchView as
    select from Match {
    	id,
        name_home || ' vs ' || name_away as title,
        liga.name
    };
    
define view MarketOverview as
    select from Match
    	{
    		id,
    		count(markets[status='A'].id) AS marketCount
    	} GROUP BY id;    