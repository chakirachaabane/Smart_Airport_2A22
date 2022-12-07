#include "parking.h"
#include <QSqlQuery>
#include <QSqlQueryModel>
#include <QString>

parking::parking()
{

}

int parking:: dispo_place(){
    QSqlQuery query;
    query.prepare("SELECT * FROM PARKING");
    query.first();

   return query.value(1).toInt();
    //return query;

}

void parking:: update(int space){
    QSqlQuery query;

    query.prepare("UPDATE PARKING SET dispo=:space ");
    query.bindValue(":space",space);
    query.exec();


}
