#include "voyageur.h"
#include <QSqlQuery>
#include <QtDebug>
#include <QObject>
#include <QSqlQueryModel>
#include<QString>
Voyageur::Voyageur()
{
CIN_VOY=0;
NUMERO_PASSEPORT=0;
AGE_VOY=0;
NOM_VOY="";
PRENOM_VOY="";
ORIGINE="";
GENRE="";
}


Voyageur::Voyageur(int CIN_VOY,QString NOM_VOY,QString PRENOM_VOY,int NUMERO_PASSEPORT,int AGE_VOY, QString ORIGINE,QString GENRE)
{
    this->CIN_VOY=CIN_VOY;
    this->NOM_VOY=NOM_VOY;
    this->PRENOM_VOY=PRENOM_VOY;
    this->NUMERO_PASSEPORT=NUMERO_PASSEPORT;
    this->AGE_VOY=AGE_VOY;
    this->ORIGINE=ORIGINE;
     this->GENRE=GENRE;

}
void Voyageur::Set_CIN_VOY(int n)
{CIN_VOY=n;}
void Voyageur::Set_NOM_VOY(QString n)
{NOM_VOY=n;}
void Voyageur::Set_PRENOM_VOY(QString n)
{ PRENOM_VOY=n;}
void Voyageur::Set_NUMERO_PASSEPORT(int n)
{NUMERO_PASSEPORT=n;}
void Voyageur::Set_AGE_VOY(int n)
{AGE_VOY=n;}
void Voyageur::Set_ORIGINE(QString n)
{ ORIGINE=n;}
void Voyageur::Set_GENRE(QString n)
{GENRE=n;}
int Voyageur::Get_CIN_VOY(){return CIN_VOY; }
QString Voyageur::Get_NOM_VOY(){ return NOM_VOY;}
QString Voyageur::Get_PRENOM_VOY(){return PRENOM_VOY; }
int Voyageur::Get_NUMERO_PASSEPORT(){return NUMERO_PASSEPORT ;}
int Voyageur::Get_AGE_VOY(){return AGE_VOY; }
QString Voyageur::Get_ORIGINE(){return ORIGINE;}
 QString Voyageur::Get_GENRE(){return GENRE;}
bool Voyageur:: ajouter()
{
    QSqlQuery query;
    QString res=QString::number(CIN_VOY);
    QString res1=QString::number(NUMERO_PASSEPORT);
     QString res2=QString::number(AGE_VOY);
     query.prepare("insert into VOYAGEURS(CIN_VOY,NOM_VOY,PRÉNOM_VOY,NUMÉRO_PASSEPORT,AGE_VOY,ORIGINE,GENRE)" "VALUES (:CIN_VOY,:NOM_VOY, :PRENOM_VOY , :NUMERO_PASSEPORT ,:AGE_VOY, :ORIGINE, :GENRE)");
     query.bindValue(":CIN_VOY",res );
     query.bindValue(":NOM_VOY", NOM_VOY);
     query.bindValue(":PRENOM_VOY", PRENOM_VOY);
      query.bindValue(":NUMERO_PASSEPORT",res1 );
      query.bindValue(":AGE_VOY",res2);
     query.bindValue(":ORIGINE", ORIGINE);
     query.bindValue(":GENRE", GENRE);
     return  query.exec();

}

bool Voyageur::supprimer(int CIN_VOY)
{
    QSqlQuery query;
    /*QString res=QString::number(CIN_VOY);*/
    query.prepare("Delete from VOYAGEURS where CIN_VOY=:CIN_VOY");
    query.bindValue(0,CIN_VOY);

    return  query.exec();


}
QSqlQueryModel* Voyageur::afficher()
{
    QSqlQueryModel* model=new QSqlQueryModel();

          model->setQuery("SELECT* FROM VOYAGEURS");
          model->setHeaderData(0, Qt::Horizontal,QObject::tr("CIN_VOY"));
          model->setHeaderData(3, Qt::Horizontal,QObject::tr("NOM_VOY"));
          model->setHeaderData(4, Qt::Horizontal,QObject::tr("PRENOM_VOY"));
           model->setHeaderData(1, Qt::Horizontal,QObject::tr("NUMERO_PASSEPORT"));
          model->setHeaderData(2, Qt::Horizontal,QObject::tr("AGE_VOY"));
          model->setHeaderData(5, Qt::Horizontal,QObject::tr("ORIGINE"));
          model->setHeaderData(6, Qt::Horizontal,QObject::tr("GENRE"));



    return model;
}
bool Voyageur::modifier(int CIN_VOY)
{
    QSqlQuery query;
              QString res=QString::number(CIN_VOY);
              QString res1=QString::number(NUMERO_PASSEPORT);
               QString res2=QString::number(AGE_VOY);

                query.prepare("UPDATE VOYAGEURS SET   CIN_VOY=:CIN_VOY,NOM_VOY=:NOM_VOY, PRENOM_VOY=:PRENOM_VOY,NUMERO_PASSEPORT=:NUMERO_PASSEPORT,AGE_VOY=:AGE_VOY, ORIGINE=:ORIGINE, GENRE=:GENRE where CIN_VOY=:CIN_VOY ");


                      query.bindValue(":CIN_VOY", res);
                       query.bindValue(":NOM_VOY", NOM_VOY);
                       query.bindValue(":PRENOM_VOY", PRENOM_VOY);
                        query.bindValue(":NUMERO_PASSEPORT", res1);
                       query.bindValue(":AGE_VOY", res2);
                       query.bindValue(":ORIGINE", ORIGINE);
                       query.bindValue(":GENRE", GENRE);




                  return query.exec();
}
 QSqlQueryModel * Voyageur::afficher_tri_nom()
 {
     QSqlQueryModel * model= new QSqlQueryModel();

 model->setQuery("select * from VOYAGEURS order by NOM_VOY asc ");

     return model;
 }
 QSqlQueryModel * Voyageur::afficher_tri_prenom()
 {
     QSqlQueryModel * model= new QSqlQueryModel();

 model->setQuery("select * from VOYAGEURS order by PRENOM_VOY asc ");

     return model;
 }
 QSqlQueryModel * Voyageur::afficher_tri_cin()
 {
     QSqlQueryModel * model= new QSqlQueryModel();

 model->setQuery("select * from VOYAGEURS order by CIN_VOY asc ");

     return model;
 }

 QSqlQueryModel* Voyageur::rechercher(QString a)
{
     QSqlQueryModel * query=new QSqlQueryModel();
     query->setQuery("select * from VOYAGEURS where ( NOM_VOY like '%"+a+"%' or PRENOM_VOY like '%"+a+"%' or CIN_VOY like '%"+a+"%' ) ");
     return    query;
}
/* QString Voyageur::voy_du_mois()
 { QString n;
     QString nom;
      //QString prenom;
             QSqlQuery qry("select MAX(NBR_HEURE_SUP) from VOYAGEURS ");
             while (qry.next())
             {n=qry.value(0).toString();}

             QSqlQuery qry1("select NOM from VOYAGEURS where NBR_HEURE_SUP ="+n);
             //QSqlQuery qry2("select PRNOM from PERSONEL where NBR_HEURE_SUP ="+n);
             while (qry1.next())
             {nom=qry1.value(0).toString();}

             return nom;


 }*/


