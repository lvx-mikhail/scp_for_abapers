namespace lev.db.user;

using {lev.db.extra.Cars, lev.db.extra.Address} from './ExtraInfo';

type Id : String(4);

entity User {
    key usid : Id;
    name : String(100);

    toCars : association to many Cars on toCars.usid = usid;
    toAddress : association to one Address on toAddress.usid = usid;
};