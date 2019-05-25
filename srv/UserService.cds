using lev.db.user as user from '../db/User';
using lev.db.extra as extra from '../db/ExtraInfo';

service odata {

  entity Users @(
		title: 'Users',
		Capabilities: {
			InsertRestrictions: {Insertable: false},
			UpdateRestrictions: {Updatable: false},
			DeleteRestrictions: {Deletable: false}
		}
	) as projection on user.User;

  entity Address @(
		title: 'Address',
		Capabilities: {
			InsertRestrictions: {Insertable: false},
			UpdateRestrictions: {Updatable: false},
			DeleteRestrictions: {Deletable: false}
		}
	) as projection on extra.Address;

    entity Cars @(
		title: 'Cars',
		Capabilities: {
			InsertRestrictions: {Insertable: false},
			UpdateRestrictions: {Updatable: false},
			DeleteRestrictions: {Deletable: false}
		}
	) as projection on extra.Cars;

}
