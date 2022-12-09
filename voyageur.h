#ifndef VOYAGEUR_H
#define VOYAGEUR_H
#include<QString>
#include<QSqlQuery>
#include <QSqlQueryModel>
class Voyageur
{
private:
    int CIN_VOY, NUMERO_PASSEPORT , AGE_VOY ;
    QString NOM_VOY, PRENOM_VOY , ORIGINE , GENRE ;
public:
    void Set_CIN_VOY(int n) ;
    void Set_NOM_VOY(QString n) ;
    void Set_PRENOM_VOY(QString n) ;
     void Set_NUMERO_PASSEPORT(int n) ;
     void Set_AGE_VOY(int n) ;
    void Set_ORIGINE(QString n) ;
    void Set_GENRE(QString n) ;


    int Get_CIN_VOY() ;
    QString Get_NOM_VOY() ;
     QString Get_PRENOM_VOY();
      int Get_NUMERO_PASSEPORT() ;
      int Get_AGE_VOY() ;
     QString Get_ORIGINE() ;
     QString Get_GENRE() ;


    Voyageur() ;
    Voyageur(int,QString,QString,int,int,QString,QString) ;
    bool ajouter() ;
    QSqlQueryModel* afficher() ;
    bool supprimer(int) ;
   bool modifier(int) ;
   QSqlQueryModel* afficher_tri_nom();
    QSqlQueryModel* afficher_tri_prenom();
   QSqlQueryModel*  afficher_tri_cin();
   QSqlQueryModel* rechercher(QString);
   QString voy_du_mois();





};

#endif // VOYAGEUR_H
