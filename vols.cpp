#include "vols.h"
#include<QString>
//#include<QDateEdit>
//#include<QTimeEdit>
#include<QObject>
#include<QtDebug>

#include<QTableView>
#include<QCoreApplication>
#include<QFile>
#include<QFileDialog>

Vols::Vols()
{
identifiant=0;
destination="";
prix=0 ;
voyageurs=0;
matricule=" ";
}

Vols::Vols(int identifiant,QString destination,int voyageurs,float prix,QDate a,QTime b,QTime c,QString matricule)
{
this->identifiant=identifiant;
this->destination=destination;
this->prix=prix;
this->voyageurs=voyageurs;
this->date=a;
this->heure=b;
this->duree=c;
this->matricule=matricule;
}


void Vols ::setidentifiant(int n) {identifiant=n;}
void Vols ::setdestination (QString n) {destination=n;}
void Vols ::setdate (QDate n) {date=n;}
void Vols ::setheure(QTime n) {heure=n;}
void Vols ::setduree (QTime n) {duree=n;}
void Vols ::setprix (float n) {prix=n;}
void Vols ::setvoyageurs (int n) {voyageurs=n;}
void Vols ::setmatricule (QString n) {matricule=n;}

bool Vols::ajouter()
{
    QSqlQuery query;
    QString id=QString::number(identifiant);
    QString voy=QString::number(voyageurs);
    QString prix_v=QString::number(prix);

    query.prepare("INSERT INTO vols (id_vol,destination,heure_de_depart,date_de_depart,duree,nombre_de_voyageurs,prix_vol,matricule)" "values( :id_vol, :destination, :heure_de_depart, :date_de_depart, :duree, :nombre_de_voyageurs, :prix_vol, :matricule)" );
    query.bindValue(":id_vol",id);
    query.bindValue(":destination",destination);
    query.bindValue(":heure_de_depart",heure);
    query.bindValue(":date_de_depart",date);

    query.bindValue(":duree",duree);
    query.bindValue(":nombre_de_voyageurs",voy);
    query.bindValue(":prix_vol",prix_v);
    query.bindValue(":matricule",matricule);
    return query.exec();
}




bool Vols::supprimer(int identifiant)
{
QSqlQuery query;
QString id= QString::number(identifiant);
query.prepare("Delete from vols where ID_VOL= :Id_vol");
query.bindValue(":Id_vol",id);
return query.exec();

}

QSqlQueryModel * Vols:: afficher()
{
    QSqlQueryModel * model =new QSqlQueryModel();
    model->setQuery("select * from VOLS");
    model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
    model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
    model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
    model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
    model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
    model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_voyageurs"));
    model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
    model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
    return model;
}

bool Vols::modifier(int identifiant,QString destination,int voyageurs,float prix,QDate date,QTime heure,QTime duree,QString matricule)
{
    QSqlQuery query;
    QString id=QString::number(identifiant);
    QString voy=QString::number(voyageurs);
    QString prix_v=QString::number(prix);

    query.prepare("UPDATE VOLS set id_vol= :id_vol ,destination= :destination,heure_de_depart= :heure_de_depart,date_de_depart= :date_de_depart,duree= :duree,nombre_de_voyageurs= :nombre_de_voyageurs,prix_vol= :prix_vol,matricule= :matricule where ID_VOL =  :id_vol" );
    query.bindValue(":id_vol",id);
    query.bindValue(":destination",destination);
    query.bindValue(":heure_de_depart",heure);
    query.bindValue(":date_de_depart",date);

    query.bindValue(":duree",duree);
    query.bindValue(":nombre_de_voyageurs",voy);
    query.bindValue(":prix_vol",prix_v);
    query.bindValue(":matricule",matricule);
    return query.exec();
}

QSqlQueryModel* Vols :: recherche_id(int identifiant)
{

QSqlQuery query;
QString id=QString::number(identifiant);
 query.prepare("SELECT * FROM vols where Id_vol = :identifiant");
 query.bindValue(":identifiant",id);
 query.exec();
 QSqlQueryModel *model=new QSqlQueryModel();
 model->setQuery(query);
    model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
    model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
    model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
    model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
    model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
    model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_voyageurs"));
    model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
    model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
  return  model;

}


QSqlQueryModel* Vols :: recherche_destination(QString destination)
{

QSqlQuery query;
 query.prepare("SELECT * FROM vols where Destination = :destination");
 query.bindValue(":destination",destination);
 query.exec();
 QSqlQueryModel *model=new QSqlQueryModel();
 model->setQuery(query);
    model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
    model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
    model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
    model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
    model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
    model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_voyageurs"));
    model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
    model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
  return  model;

}

QSqlQueryModel* Vols :: recherche_matricule(QString matricule)
{
    QSqlQuery query;
     query.prepare("SELECT * FROM vols where matricule = :matricule");
     query.bindValue(":matricule",matricule);
     query.exec();
     QSqlQueryModel *model=new QSqlQueryModel();
     model->setQuery(query);
        model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
        model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
        model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
        model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
        model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
        model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_voyageurs"));
        model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
        model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
      return  model;

}

QSqlQueryModel* Vols ::trie_prix()
{
  QSqlQueryModel *model=new QSqlQueryModel();
 model->setQuery("SELECT * FROM VOLS ORDER BY PRIX_VOL " );
 model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
 model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
 model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
 model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
 model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
 model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_voyageurs"));
 model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
 model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
  return  model;

}

QSqlQueryModel* Vols ::trie_date()
{
  QSqlQueryModel *model=new QSqlQueryModel();
 model->setQuery("SELECT * FROM VOLS ORDER BY Date_de_depart  " );
 model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
 model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
 model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
 model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
 model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
 model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_voyageurs"));
 model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
 model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
  return  model;

}

QSqlQueryModel* Vols ::trie_voyageurs()
{
  QSqlQueryModel *model=new QSqlQueryModel();
 model->setQuery("SELECT * FROM VOLS ORDER BY Nombre_de_voyageurs  " );
 model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
 model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
 model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
 model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
 model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
 model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_de_voyageurs"));
 model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
 model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
  return  model;
}

QSqlQueryModel*  Vols ::rechercherDate(QDate date)
 {

    QSqlQuery query;


     query.prepare("SELECT* FROM VOLS where Date_de_depart=:Date_de_depart");
     query.bindValue(":Date_de_depart",date);
     query.exec();
     QSqlQueryModel *model= new QSqlQueryModel;
model->setQuery(query);
model->setHeaderData(0,Qt::Horizontal,QObject::tr("Id_vol"));
model->setHeaderData(1,Qt::Horizontal,QObject::tr("Destination"));
model->setHeaderData(3,Qt::Horizontal,QObject::tr("Date_de_depart"));
model->setHeaderData(2,Qt::Horizontal,QObject::tr("Heure_de_depart"));
model->setHeaderData(4,Qt::Horizontal,QObject::tr("Duree"));
model->setHeaderData(5,Qt::Horizontal,QObject::tr("Nombre_de_voyageurs"));
model->setHeaderData(6,Qt::Horizontal,QObject::tr("Prix_vol"));
model->setHeaderData(7,Qt::Horizontal,QObject::tr("matricule"));
    return model;

 }



int Vols:: get_identifiant() {return identifiant;}
QString Vols:: get_destination () {return destination;}
QDate Vols:: get_date(){return date;}
QTime Vols:: get_heure() {return heure;}
QTime Vols:: get_duree() {return duree;}
float Vols:: get_prix(){return prix;}
int  Vols:: get_voyageurs(){return voyageurs;}
