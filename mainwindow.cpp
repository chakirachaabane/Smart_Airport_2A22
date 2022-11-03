#include "mainwindow.h"
#include "ui_mainwindow.h"
#include"station.h"
#include<QIntValidator>
#include<QSqlQuery>
#include<QMessageBox>
#include<QtDebug>


MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

   ui->le_id->setValidator(new QIntValidator(0, 9999999, this));

   ui->table_station->setModel(s.afficher());
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
    Station s( id_station , num_poste, num_piste,destination   );

    bool test= s.ajouter();
    if (test){
        QMessageBox::information(nullptr, QObject::tr(" OK"),
                    QObject::tr("Ajout successful.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);
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


         bool test=s2.modifier(id_station ,num_poste,num_piste, destination);

         if (test){
             QMessageBox::information(nullptr, QObject::tr(" OK"),
                         QObject::tr("modifier successful.\n"
                                     "Click Cancel to exit."), QMessageBox::Cancel);
              ui->table_station->setModel(s.afficher());

         }
         else
         {QMessageBox::critical(nullptr, QObject::tr("NOT OK"),
                         QObject::tr("modifier failed.\n"
                                     "Click Cancel to exit."), QMessageBox::Cancel);}

    }



