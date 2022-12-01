#ifndef EMPLOYEE_H
#define EMPLOYEE_H
#include <QString>
#include <QSqlQuery>
#include <QSqlQueryModel>


class Employee
{
    QString prenom,nom,mdp,mail,role,id_carte;
    int tel,id,age;

public:
    Employee();
    Employee(int ,QString,QString,QString,QString,QString,int,int,QString);

    QString get_id_carte(){return id_carte;}
    QString get_nom(){return  nom;}
    int get_age(){return  age;}
    QString get_prenom(){return prenom;}
    int get_id(){return id;}
    QString get_mdp(){return mdp;}
    QString get_mail(){return  mail;}
    int get_tel(){return tel;}
    QString get_role(){return role;}

    //setters

    void set_nom(QString n){nom=n;}
    void setid(int i){id=i;}
    void setprenom(QString p){prenom=p;}

    //les fonctions de base
    bool ajouter();
    QSqlQueryModel * afficher();
    bool supprimer(int);
    bool modifier(int);
    QSqlQueryModel *trier(QString x);
     QSqlQueryModel*rechercher(QString a);
    int authentification(QString,QString);
    bool verification_id(int id_emp);




};


#endif // EMPLOYEE_H
