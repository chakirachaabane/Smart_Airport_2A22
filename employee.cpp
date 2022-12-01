#include "employee.h"
#include <QSqlQuery>
#include <QDebug>
#include <QObject>
#include <QMessageBox>

Employee::Employee(int tel,QString n,QString p,QString mail,QString mdp,QString role,int id,int age,QString id_c)
{
    this->tel=tel;
    nom=n;
    prenom=p;
    this->mail=mail;
    this->mdp=mdp;
    this->role=role;
    this->id=id;
    this->age=age;
    this->id_carte=id_c;

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
  id_carte=" ";

}

bool Employee::ajouter()
{
    QString id_str=QString::number(id);
    QString tel_str=QString::number(tel);
    QString age_str=QString::number(age);
    QSqlQuery query;
          query.prepare("INSERT INTO EMPLOYES(CIN_EMPLOYE,NOM_EMP,PRENOM_EMP,NUMERO_TELEPHONE,AGE_EMP,ADRESSE_MAIL,MOT_DE_PASSE,ROLE,CARD_ID) "
                        "VALUES (:CIN_EMPLOYE,:NOM_EMP,:PRENOM_EMP,:NUMERO_TELEPHONE,:AGE_EMP,:ADRESSE_MAIL,:MOT_DE_PASSE,:ROLE,:CARD_ID)");
          query.bindValue(":CIN_EMPLOYE",id_str);
          query.bindValue(":NOM_EMP",nom);
          query.bindValue(":PRENOM_EMP", prenom);
          query.bindValue(":NUMERO_TELEPHONE",tel_str);
           query.bindValue(":AGE_EMP",age_str);
          query.bindValue(":ADRESSE_MAIL",mail);
          query.bindValue(":MOT_DE_PASSE",mdp);
          query.bindValue(":ROLE",role);
          query.bindValue(":CARD_ID",id_carte);


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
     model->setHeaderData(4, Qt::Horizontal, QObject::tr("age"));
     model->setHeaderData(6, Qt::Horizontal, QObject::tr("mot de passe"));
     model->setHeaderData(7, Qt::Horizontal, QObject::tr("role"));
     model->setHeaderData(5, Qt::Horizontal, QObject::tr("mail"));
     model->setHeaderData(8, Qt::Horizontal, QObject::tr("Carte id"));


     return  model;
 }
 bool Employee::modifier(int i)
 {
     QString id_str=QString::number(i);
     QString tel_str=QString::number(tel);
     QString age_str=QString::number(age);
     QSqlQuery query;
           query.prepare("UPDATE employes SET NOM_EMP=:NOM_EMP,PRENOM_EMP=:PRENOM_EMP,NUMERO_TELEPHONE=:NUMERO_TELEPHONE,AGE_EMP=:AGE_EMP,ADRESSE_MAIL=:ADRESSE_MAIL,MOT_DE_PASSE=:MOT_DE_PASSE,ROLE=:ROLE,CARD_ID=:CARD_ID WHERE CIN_EMPLOYE=:CIN_EMPLOYE");
           query.bindValue(":CIN_EMPLOYE",i);
           query.bindValue(":NOM_EMP",nom);
           query.bindValue(":PRENOM_EMP", prenom);
           query.bindValue(":NUMERO_TELEPHONE",tel_str);
            query.bindValue(":AGE_EMP",age_str);
           query.bindValue(":ADRESSE_MAIL",mail);
           query.bindValue(":MOT_DE_PASSE",mdp);
           query.bindValue(":ROLE",role);
           query.bindValue(":CARD_ID",id_carte);
     if(i!=0 || tel !=0 || age!=0 || prenom!="" || nom!="" || mail!="" || mdp!="")
          return query.exec();
     return 0;

 }
 bool Employee::supprimer(int cin_employe)
 {  if (cin_employe!=0)
     {QSqlQuery query;
           query.prepare("Delete From employes Where cin_employe=:cin_employe");
           query.bindValue(":cin_employe",cin_employe);
     return query.exec();}
     else
         return false;

 }
 QSqlQueryModel *Employee::trier(QString x)
 {
     QSqlQueryModel * model= new QSqlQueryModel();
     qDebug()<<x<<endl;
     if(x=="nom")
         model->setQuery("select CIN_EMPLOYE,NOM_EMP,PRENOM_EMP,NUMERO_TELEPHONE,AGE_EMP,ADRESSE_MAIL,MOT_DE_PASSE,ROLE,CARD_ID from EMPLOYES order by NOM_EMP");
     else if(x=="prenom")
         model->setQuery("select CIN_EMPLOYE,NOM_EMP,PRENOM_EMP,NUMERO_TELEPHONE,AGE_EMP,ADRESSE_MAIL,MOT_DE_PASSE,ROLE,CARD_ID from employes order by PRENOM_EMP");
     else if (x=="id")
         model->setQuery("select CIN_EMPLOYE,NOM_EMP,PRENOM_EMP,NUMERO_TELEPHONE,AGE_EMP,ADRESSE_MAIL,MOT_DE_PASSE,ROLE,CARD_ID from employes order by CIN_EMPLOYE");

     model->setHeaderData(0, Qt::Horizontal, QObject::tr("cin"));
     model->setHeaderData(1, Qt::Horizontal, QObject::tr("nom"));
     model->setHeaderData(2, Qt::Horizontal, QObject::tr("prenom"));
     model->setHeaderData(3, Qt::Horizontal, QObject::tr("age"));
     model->setHeaderData(4, Qt::Horizontal, QObject::tr("tel"));
     model->setHeaderData(5, Qt::Horizontal, QObject::tr("adresse"));
     model->setHeaderData(6, Qt::Horizontal, QObject::tr("mdp"));
     model->setHeaderData(7, Qt::Horizontal, QObject::tr("role"));
     model->setHeaderData(8, Qt::Horizontal, QObject::tr("id carte"));
         return model;
 }
 QSqlQueryModel* Employee::rechercher(QString a)
 {
     QSqlQueryModel * query=new QSqlQueryModel();
     query->setQuery("select * from employes where (NOM_EMP like '%"+a+"%' or PRENOM_EMP like '%"+a+"%' ) ");
     return    query;
 }

 int Employee::authentification(QString user,QString mdp)
 {
     QSqlQuery query;
     QMessageBox msg;int i=0;QString r;

     query.prepare(QString("select * from employes WHERE cin_employe=:cin_employe AND mot_de_passe=:mot_de_passe"));
     query.bindValue(":cin_employe",user);
     query.bindValue(":mot_de_passe",mdp);
     query.exec();
     while(query.next())
     {
         QString IdFromDB=query.value("cin_employe").toString();
         QString MdpFromDB=query.value("mot_de_passe").toString();
         if(user==IdFromDB && mdp==MdpFromDB)
         {  r=query.value("ROLE").toString(); i=1;}


     }
     if (i==0)
        {
         msg.setText("error!  mot de passe ou identifiant incorrecte!");
         msg.exec();
         }
       else{

            if(r=="employe")
                i=2;

            }


     return i;

 }

 bool Employee::verification_id(int id_emp)
 {
     QSqlQuery query;
         QString n;
         QString  num = QString::number(id_emp);
                 query.exec("SELECT CIN_EMPLOYE from employes");
                 while (query.next())
                 {
                     n=query.value("CIN_EMPLOYE").toString();
                     if (n==num)
                     {
                         return true;
                     }
                 }
         return false;


 }



