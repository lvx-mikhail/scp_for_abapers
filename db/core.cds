namespace db.core;

type fields { 
	techKeyT	: UUID @title: '{i18n>techKey}';
	busKeyT		: String(10) @title: '{i18n>busKey}';
	dateT		: DateTime;
	goalT		: Integer;
	teamNameT	: String(70);
	longNameT	: String(100);
	quoteT 		: Decimal(3, 2);
	statusT		: String(1) @title: '{i18n>status}';
}

type history {
    createdByT : fields.busKeyT @title: '{i18n>createdBy}';
    createAtT  : fields.dateT  @title: '{i18n>createdAt}';
    changedByT : fields.busKeyT  @title: '{i18n>changedBy}';
    changeAtT  : fields.dateT  @title: '{i18n>changedAt}';
};