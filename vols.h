#ifndef VOLS_H
#define VOLS_H
#include<QString>
#include<QDateEdit>
#include<QTimeEdit>
#include<QSqlQuery>
#include<QSqlQueryModel>

class Vols
{
private :
    QString destination,matricule;
    int voyageurs,identifiant;
    float prix;
    QDate date ;
    QTime  heure,duree;

   public:

    Vols();
    Vols(int,QString,int,float,QDate,QTime,QTime,QString);
    void setidentifiant (int n) ;
    void setdestination(QString n);
    void setdate(QDate n);
    void setheure(QTime n);
    void setduree (QTime n);
    void setprix(float n);
    void setvoyageurs(int n) ;
    void setmatricule(QString n);

    int get_identifiant() ;
    QString get_destination();
    QDate get_date();
    QTime get_heure();
    QTime get_duree();
    float get_prix();
    int get_voyageurs();
    QString get_matricule();
    bool ajouter();
    QSqlQueryModel * afficher();
    bool supprimer(int);
    bool modifier(int,QString,int,float,QDate,QTime,QTime,QString);


};

#endif // VOLS_H
