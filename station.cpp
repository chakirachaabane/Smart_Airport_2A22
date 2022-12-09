#include "station.h"
#include <QSqlQuery>
#include <QtDebug>
#include <QPainter>
#include <QPdfWriter>

Station::Station()
{
id_station=0; num_poste=0; num_piste=0; destination=" ";
}

Station::Station(int id_station,int num_poste , int num_piste ,QString destination,QDateTime a ){
this ->id_station=id_station; this->num_piste=num_piste; this->num_poste=num_poste;this->destination=destination;this->heure_arrivee = a ;}
int Station:: getid_station(){return id_station;}
int Station:: getnum_poste(){return num_poste; }
int Station::  getnum_piste(){return num_piste;}
QString Station ::getdestination (){return destination ;}
void Station ::setid_station(int id_station){this->id_station=id_station;}
void  Station::setnum_poste(int num_poste){this->num_poste=num_poste;}
void Station ::setnum_piste(int num_piste){this->num_piste=num_piste;}
void Station:: setdestination(QString destination){this->destination=destination;}


bool Station::ajouter()
    {

        QSqlQuery query;
        QString id_string=QString::number(id_station);
        QString poste_string=QString::number(num_poste);
        QString piste_string=QString::number(num_piste);
       query.prepare("INSERT INTO STATION (ID_STATION, NUM_POSTE, NUM_PISTE, DESTINATION,heure_arrive) "
                     "VALUES (:id_station, :num_poste, :num_piste, :destination, :ha)");
       query.bindValue(":id_station", id_string);
       query.bindValue(":num_poste", poste_string);
       query.bindValue(":num_piste", piste_string);
       query.bindValue(":destination",destination);
       query.bindValue(":ha",heure_arrivee);
        return    query.exec();

    }
QSqlQueryModel* Station::afficher (){
    QSqlQueryModel* model=new QSqlQueryModel();


          model->setQuery("SELECT* FROM STATION");
          model->setHeaderData(0, Qt::Horizontal,QObject::tr("ID_STATION"));
          model->setHeaderData(1, Qt::Horizontal,QObject::tr("NUM_POSTE"));
          model->setHeaderData(2, Qt::Horizontal,QObject::tr("NUM_PISTE"));
          model->setHeaderData(3, Qt::Horizontal,QObject::tr("DESTINATION"));
          model->setHeaderData(4, Qt::Horizontal,QObject::tr("Heure Arrivée"));






     return model;
}
bool Station::supprimer(int id_station){

    QSqlQuery query;
    QString id_string=QString::number(id_station);


         query.prepare("Delete from STATION where ID_STATION=:id_station" ) ;



         query.bindValue(":id_station",id_string );
      return query.exec();



}

bool Station::modifier(int id_station ,int num_poste,int num_piste,    QString destination,QDateTime ha )


    {
        QSqlQuery query;

        query.prepare("UPDATE station SET NUM_POSTE=:num_poste,NUM_PISTE=:num_piste,DESTINATION=:destination,heure_arrive=:ha WHERE ID_STATION=:id_station ");

        query.bindValue(":id_station", id_station);
        query.bindValue(":num_poste", num_poste);
        query.bindValue(":num_piste", num_piste);
        query.bindValue(":destination", destination);
        query.bindValue(":ha",ha);

        return  query.exec();
}




QSqlQueryModel* Station::trier(){

{
    QSqlQueryModel *model=new QSqlQueryModel();
      model->setQuery("select * from STATION order by ID_STATION");

      model->setHeaderData(0, Qt::Horizontal,QObject::tr("ID_STATION"));
      model->setHeaderData(1, Qt::Horizontal,QObject::tr("NUM_POSTE"));
      model->setHeaderData(2, Qt::Horizontal,QObject::tr("NUM_PISTE"));
      model->setHeaderData(3, Qt::Horizontal,QObject::tr("DESTINATION"));
      model->setHeaderData(4, Qt::Horizontal,QObject::tr("Heure Arrivée"));;

return model;
}
/*
QSqlQueryModel* Station::chercher(QString field){
QSqlQueryModel * model = new QSqlQueryModel();
model->setQuery("select * from STATION where (ID_STATION) LIKE '%"+field+"%' OR (NUM_POSTE) LIKE '%"+field+"%' OR (NUM_PISTE) LIKE '%"+field+"%' ");
model->setHeaderData(0, Qt::Horizontal, QObject::tr("ID_STATION"));
model->setHeaderData(1, Qt::Horizontal, QObject::tr("NUM_POSTE"));
model->setHeaderData(2, Qt::Horizontal, QObject::tr("NUM_PISTE"));
model->setHeaderData(3, Qt::Horizontal, QObject::tr("DESTINATION"));


return model;
}*/


}


QSqlQueryModel* Station::triernump()

{
    QSqlQueryModel *model=new QSqlQueryModel();
     model->setQuery("select * from STATION order by NUM_POSTE");

     model->setHeaderData(0, Qt::Horizontal,QObject::tr("ID_STATION"));
     model->setHeaderData(1, Qt::Horizontal,QObject::tr("NUM_POSTE"));
     model->setHeaderData(2, Qt::Horizontal,QObject::tr("NUM_PISTE"));
     model->setHeaderData(3, Qt::Horizontal,QObject::tr("DESTINATION"));
     model->setHeaderData(4, Qt::Horizontal,QObject::tr("Heure Arrivée"));

return model;
}
QSqlQueryModel *   Station::rechercher(int ID_STATION)
{
    QSqlQueryModel * model=new QSqlQueryModel();
    QString id_station=QString::number(ID_STATION);
    model->setQuery("SELECT * FROM STATION WHERE (ID_STATION LIKE '"+id_station+"' ) ");
    return  model;

}





