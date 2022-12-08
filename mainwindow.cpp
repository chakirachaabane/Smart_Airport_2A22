#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "dialog_statis.h"
#include "voyageur.h"
#include"connection.h"
#include"historique.h"
#include <QMessageBox>
#include <QIntValidator>
#include<QString>
/*#include<QPdfWriter>
#include<QDesktopServices>
#include<QPushButton>
#include<QRadioButton>
#include"QUrl"*/
#include <QDialog>
#include <QSqlQuery>
#include <QSqlQueryModel>
#include <QSortFilterProxyModel>
#include <QTextTableFormat>
#include <QStandardItemModel>
#include <QSortFilterProxyModel>
#include <QTextTableFormat>
#include <QStandardItemModel>
#include <QDialog>
#include <QFileDialog>
#include <QMediaPlayer>
#include <QVideoWidget>
#include <QDialog>
#include <QDesktopWidget>
#include <QSettings>
#include <QPrinter>
#include <QTextStream>
#include <QFile>
#include <QDataStream>
#include <QTextDocument>
#include"ui_dialog_stat.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)


{
    ui->setupUi(this);
    ui->lineEdit_cin->setValidator(new QIntValidator(0,999999999, this));
    ui->lineEdit_numeropass->setValidator(new QIntValidator(0,999999999, this));
    ui->lineEdit_age->setValidator(new QIntValidator(0,999999999, this));
    ui->tableView->setModel(V.afficher());
}



void MainWindow::on_pb_ajouter_clicked()
{
int CIN_VOY=ui->lineEdit_cin->text().toInt();
QString NOM_VOY=ui->lineEdit_nom->text();
QString PRENOM_VOY=ui->lineEdit_prenom->text();
int NUMERO_PASSEPORT=ui->lineEdit_numeropass->text().toInt();
int AGE_VOY=ui->lineEdit_age->text().toInt();
QString ORIGINE=ui->lineEdit_origine->text();
QString GENRE=ui->lineEdit_genre->text();
historique h;
h.save("CIN_VOY:"+ui->lineEdit_cin->text(),"NOM_VOY:"+ui->lineEdit_nom->text()," PRENOM_VOY :"+ui->lineEdit_prenom->text(),"NUMERO_PASSEPORT:"+ui->lineEdit_numeropass->text(),"AGE_VOY :"+ui->lineEdit_age->text(),"ORIGINE:"+ui->lineEdit_genre->text(),"GENRE :"+ui->lineEdit_genre->text());
Voyageur V(CIN_VOY,NOM_VOY, PRENOM_VOY, NUMERO_PASSEPORT, AGE_VOY,ORIGINE, GENRE);
bool test=V.ajouter();
if(test)
{   ui->tableView->setModel(V.afficher());
    QMessageBox::information(nullptr, QObject::tr("OK"), QObject::tr("ajout effectué\n"
                                                                    "Click Cancel to exist."),QMessageBox::Cancel);
}
    else
    {  QMessageBox::critical(nullptr, QObject::tr(" Not OK"), QObject::tr("ajout non effectué\n"
                                                                         "Click Cancel to exist."), QMessageBox::Cancel);

}
}

void MainWindow::on_pb_supprimer_clicked()
{
    Voyageur V1; V1.Set_CIN_VOY(ui->lineEdit_3->text().toInt());
    bool test=V1.supprimer(V1.Get_CIN_VOY());
    if (test)
    {   ui->tableView->setModel(V.afficher());
        QMessageBox::information(nullptr, QObject::tr("OK"), QObject::tr("supprission effectué\n"
                                                                        "Click Cancel to exist."),QMessageBox::Cancel);
    }
        else
        {  QMessageBox::critical(nullptr, QObject::tr(" Not OK"), QObject::tr("supprission non effectué\n"
                                                                             "Click Cancel to exist."), QMessageBox::Cancel);

    }

}

void MainWindow::on_pb_modifier_clicked()
{
    int CIN_VOY=ui->lineEdit_cin->text().toInt();
    QString NOM_VOY=ui->lineEdit_nom->text();
    QString PRENOM_VOY=ui->lineEdit_prenom->text();
    int NUMERO_PASSEPORT=ui->lineEdit_numeropass->text().toInt();
    int AGE_VOY=ui->lineEdit_age->text().toInt();
    QString ORIGINE=ui->lineEdit_origine->text();
    QString GENRE=ui->lineEdit_genre->text();
    Voyageur V(CIN_VOY,NOM_VOY, PRENOM_VOY, NUMERO_PASSEPORT, AGE_VOY,ORIGINE, GENRE);
if (CIN_VOY!=0)
{ bool test=V.modifier(CIN_VOY);
     QMessageBox mb;
    if(test)
    {   mb.setText("modification effectué");
        ui->tableView->setModel(V.afficher());
        ui->lineEdit_cin->clear();
                    ui->lineEdit_nom->clear();
                    ui->lineEdit_prenom->clear();
                    ui->lineEdit_numeropass->clear();
                    ui->lineEdit_age->clear();
                    ui->lineEdit_origine->clear();
                    ui->lineEdit_genre->clear();
                }
                else
                    mb.setText("Modification non effectuer");
                    mb.exec();
            }


}


void MainWindow::on_pb_rechercher_clicked()
{
     Voyageur v;
       ui->tableView->setModel(v.rechercher(ui->lineEdit_4->text()));
}
void MainWindow::on_pb_tri_nom_clicked()
{
    ui->tableView->setModel(V.afficher_tri_nom());
}

void MainWindow::on_pb_tri_prenom_clicked()
{
    ui->tableView->setModel(V.afficher_tri_prenom());
}
void MainWindow::on_pb_tri_cin_clicked()
{
     ui->tableView->setModel(V.afficher_tri_cin());
}
MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pb_PDF_clicked()
{
    QString strStream;
                   QTextStream out(&strStream);
                   const int rowCount = ui->tableView->model()->rowCount();
                   const int columnCount =ui->tableView->model()->columnCount();


                   out <<  "<html>\n"
                           "<head>\n"
                           "<meta Content=\"Text/html; charset=Windows-1251\">\n"
                           <<  QString("<title>%1</title>\n").arg("voyageur")
                           <<  "</head>\n"
                           "<body bgcolor=#CFC4E1 link=#5000A0>\n"
                               "<h1>Liste des voyageurs</h1>"

                               "<table border=1 cellspacing=0 cellpadding=2>\n";

                   // headers
                       out << "<thead><tr bgcolor=#f0f0f0>";
                       for (int column = 0; column < columnCount; column++)
                           if (!ui->tableView->isColumnHidden(column))
                               out << QString("<th>%1</th>").arg(ui->tableView->model()->headerData(column, Qt::Horizontal).toString());
                       out << "</tr></thead>\n";
                       // data table
                          for (int row = 0; row < rowCount; row++) {
                              out << "<tr>";
                              for (int column = 0; column < columnCount; column++) {
                                  if (!ui->tableView->isColumnHidden(column)) {
                                      QString data = ui->tableView->model()->data(ui->tableView->model()->index(row, column)).toString().simplified();
                                      out << QString("<td bkcolor=0>%1</td>").arg((!data.isEmpty()) ? data : QString("&nbsp;"));
                                  }
                              }
                              out << "</tr>\n";
                          }
                          out <<  "</table>\n"
                              "</body>\n"
                              "</html>\n";



         QTextDocument *document = new QTextDocument();
         document->setHtml(strStream);


          // QTextDocument *document;
             //  document->setHtml(strStream);
         //  document->setHtml(html);
           QPrinter printer(QPrinter::PrinterResolution);
           printer.setOutputFormat(QPrinter::PdfFormat);
           printer.setOutputFileName("mypdffile.pdf");
           document->print(&printer);
}



void MainWindow::on_ajoutHis_clicked()
{
    QFile file("C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt");
        if(!file.open(QIODevice::ReadOnly)){
            qCritical() << "file not found ";
            qCritical() << file.errorString();

        }
        QTextStream in(&file);
        ui->label_2->setText(in.readAll());

    }
/*void MainWindow::on_pb_statistique_clicked()
{
 Voyageur v;
   v= new Dialog_statis();
  v->setWindowTitle("statistique ComboBox");
  v->choix_pie();
  v->show();
}*/

void MainWindow::on_pb_voyageufidel_clicked()
{
     ui->tableView->setModel(V.afficher_tri_cin());
}

/*void MainWindow::on_pb_voyfidele_clicked()
{
    Voyageur v;
        QString n=v.voy_du_mois();
        QMessageBox msgBox;
        QString str;
        str=QString("le voyageur du mois est: %1 ").arg(n);
        msgBox.setText(str);
        msgBox.exec();
}*/
