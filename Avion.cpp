#include "avions.h"
#include <QSqlQuery>
#include <QtDebug>
#include <QObject>
#include <QPdfWriter>
#include <QDebug>
#include <QObject>
#include <QMessageBox>




Avions::Avions()
{
 sieges=0;  Plq=0; Etatmoteur=""; Etatavion=""; Etatroues=""; essence="";
}

Avions::Avions(int Plq,int sieges,QString essence,QString Etatmoteur,QString Etatavion,QString Etatroues)
{
    this->Plq=Plq;
    this->sieges=sieges;
    this->essence=essence;
    this->Etatmoteur=Etatmoteur;
    this->Etatavion=Etatavion;
    this->Etatroues=Etatroues;
}


int Avions::getPlq(){return Plq;}
int Avions::getsieges(){return sieges;}
QString Avions::getessence(){return essence;}
QString Avions::getEtatmoteur(){return Etatmoteur;}
QString Avions::getEtatavion(){return Etatavion;}
QString Avions::getEtatroues(){return Etatroues;}



void Avions::setPlq(int Plq){this->Plq=Plq;}
void Avions::setsiege(int sieges){this->sieges=sieges;}
void Avions::setessence(QString essence){this->essence=essence;}
void Avions::setEtatmoteur(QString Etatmoteur){this->Etatmoteur=Etatmoteur;}
void Avions::setEtatavion(QString Etatavion){this->Etatavion=Etatavion;}
void Avions::setEtatroues(QString Etatroues){this->Etatroues=Etatroues;}



QSqlQueryModel*Avions::afficher()
{

QSqlQueryModel* model=new QSqlQueryModel();

model->setQuery("SELECT* FROM avion");
model->setHeaderData(0, Qt::Horizontal, QObject::tr("plaque"));
model->setHeaderData(1, Qt::Horizontal, QObject::tr("sieges"));
model->setHeaderData(2, Qt::Horizontal, QObject::tr("essence"));
model->setHeaderData(3, Qt::Horizontal, QObject::tr("etat moteur"));
model->setHeaderData(4, Qt::Horizontal, QObject::tr("etat avion"));
model->setHeaderData(5, Qt::Horizontal, QObject::tr("etat roues"));

return model;

}

bool Avions::ajouter()
{

     QSqlQuery query;
     query.prepare("INSERT INTO avion (Plq, sieges, essence ,Etatmoteur, Etatavion, Etatroues) "
                   "VALUES (:Plq, :sieges, :essence, :Etatmoteur, :Etatavion, :Etatroues)");// prparation de requette
     query.bindValue(":Plq", Plq);
     query.bindValue(":sieges", sieges);
     query.bindValue(":essence",essence);
     query.bindValue(":Etatmoteur",Etatmoteur);
     query.bindValue(":Etatavion",Etatavion );
     query.bindValue(":Etatroues",Etatroues);
     return query.exec();

}


bool Avions::supprimer(int Plq)
{
    QSqlQuery query;
    query.prepare(" Delete from avion where Plq=:Plq ");
    query.bindValue(":Plq",Plq);

    return query.exec();
}



bool Avions::modifier(int Plq, int sieges, QString essence, QString Etatmoteur, QString Etatavion, QString Etatroues)
{

    QSqlQuery query;
    query.prepare("update avion set sieges=:sieges,essence=:essence,Etatmoteur=:Etatmoteur,Etatavion=:Etatavion,Etatroues=:Etatroues where Plq=:Plq");
    query.bindValue(":Plq",Plq);
    query.bindValue(":sieges",sieges);
    query.bindValue(":essence",essence);
    query.bindValue(":Etatmoteur",Etatmoteur);
    query.bindValue(":Etatavion",Etatavion);
    query.bindValue(":Etatroues",Etatroues);
    return query.exec();

}

QSqlQueryModel* Avions::trier()

{
    QSqlQueryModel *model=new QSqlQueryModel();
     model->setQuery("select * from AVION order by PLQ");

     model->setHeaderData(0, Qt::Horizontal, QObject::tr("plaque"));
     model->setHeaderData(1, Qt::Horizontal, QObject::tr("sieges"));
     model->setHeaderData(2, Qt::Horizontal, QObject::tr("essence"));
     model->setHeaderData(3, Qt::Horizontal, QObject::tr("etat moteur"));
     model->setHeaderData(4, Qt::Horizontal, QObject::tr("etat avion"));
     model->setHeaderData(5, Qt::Horizontal, QObject::tr("etat roues"));


return model;
}
QSqlQueryModel *   Avions::rechercher(int PLQ)
{
    QSqlQueryModel * model=new QSqlQueryModel();
    QString plq=QString::number(PLQ);
    model->setQuery("SELECT * FROM AVION WHERE (PLQ LIKE '"+plq+"' ) ");
    return  model;

}
