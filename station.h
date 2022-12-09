#ifndef STATION_H
#define STATION_H
#include <QString>
#include <QSqlQueryModel>
#include <QDateTime>
class Station
{
public:
   Station();
    Station(int,int , int ,QString,QDateTime);
    int  getid_station();
    int getnum_poste();
    int getnum_piste();
    QString getdestination ();
    void setid_station(int);
    void setnum_poste(int);
    void setnum_piste(int);
    void setdestination(QString);
    bool ajouter();
    QSqlQueryModel* afficher();
     bool supprimer(int);
     bool modifier(int, int, int,QString,QDateTime);
     QSqlQueryModel * trier();
      QSqlQueryModel * triernump();
       QSqlQueryModel * rechercher(int ID_STATION);
private:
    int id_station ;
    int num_poste ;
    int num_piste ;
    QString destination ;
    QDateTime heure_arrivee;
};

#endif // STATION_H
