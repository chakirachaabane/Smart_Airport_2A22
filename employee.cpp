#include "employee.h"
#include <QSqlQuery>
#include <QDebug>
#include <QObject>

Employee::Employee(int tel,QString n,QString p,QString mail,QString mdp,QString role,int id,int age)
{
    this->tel=tel;
    nom=n;
    prenom=p;
    this->mail=mail;
    this->mdp=mdp;
    this->role=role;
    this->id=id;
    this->age=age;

}

Employee::Employee()
{
  id=1;
  tel=1;
  nom=" ";
  prenom=" ";
  age=1;
  mail=" ";
  role=" ";

}

bool Employee::ajouter()
{
    QString id_str=QString::number(id);
    QString tel_str=QString::number(tel);
    QString age_str=QString::number(age);
    QSqlQuery query;
          query.prepare("INSERT INTO EMPLOYES(CIN_EMPLOYE,NOM_EMP,PRENOM_EMP,NUMERO_TELEPHONE,AGE_EMP,ADRESSE_MAIL,MOT_DE_PASSE,ROLE) "
                        "VALUES (:CIN_EMPLOYE,:NOM_EMP,:PRENOM_EMP,:NUMERO_TELEPHONE,:AGE_EMP,:ADRESSE_MAIL,:MOT_DE_PASSE,:ROLE)");
          query.bindValue(":CIN_EMPLOYE",id_str);
          query.bindValue(":NOM_EMP",nom);
          query.bindValue(":PRENOM_EMP", prenom);
          query.bindValue(":NUMERO_TELEPHONE",tel_str);
           query.bindValue(":AGE_EMP",age_str);
          query.bindValue(":ADRESSE_MAIL",mail);
          query.bindValue(":MOT_DE_PASSE",mdp);
          query.bindValue(":ROLE",role);


         return query.exec();

}
 QSqlQueryModel *Employee:: afficher()
 {
     QSqlQueryModel* model=new QSqlQueryModel();
     model->setQuery("SELECT* FROM employes");
     model->setHeaderData(0, Qt::Horizontal, QObject::tr("identifiant"));
     model->setHeaderData(1, Qt::Horizontal, QObject::tr("nom"));
     model->setHeaderData(2, Qt::Horizontal, QObject::tr("prenom"));
     model->setHeaderData(3, Qt::Horizontal, QObject::tr("telephone"));
     model->setHeaderData(6, Qt::Horizontal, QObject::tr("mot de passe"));
     model->setHeaderData(7, Qt::Horizontal, QObject::tr("role"));
     model->setHeaderData(5, Qt::Horizontal, QObject::tr("mail"));


     return  model;
 }
 bool Employee::modifier(int)
 {
     QString id_str=QString::number(id);
     QString tel_str=QString::number(tel);
     QString age_str=QString::number(age);
     QSqlQuery query;
           query.prepare("UPDATE employes SET NOM_EMP=:NOM_EMP,PRENOM_EMP=:PRENOM_EMP,NUMERO_TELEPHONE=:NUMERO_TELEPHONE,AGE_EMP=:AGE_EMP,ADRESSE_MAIL=:ADRESSE_MAIL,MOT_DE_PASSE=:MOT_DE_PASSE,ROLE=:ROLE WHERE CIN_EMPLOYE=:CIN_EMPLOYE");
           query.bindValue(":CIN_EMPLOYE",id_str);
           query.bindValue(":NOM_EMP",nom);
           query.bindValue(":PRENOM_EMP", prenom);
           query.bindValue(":NUMERO_TELEPHONE",tel_str);
            query.bindValue(":AGE_EMP",age_str);
           query.bindValue(":ADRESSE_MAIL",mail);
           query.bindValue(":MOT_DE_PASSE",mdp);
           query.bindValue(":ROLE",role);


          return query.exec();

 }
 bool Employee::supprimer(int cin_employe)
 {
     QSqlQuery query;
           query.prepare("Delete From employes Where cin_employe=:cin_employe");
           query.bindValue(":cin_employe",cin_employe);
     return query.exec();
 }

