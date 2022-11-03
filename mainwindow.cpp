#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "vols.h"
#include "dialog.h"
#include<QString>
#include<QDateEdit>
#include<QTimeEdit>
#include<QPixmap>
#include <QMessageBox>
#include<QIntValidator>



MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
 ui->lineEdit_id -> setValidator (new QIntValidator (0,999999,this)) ;
 ui->lineEdit_voyageurs -> setValidator (new QIntValidator (0,999999,this)) ;
 ui->lineEdit_prix -> setValidator (new QIntValidator (0,999999,this)) ;
 ui->lineEdit_destination -> setValidator (new QRegExpValidator (QRegExp("[A-Z,a-z]*"))) ;

       ui->tabaff->setModel(V.afficher());
       QPixmap pix ("C:/Users/user/Desktop/2éme année/Projet C++/logoil.png");
     ui->label_pic->setPixmap(pix.scaled(100,100,Qt ::KeepAspectRatio));

     QPixmap pixx ("C:/Users/user/Desktop/2éme année/Projet C++/flight.png");
     ui->label_flight ->setPixmap(pixx.scaled(300,300,Qt ::KeepAspectRatio));
     }
MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::on_pushButton_clicked()
{

    int identifiant=ui->lineEdit_id->text().toInt();
    QString destination=ui->lineEdit_destination->text();
    int voyageurs=ui->lineEdit_voyageurs->text().toInt();
    float prix=ui->lineEdit_prix->text().toFloat();
    QDate date=ui->dateEdit_date->date();
    QTime heure=ui->timeEdit_heure->time();
    QTime duree=ui->timeEdit_duree->time();
    QString matricule=ui->lineEdit_matricule->text();

    Vols V(identifiant,destination,voyageurs,prix,date,heure,duree,matricule);
    bool test =V.ajouter();
    if (test)
    {
    QMessageBox::information(nullptr, QObject::tr(" OK"),
                    QObject::tr("Ajout effectué.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);
          ui->tabaff->setModel(V.afficher());}


    else
        if( destination.isEmpty () || matricule .isEmpty())
                     {

                         QMessageBox::critical(nullptr, QObject::tr("Not OK"),
                         QObject::tr("Veuillez remplir les champs vides.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);
                     }
      else   { QMessageBox::critical(nullptr, QObject::tr("Not OK"),
                    QObject::tr("Ajout non effectué.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);}


    }



void MainWindow::on_pushButton_supprimer_clicked()
{
    int identifiant =ui->lineEdit_id->text().toInt();
    bool test=V.supprimer(identifiant);
    if (test)
        {
        QMessageBox::information(nullptr, QObject::tr("OK"),
                        QObject::tr("Suppression effectuée.\n"
                                    "Click Cancel to exit."), QMessageBox::Cancel);
        ui->tabaff->setModel(V.afficher());
    }

        else
            QMessageBox::critical(nullptr, QObject::tr("Not OK"),
                        QObject::tr("Suppression non effectuée.\n"
                                    "Click Cancel to exit."), QMessageBox::Cancel);}



void MainWindow::on_pushButton_3_clicked()
{
    int identifiant=ui->lineEdit_id->text().toInt();
    QString destination=ui->lineEdit_destination->text();
    int voyageurs=ui->lineEdit_voyageurs->text().toInt();
    float prix=ui->lineEdit_prix->text().toFloat();
    QDate date=ui->dateEdit_date->date();
    QTime heure=ui->timeEdit_heure->time();
    QTime duree=ui->timeEdit_duree->time();
    QString matricule=ui->lineEdit_matricule->text();

    Vols V(identifiant,destination,voyageurs,prix,date,heure,duree,matricule);
    bool test =V.modifier(identifiant,destination,voyageurs,prix,date,heure,duree,matricule);
    if (test)
    {
    QMessageBox::information(nullptr, QObject::tr(" OK"),
                    QObject::tr("Modification effectuée.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);
                                 ui->tabaff->setModel(V.afficher());
    }


    else
        {QMessageBox::critical(nullptr, QObject::tr("Not OK"),
                    QObject::tr("Modification non effectué.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);}
}
