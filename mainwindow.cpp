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
#include <QPrinter>
#include <QTextStream>
#include <QFile>
#include <QDataStream>

#include <QTextDocument>
#include<QPixmap>
#include "arduino.h"

#include"exportexcel.h"
#include "voyageur.h"
#include <QLabel>

#include <QTextTableFormat>
#include <QStandardItemModel>
#include <QFileDialog>
#include <QDialog>
#include <QDesktopWidget>
#include <QSettings>

#include <QtWidgets/QMainWindow>
#include <QtCharts/QChartView>
#include <QtCharts/QBarSeries>
#include <QtCharts/QBarSet>
#include <QtCharts/QLegend>
#include <QtCharts/QBarCategoryAxis>
#include <QtCharts/QHorizontalStackedBarSeries>
#include <QtCharts/QLineSeries>
#include <QtCharts/QCategoryAxis>
#include <QtCharts/QPieSeries>
#include <QtCharts/QPieSlice>


MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    int ret=A.connect_arduino();
    switch(ret){
        case(0):qDebug()<< "arduino is available and connected to : "<< A.getarduino_port_name();
            break;
        case(1):qDebug() << "arduino is available but not connected to :" <<A.getarduino_port_name();
           break;
        case(-1):qDebug() << "arduino is not available";
        }
    QObject::connect(A.getserial(),SIGNAL(readyRead()),this,SLOT(update_label()));



    QPixmap pm("C:/Users/gaidi/OneDrive/Bureau/dd/station/ar.png.png"); // <- path to image file
       ui->label_3->setPixmap(pm);
       ui->label_3->setScaledContents(true);





   ui->le_id->setValidator(new QIntValidator(0, 9999999, this));
   ui->le_poste->setValidator(new QIntValidator(0, 9999999, this));
   ui->le_piste->setValidator(new QIntValidator(0, 9999999, this));

   ui->table_station->setModel(s.afficher());
   ui->tab_voy->setModel(Vtmp.afficher());
   ui->dateTimeEdit_ajout_ha->setDateTime((QDateTime::currentDateTime()));
   ui->dateTimeEdit_ajout_ha_modif->setDateTime((QDateTime::currentDateTime()));

  /* if(arduinotStatus){
       //popUp->setPopupText("Arduino is connected");

         // popUp->show();
   }else {
       QMessageBox::warning(nullptr,QObject::tr( "ARDUINO"),"Could not connect to Arduino uno");
   }
   QObject::connect(A.arduino,SIGNAL(readyRead()),this,SLOT(update_label()));*/




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
{ Station s;

    ui->table_station->setModel(s.rechercher(ui->le__recherche->text().toInt()));


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
                         ": %3 \n duree d'embarquement : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
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
                         ": %3 \n duree d'embarquement : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
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
                         ": %3 \n duree d'embarquement: %4 ").arg(matricule).arg(id).arg(temps).arg(x);
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
                         ": %3 \n duree d'embarquement : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
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
                         ": %3 \n duree d'embarquement : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
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
                         ": %3 \n duree d'embarquement : %4 ").arg(matricule).arg(id).arg(temps).arg(x);
   QMessageBox::information(nullptr,"info", msgg);



}

void MainWindow::on_pushButton_clicked()
{
    QString strStream;
                     QTextStream out(&strStream);
                     const int rowCount = ui->table_station->model()->rowCount();
                     const int columnCount =ui->table_station->model()->columnCount();

                     out <<  "<html>\n"
                             "<head>\n"
                             "<meta Content=\"Text/html; charset=Windows-1251\">\n"
                             <<  QString("<title>%1</title>\n").arg("STATION")
                             <<  "</head>\n"
                             "<body bgcolor=#CFC4E1 link=#5000A0>\n"
                                 "<h1>Liste des stations </h1>"

                                 "<table border=1 cellspacing=0 cellpadding=2>\n";

                     // headers
                         out << "<thead><tr bgcolor=#f0f0f0>";
                         for (int column = 0; column < columnCount; column++)
                             if (!ui->table_station->isColumnHidden(column))
                                 out << QString("<th>%1</th>").arg(ui->table_station->model()->headerData(column, Qt::Horizontal).toString());
                         out << "</tr></thead>\n";
                         // data table
                            for (int row = 0; row < rowCount; row++) {
                                out << "<tr>";
                                for (int column = 0; column < columnCount; column++) {
                                    if (!ui->table_station->isColumnHidden(column)) {
                                        QString data = ui->table_station->model()->data(ui->table_station->model()->index(row, column)).toString().simplified();
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
             QString link ="file:///C:station/mypdffile.pdf";
             document->print(&printer);
  }


void MainWindow::on_pushButton_2_clicked()
{
    QString fileName = QFileDialog::getSaveFileName(this, tr("Excel file"), qApp->applicationDirPath (),
                                                               tr("Excel Files (*.xls)"));
                    QString sheetName="test";
         ExportExcelObject s(fileName, sheetName, ui->table_station);
            s.addField(0, tr("ID_STATION"), "int");
            s.addField(1, tr("NUM_POSTE"), "int");
            s.addField(2, tr("NUM_PISTE"), "int");
            s.addField(4, tr("DESTINATION"), "char(20)");
            s.addField(5, tr("HEURE_ARRIVE"), "Date");


            s.export2Excel();
}



void MainWindow::on_pushButton_3_clicked()
{
    ui->table_station->setModel(s.afficher());//refresh
}

void MainWindow::on_le__recherche_textChanged(const QString &arg1)
{Station st;

    ui->table_station->setModel(st.rechercher(ui->le__recherche->text().toInt()));
}

void MainWindow:: update_label(){

        data=A.read_from_arduino();

        qDebug()<< data;
}

void MainWindow::on_verif_clicked()
{
    int datai = data.toInt();
    QString datas = QString::number(datai);
    bool exist  = false ;

    QSqlQuery query;
if(A.read_from_arduino()!= "")
     query.prepare("Select * from voyageurs where CIN_VOY='"+A.read_from_arduino()+"'");


    if (query.exec()){
            exist = true ;}

    if (exist)
    {
        QMessageBox::information(nullptr, QObject::tr("OK"), QObject::tr("Voyageur existant ! \n"
                                                                        "Click Cancel to exist."),QMessageBox::Cancel);
        ui->tabWidget->setCurrentIndex(1);
    }
    else
    {
        ui->lineEdit_cin->setText(datas);
         ui->tabWidget->setCurrentIndex(0);
    }
}
v


void MainWindow::on_pb_ajouter_2_clicked()
{
    int CIN_VOY=ui->lineEdit_cin->text().toInt();
    QString NOM_VOY=ui->lineEdit_nom->text();
    QString PRENOM_VOY=ui->lineEdit_prenom->text();
    int NUMERO_PASSEPORT=ui->lineEdit_numeropass->text().toInt();
    int AGE_VOY=ui->lineEdit_age->text().toInt();
    QString ORIGINE=ui->lineEdit_origine->text();
    QString GENRE=ui->lineEdit_genre->text();
   // historique h;
    //h.save("CIN_VOY:"+ui->lineEdit_cin->text(),"NOM_VOY:"+ui->lineEdit_nom->text()," PRENOM_VOY :"+ui->lineEdit_prenom->text(),"NUMERO_PASSEPORT:"+ui->lineEdit_numeropass->text(),"AGE_VOY :"+ui->lineEdit_age->text(),"ORIGINE:"+ui->lineEdit_genre->text(),"GENRE :"+ui->lineEdit_genre->text());
    Voyageur V(CIN_VOY,NOM_VOY, PRENOM_VOY, NUMERO_PASSEPORT, AGE_VOY,ORIGINE, GENRE);
    bool test=V.ajouter();
    if(test)
    {   ui->tab_voy->setModel(V.afficher());
        QMessageBox::information(nullptr, QObject::tr("OK"), QObject::tr("ajout effectué\n"
                                                                        "Click Cancel to exist."),QMessageBox::Cancel);
    }
        else
        {  QMessageBox::critical(nullptr, QObject::tr(" Not OK"), QObject::tr("ajout non effectué\n"
                                                                             "Click Cancel to exist."), QMessageBox::Cancel);

    }
}

void MainWindow::on_stat_clicked()
{
    Station s;
    try{
        QT_CHARTS_USE_NAMESPACE
        QChart *chart = new QChart();
        QBarSeries *series = new QBarSeries();
        QBarCategoryAxis *axis = new QBarCategoryAxis();

        QBarSet *set = new QBarSet(" NBR INSCRIPTION");
        QStringList typesList;
        QList<QBarSet *> nbrList;
        std::map<QString , int> list = s.statNbrPerType();
        for(auto itr = list.begin() ; itr != list.end(); itr++) {
            typesList.append(itr->first);
//            nbrList.append(itr->second);
            *set << itr->second;
            nbrList.append(set);
        }
        qDebug() << typesList;
        series->append(set);
        chart->addSeries(series);
        chart->setAnimationOptions(QChart::AllAnimations);
        axis->append(typesList);
        chart->createDefaultAxes();
        chart->setAxisX(axis, series);
        chart->legend()->setAlignment(Qt::AlignBottom);
        QChartView *chartView = new QChartView(chart);
        chartView->setRenderHint(QPainter::Antialiasing);
        QPalette pal = qApp->palette();
        pal.setColor(QPalette::Window, QRgb(0x0d4261));
        pal.setColor(QPalette::WindowText, QRgb(0x95212c));
        qApp->setPalette(pal);
        QFont font;
        font.setPixelSize(40);
        chart->setTitleFont(font);
        chart->setTitleBrush(QBrush(Qt::red));
        chart->setTitle("statistique NBR PER ID_STATION");
        chartView->setChart(chart);
        chartView->showNormal();



    }catch(...){
        qDebug() << "error";
    }

}

