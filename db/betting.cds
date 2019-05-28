namespace db.betting;

using {db.core.fields, db.soccer.Match };

entity Market {
	key id		: fields.busKeyT;
	name		: fields.longNameT @title: '{i18n>nameMarket}';
	status		: fields.statusT @title: '{i18n>statusMarket}';
	match		: Association to Match @title: '{i18n>marketMatch}';
	quotes		: Association to many Quote on quotes.market = $self @title: '{i18n>marketQuotes}';
}

entity Quote {
	key id		: fields.techKeyT;
	name		: fields.longNameT @title: '{i18n>nameQuote}';
	time		: fields.dateT @title: '{i18n>timeQuote}';
	ask 		: fields.quoteT @title: '{i18n>askQuote}';
	bid			: fields.quoteT @title: '{i18n>bidQuote}';
	market		: Association to Market @title: '{i18n>quoteMarket}';
}