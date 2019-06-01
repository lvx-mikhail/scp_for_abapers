namespace db.logging;

using db.core.fields from './core';

entity Log {
	key id		: fields.techKeyT;
	type		: String(10) @title: '{i18n>logType}';
	time		: fields.dateT @title: '{i18n>logTime}';
	content		: String(1000) @title: '{i18n>logContent}';
}