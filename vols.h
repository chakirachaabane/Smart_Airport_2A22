#ifndef VOLS_H
#define VOLS_H
#include<QString>
#include<QDateEdit>
#include<QTimeEdit>
#include<QSqlQuery>
#include<QSqlQueryModel>
#include<QTableView>

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
    void exporter(QTableView *table) ;

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
    QSqlQueryModel * recherche_id(int);
    QSqlQueryModel * recherche_destination(QString);
    QSqlQueryModel * recherche_matricule(QString);
    QSqlQueryModel * trie_prix();
    QSqlQueryModel * trie_date();
    QSqlQueryModel * trie_voyageurs();
    QSqlQueryModel*  rechercherDate(QDate);


    QSqlQueryModel * afficher_facture();
    QSqlQueryModel * get_matricules();

};

#endif // VOLS_H
