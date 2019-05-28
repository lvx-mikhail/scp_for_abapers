using db.soccer as soccer;

service odata {
    @readonly entity Liga as projection on soccer.Liga;
}