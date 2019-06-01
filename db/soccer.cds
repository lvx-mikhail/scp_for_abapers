namespace db.soccer;

using db.core.fields from './core';
using db.core.history from './core';
using db.betting.Market from './betting';

entity Match {
	key id		: fields.busKeyT;
	name_home	: fields.teamNameT @title: '{i18n>nameHome}';
	name_away	: fields.teamNameT @title: '{i18n>nameAway}';
	goal_home	: fields.goalT @title: '{i18n>goalHome}';
	goal_away	: fields.goalT @title: '{i18n>goalAway}';
	history		: history;
	liga		: Association to Liga @title: '{i18n>parentLiga}';
	markets		: Association to many Market on markets.match = $self;
}

entity Liga {
	key id		: fields.busKeyT;
	name		: fields.longNameT @title: '{i18n>ligaName}';
	matches 	: Association to many Match on matches.liga = $self @title: '{i18n>ligaMathes}';
}