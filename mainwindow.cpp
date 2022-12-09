#include "mainwindow.h"
#include "ui_mainwindow.h"
#include"station.h"
#include<QIntValidator>
#include<QSqlQuery>
#include<QMessageBox>
#include<QtDebug>
#include <QComboBox>
#include <QModelIndex>
#include <QDateTime>


MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

   ui->le_id->setValidator(new QIntValidator(0, 9999999, this));
   ui->le_poste->setValidator(new QIntValidator(0, 9999999, this));
   ui->le_piste->setValidator(new QIntValidator(0, 9999999, this));

   ui->table_station->setModel(s.afficher());
   ui->dateTimeEdit_ajout_ha->setDateTime((QDateTime::currentDateTime()));
   ui->dateTimeEdit_ajout_ha_modif->setDateTime((QDateTime::currentDateTime()));
}


MainWindow::~MainWindow()
{
    delete ui;
}



void MainWindow::on_pb_ajouter_clicked()
{
    int id_station=ui->le_id-> text().toInt();
   int num_poste=ui->le_poste->text().toInt();
   int num_piste=ui->le_piste->text().toInt();
   QString destination=ui->le_destination->text();
   QDateTime ha = ui->dateTimeEdit_ajout_ha->dateTime();
    Station s( id_station , num_poste, num_piste,destination,ha);

    bool test= s.ajouter();
    if (test){
        QMessageBox::information(nullptr, QObject::tr(" OK"),
                    QObject::tr("Ajout successful.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);
         ui->table_station->setModel(s.afficher());//refresh
         ui->le_id->clear();
                           ui->le_poste->clear();
                           ui->le_piste->clear();
                           ui->le_destination->clear();
                            ui->table_station->setModel(s.afficher());//refresh






    }
    else
        QMessageBox::critical(nullptr, QObject::tr("NOT OK"),
                    QObject::tr("Ajout failed.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);



    }




void MainWindow::on_PB_supp_clicked()
{
    Station s1;
    s1.setid_station (ui->l_id_supp->text().toInt());
        bool test=s1.supprimer(s1.getid_station());
        if (test){

        QMessageBox::information(nullptr, QObject::tr(" OK"),
                    QObject::tr("Delete successful.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);

        ui->table_station->setModel(s.afficher());
         ui->l_id_supp->clear();
          ui->table_station->setModel(s.afficher());


    }
    else
        QMessageBox::critical(nullptr, QObject::tr("NOT OK"),
                    QObject::tr("Delete failed.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);

    }




void MainWindow::on_PB_Modif_clicked()
{

    Station s2;

    int id_station=ui->l_id_modif-> text().toInt();
   int num_poste=ui->l_poste_modif->text().toInt();
   int num_piste=ui->l_piste_modif->text().toInt();
   QString destination=ui->l_destination_modif_2->text();
   QDateTime ha = ui->dateTimeEdit_ajout_ha_modif->dateTime();


         bool test=s2.modifier(id_station ,num_poste,num_piste, destination,ha);

         if (test){
             QMessageBox::information(nullptr, QObject::tr(" OK"),
                         QObject::tr("modifier successful.\n"
                                     "Click Cancel to exit."), QMessageBox::Cancel);
              ui->table_station->setModel(s.afficher());

              ui->l_id_modif->clear();
                                ui->l_poste_modif->clear();
                                ui->l_piste_modif->clear();
                                ui->l_destination_modif_2->clear();
                                 ui->table_station->setModel(s.afficher());//
         }
         else
         {QMessageBox::critical(nullptr, QObject::tr("NOT OK"),
                         QObject::tr("modifier failed.\n"
                                     "Click Cancel to exit."), QMessageBox::Cancel);}

    }


//void MainWindow::on_triid_clicked()
//{

       // Station s;
      //  ui->table_station->setModel(s.trier());
        //  ui->table_station->setModel(s.afficher());

    //}










void MainWindow::on_pushButton_triid_clicked()
{
                ui->table_station->setModel(s.trier());


}


void MainWindow::on_tri_numdeposte_clicked()
{
    ui->table_station->setModel(s.triernump());

}





void MainWindow::on_rechercherr_clicked()
{
    int id_station = ui->rechercherr->text().toInt();
    ui->table_station->setModel(s.rechercher(id_station));

}

void MainWindow::on_pushButton_plus_s1_clicked()
{
    QMessageBox msg;
    QString tst="test";
    QString matricule;
    QString temps;
    QDateTime datea;
    QDateTime  date ;

    int id ;
   QSqlQuery Query;
   QSqlQuery Query1;
   QSqlQuery Query2;

   Query.prepare("SELECT matricule from avions where ID_STATION =:id");
   Query.bindValue(":id",1);
   Query.exec();
   while(Query.next())
   {
          matricule = Query.value(0).toString();
   }


   Query1.prepare("SELECT id_vol , heure_de_depart from vols where matricule =:id");
   Query1.bindValue(":id",matricule);
   Query1.exec();
   while(Query1.next())
   {
          id  = Query1.value(0).toInt();
           date = Query1.value(1).toDateTime();

   }

   temps = date.toString();
   Query2.prepare("SELECT  heure_arrive from station where id_station =:id");
   Query2.bindValue(":id",1);
   Query2.exec();
   while(Query2.next())
   {
           datea = Query2.value(0).toDateTime();

   }

   int sec = datea.secsTo(date);
   QTime a(0,0,0);
   a = a.addSecs(int(sec));

   QString x = a.toString();
   QString msgg= QString("la matricule de l'avion : %1 \n numero de vol : %2 \n heure de depart "
                         ": %3 \n duree : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
   QMessageBox::information(nullptr,"info", msgg);



}

void MainWindow::on_pushButton_plus_s2_clicked()
{
    QMessageBox msg;
    QString tst="test";
    QString matricule;
    QString temps;
    QDateTime datea;
    QDateTime  date ;

    int id ;
   QSqlQuery Query;
   QSqlQuery Query1;
   QSqlQuery Query2;

   Query.prepare("SELECT matricule from avions where ID_STATION =:id");
   Query.bindValue(":id",2);
   Query.exec();
   while(Query.next())
   {
          matricule = Query.value(0).toString();
   }


   Query1.prepare("SELECT id_vol , heure_de_depart from vols where matricule =:id");
   Query1.bindValue(":id",matricule);
   Query1.exec();
   while(Query1.next())
   {
          id  = Query1.value(0).toInt();
           date = Query1.value(1).toDateTime();

   }

   temps = date.toString();
   Query2.prepare("SELECT  heure_arrive from station where id_station =:id");
   Query2.bindValue(":id",2);
   Query2.exec();
   while(Query2.next())
   {
           datea = Query2.value(0).toDateTime();

   }

   int sec = datea.secsTo(date);
   QTime a(0,0,0);
   a = a.addSecs(int(sec));

   QString x = a.toString();
   QString msgg= QString("la matricule de l'avion : %1 \n numero de vol : %2 \n heure de depart "
                         ": %3 \n duree : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
   QMessageBox::information(nullptr,"info", msgg);



}

void MainWindow::on_pushButton_plus_s3_clicked()
{
    QMessageBox msg;
    QString tst="test";
    QString matricule;
    QString temps;
    QDateTime datea;
    QDateTime  date ;

    int id ;
   QSqlQuery Query;
   QSqlQuery Query1;
   QSqlQuery Query2;

   Query.prepare("SELECT matricule from avions where ID_STATION =:id");
   Query.bindValue(":id",3);
   Query.exec();
   while(Query.next())
   {
          matricule = Query.value(0).toString();
   }


   Query1.prepare("SELECT id_vol , heure_de_depart from vols where matricule =:id");
   Query1.bindValue(":id",matricule);
   Query1.exec();
   while(Query1.next())
   {
          id  = Query1.value(0).toInt();
           date = Query1.value(1).toDateTime();

   }

   temps = date.toString();
   Query2.prepare("SELECT  heure_arrive from station where id_station =:id");
   Query2.bindValue(":id",3);
   Query2.exec();
   while(Query2.next())
   {
           datea = Query2.value(0).toDateTime();

   }

   int sec = datea.secsTo(date);
   QTime a(0,0,0);
   a = a.addSecs(int(sec));

   QString x = a.toString();
   QString msgg= QString("la matricule de l'avion : %1 \n numero de vol : %2 \n heure de depart "
                         ": %3 \n duree : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
   QMessageBox::information(nullptr,"info", msgg);



}

void MainWindow::on_pushButton_plus_s4_clicked()
{
    QMessageBox msg;
    QString tst="test";
    QString matricule;
    QString temps;
    QDateTime datea;
    QDateTime  date ;

    int id ;
   QSqlQuery Query;
   QSqlQuery Query1;
   QSqlQuery Query2;

   Query.prepare("SELECT matricule from avions where ID_STATION =:id");
   Query.bindValue(":id",4);
   Query.exec();
   while(Query.next())
   {
          matricule = Query.value(0).toString();
   }


   Query1.prepare("SELECT id_vol , heure_de_depart from vols where matricule =:id");
   Query1.bindValue(":id",matricule);
   Query1.exec();
   while(Query1.next())
   {
          id  = Query1.value(0).toInt();
           date = Query1.value(1).toDateTime();

   }

   temps = date.toString();
   Query2.prepare("SELECT  heure_arrive from station where id_station =:id");
   Query2.bindValue(":id",4);
   Query2.exec();
   while(Query2.next())
   {
           datea = Query2.value(0).toDateTime();

   }

   int sec = datea.secsTo(date);
   QTime a(0,0,0);
   a = a.addSecs(int(sec));

   QString x = a.toString();
   QString msgg= QString("la matricule de l'avion : %1 \n numero de vol : %2 \n heure de depart "
                         ": %3 \n duree : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
   QMessageBox::information(nullptr,"info", msgg);



}

void MainWindow::on_pushButton_plus_s5_clicked()
{
    QMessageBox msg;
    QString tst="test";
    QString matricule;
    QString temps;
    QDateTime datea;
    QDateTime  date ;

    int id ;
   QSqlQuery Query;
   QSqlQuery Query1;
   QSqlQuery Query2;

   Query.prepare("SELECT matricule from avions where ID_STATION =:id");
   Query.bindValue(":id",5);
   Query.exec();
   while(Query.next())
   {
          matricule = Query.value(0).toString();
   }


   Query1.prepare("SELECT id_vol , heure_de_depart from vols where matricule =:id");
   Query1.bindValue(":id",matricule);
   Query1.exec();
   while(Query1.next())
   {
          id  = Query1.value(0).toInt();
           date = Query1.value(1).toDateTime();

   }

   temps = date.toString();
   Query2.prepare("SELECT  heure_arrive from station where id_station =:id");
   Query2.bindValue(":id",5);
   Query2.exec();
   while(Query2.next())
   {
           datea = Query2.value(0).toDateTime();

   }

   int sec = datea.secsTo(date);
   QTime a(0,0,0);
   a = a.addSecs(int(sec));

   QString x = a.toString();
   QString msgg= QString("la matricule de l'avion : %1 \n numero de vol : %2 \n heure de depart "
                         ": %3 \n duree : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
   QMessageBox::information(nullptr,"info", msgg);



}

void MainWindow::on_pushButton_plus_s6_clicked()
{
    QMessageBox msg;
    QString tst="test";
    QString matricule;
    QString temps;
    QDateTime datea;
    QDateTime  date ;

    int id ;
   QSqlQuery Query;
   QSqlQuery Query1;
   QSqlQuery Query2;

   Query.prepare("SELECT matricule from avions where ID_STATION =:id");
   Query.bindValue(":id",6);
   Query.exec();
   while(Query.next())
   {
          matricule = Query.value(0).toString();
   }


   Query1.prepare("SELECT id_vol , heure_de_depart from vols where matricule =:id");
   Query1.bindValue(":id",matricule);
   Query1.exec();
   while(Query1.next())
   {
          id  = Query1.value(0).toInt();
           date = Query1.value(1).toDateTime();

   }

   temps = date.toString();
   Query2.prepare("SELECT  heure_arrive from station where id_station =:id");
   Query2.bindValue(":id",6);
   Query2.exec();
   while(Query2.next())
   {
           datea = Query2.value(0).toDateTime();

   }

   int sec = datea.secsTo(date);
   QTime a(0,0,0);
   a = a.addSecs(int(sec));

   QString x = a.toString();
   QString msgg= QString("la matricule de l'avion : %1 \n numero de vol : %2 \n heure de depart "
                         ": %3 \n duree : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
   QMessageBox::information(nullptr,"info", msgg);



}
