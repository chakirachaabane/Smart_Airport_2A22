#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "employee.h"
#include<QMessageBox>
#include <QTextFormat>
#include "signupdialog.h"
#include <QDebug>
#include "recuperer_mdp.h"
#include "stats_age.h"
#include "vols.h"
//#include "dialog.h"
#include "arduino.h"
#include<QString>
#include<QDateEdit>
#include<QTimeEdit>
#include<QPixmap>
#include <QMessageBox>
#include<QIntValidator>



#include <QSortFilterProxyModel>
#include <QTextTableFormat>
#include <QStandardItemModel>
#include <QDialog>
#include <QFileDialog>
#include <QDialog>
#include <QDesktopWidget>
#include <QSettings>
#include <QPrinter>

#include <QTextStream>
#include <QFile>
#include <QDataStream>
#include <QTextDocument>




#include <QtCharts/QBarSeries>
#include <QtCharts/QBarSet>
#include <QtCharts/QLegend>
#include <QtCharts>
#include <QtCharts/QPieSeries>
#include <QtCharts/QPieSlice>
#include <QPieSlice>
#include <QPieSeries>
#include <QtCharts/QChartView>
#include <QApplication>

#include <QCalendarWidget>
#include <QDateEdit>
#include <QDateTime>
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    //ui->lineEdit_ID->setValidator(new QIntValidator(0, 9999999, this));
    ui->lineEdit_age->setValidator(new QIntValidator(0, 99, this));
    ui->lineEdit_tel->setValidator(new QIntValidator(0, 99999999, this));
    ui->lineEdit_nom->setValidator(new QRegExpValidator(QRegExp("[A-Z,a-z]*")));
    ui->lineEdit_prenom->setValidator(new QRegExpValidator(QRegExp("[A-Z,a-z]*")));
    ui->radioButton_admin->setChecked(true);
    ui->radioButton_signin->setChecked(true);
    ui->tab_employe->setModel(e.afficher());
    ui->stackedWidget->setCurrentIndex(0);

    //chakira
    /*int ret=A.connect_arduino(); // lancer la connexion à arduino
        switch(ret){
        case(0):qDebug()<< "arduino is available and connected to : "<< A.getarduino_port_name();
            break;
        case(1):qDebug() << "arduino is available but not connected to :" <<A.getarduino_port_name();
           break;
        case(-1):qDebug() << "arduino is not available";
        }
          data=A.read_from_arduino();
        qDebug() << data;

      int a= pk.dispo_place();
      QByteArray abyte0;
      abyte0.resize(4);

      abyte0[0] = (uchar)
    (0x000000ff & a);

    A.write_to_arduino(abyte0);


         QObject::connect(A.getserial(),SIGNAL(readyRead()),this,SLOT(update_label())); // permet de lancer
         //le slot update_label suite à la reception du signal readyRead (reception des données).*/






    ui->comboBox_modif->setModel(V.afficher());
      ui->comboBox_supp->setModel(V.afficher());
 ui->lineEdit_id -> setValidator (new QIntValidator (0,999999,this)) ;
 ui->lineEdit_voyageurs -> setValidator (new QIntValidator (0,999999,this)) ;
 ui->lineEdit_prix -> setValidator (new QIntValidator (0,999999,this)) ;
 ui->lineEdit_destination -> setValidator (new QRegExpValidator (QRegExp("[A-Z,a-z]*"))) ;

       ui->tabaff->setModel(V.afficher());
       QPixmap pix ("C:/Users/user/Desktop/2éme année/Projet C++/logoil.png");
     ui->label_pic->setPixmap(pix.scaled(100,100,Qt ::KeepAspectRatio));

     QPixmap pix1 ("C:/Users/user/Desktop/2éme année/Projet C++/logoil.png");
   ui->label_pic2->setPixmap(pix1.scaled(100,100,Qt ::KeepAspectRatio));


   QPixmap pix2 ("C:/Users/user/Desktop/2éme année/Projet C++/logoil.png");
 ui->label_logo3->setPixmap(pix2.scaled(100,100,Qt ::KeepAspectRatio));

     QPixmap pixx ("C:/Users/user/Desktop/2éme année/Projet C++/flight.png");
     ui->label_flight ->setPixmap(pixx.scaled(300,300,Qt ::KeepAspectRatio));


     QPixmap pixx2 ("C:/Users/user/Desktop/2éme année/Projet C++/flight.png");
     ui->label_flight2 ->setPixmap(pixx2.scaled(300,300,Qt ::KeepAspectRatio));

     ui->labelgif->setMask((new QPixmap("C:/Users/user/Desktop/2éme année/Projet C++/avion3.gif"))->mask());
            QMovie *movie = new QMovie ("C:/Users/user/Desktop/2éme année/Projet C++/avion3.gif");
            ui->labelgif->setMovie(movie);
            movie->start();
            ui->labelgif->show();

      ui->facture->setModel(V.afficher_facture());
      ui->matricule->setModel(V.get_matricules()); //chakira

    //arduino
    int ret=A.connect_arduino(); // lancer la connexion à arduino
        switch(ret){
        case(0):qDebug()<< "arduino is available and connected to : "<< A.getarduino_port_name();
            break;
        case(1):qDebug() << "arduino is available but not connected to :" <<A.getarduino_port_name();
           break;
        case(-1):qDebug() << "arduino is not available";
        }
         QObject::connect(A.getserial(),SIGNAL(readyRead()),this,SLOT(onMsg())); // permet de lancer




}

MainWindow::~MainWindow()
{
    delete ui;
}
void MainWindow::on_login_clicked()
{   QMessageBox msg;
    QString username=ui->lineEdit_username->text();
    QString mdp=ui->lineEdit_password->text();
    Employee e;
    if(e.authentification(username,mdp)==1)
      {
       ui->stackedWidget->setCurrentIndex(1);
       msg.setText("welcome admin!");msg.exec();
       }
     else
      {if(e.authentification(username,mdp)==2)
        {msg.setText("welcome employe!");msg.exec();
            ui->stackedWidget->setCurrentIndex(2);}
       }
    ui->lineEdit_username->clear();
    ui->lineEdit_password->clear();


ui->tab_employe->setModel(e.afficher());

}

void MainWindow::on_pushButton_ajouter_clicked()
{bool test;
    QString role=" ";
    int id=ui->lineEdit_ID->text().toInt();
    QString nom=ui->lineEdit_nom->text();
    QString prenom=ui->lineEdit_prenom->text();
    QString mail=ui->lineEdit_mail->text();
    int age=ui->lineEdit_age->text().toInt();
    int tel=ui->lineEdit_tel->text().toInt();
    if (ui->radioButton_admin->isChecked())
       {role="admin";}
    else
       {role="employe";}
    QString mdp=ui->lineEdit_mdp->text();
    QString carte=ui->lineEdit_carte->text();

    Employee E(tel,nom,prenom,mail,mdp,role,id,age,carte);
    QMessageBox msg;
    test=controlesaisi();
    if(test)
    test=E.ajouter();

    if(test)
    {
      msg.setText("ajout avec succes!!");

      ui->tab_employe->setModel(E.afficher());
      ui->lineEdit_nom->clear();
              ui->lineEdit_prenom->clear();
              ui->lineEdit_mail->clear();
              ui->lineEdit_age->clear();
              ui->lineEdit_tel->clear();




              ui->lineEdit_mdp->clear();

     }
    else
    msg.setText("echec d'ajout");
     msg.exec();



}

void MainWindow::on_supprimer_emp_clicked()
{
    Employee e1;QMessageBox msg;
    e1.setid(ui->lineEdit_id_a_supprimer->text().toInt());
   bool test=false;
   bool trouver=e1.verification_id(e1.get_id());
         if(trouver)
           test=e1.supprimer(e1.get_id());
         else
         {msg.setText("id n'existe pas!!");msg.exec();}


    if(test)
    {
      msg.setText("suppression avec succes!!");
      ui->tab_employe->setModel(e.afficher());
      ui->lineEdit_nom->clear();
              ui->lineEdit_prenom->clear();
              ui->lineEdit_mail->clear();
              ui->lineEdit_age->clear();
              ui->lineEdit_tel->clear();
              ui->lineEdit_id_a_supprimer->clear();



              ui->lineEdit_mdp->clear();
     }
    else
    msg.setText("!!echec de suppression!!");
     msg.exec();

}

void MainWindow::on_modifier_e_clicked()
{
    bool test;bool trouver;
        QString role=" ";
        int id=ui->lineEdit_ID->text().toInt();
        QString nom=ui->lineEdit_nom->text();
        QString prenom=ui->lineEdit_prenom->text();
        QString mail=ui->lineEdit_mail->text();
        int age=ui->lineEdit_age->text().toInt();
        int tel=ui->lineEdit_tel->text().toInt();
        if (ui->radioButton_admin->isChecked())
           {role="admin";}
        else
           {role="employe";}
        QString mdp=ui->lineEdit_mdp->text();
        QString carte=ui->lineEdit_carte->text();

        Employee E(tel,nom,prenom,mail,mdp,role,id,age,carte);
        QMessageBox msg;
        test=controlesaisi();
        if(test)
        test=E.modifier(id);

        trouver=E.verification_id(id);
        if(!trouver)
        {
            test=false;
            msg.setText("id n'existe pas");
            msg.exec();
         }

        if(test)
        {
          msg.setText("modification avec succes!!");

          ui->tab_employe->setModel(E.afficher());

          ui->lineEdit_nom->clear();
                  ui->lineEdit_prenom->clear();
                  ui->lineEdit_mail->clear();
                  ui->lineEdit_age->clear();
                  ui->lineEdit_tel->clear();




                  ui->lineEdit_mdp->clear();

         }
        else
        msg.setText("echec de modification");
         msg.exec();


}

bool MainWindow::controlesaisi()
{
    QRegExp mailRex("\\b[A-Z,a-z0-9._%+-]+@[A-Z,a-z0-9.-]+\\.[A-Z,a-z]{2,4}\\b");
    mailRex.setCaseSensitivity(Qt::CaseInsensitive);
    mailRex.setPatternSyntax(QRegExp::RegExp);


    if (

                !(ui->lineEdit_nom->text().contains(QRegExp("^[A-Za-z]+$"))) ||

                !(ui->lineEdit_prenom->text().contains(QRegExp("^[A-Za-z]+$"))) ||


                ui->lineEdit_ID->text().isEmpty() ||

                ui->lineEdit_ID->text().toInt() == 0 ||

                !(mailRex.exactMatch(ui->lineEdit_mail->text())))



            return 0;

        else

            return 1;







}

void MainWindow::on_trier_bt_clicked()
{
    Employee e;
    ui->tab_employe->setModel(e.trier(ui->comboBox_tri->currentText()));

}

void MainWindow::on_chercher_bt_clicked()
{
    Employee e;
    ui->tab_employe->setModel(e.rechercher(ui->lineEdit_search->text()));
}

void MainWindow::on_pushButton_statistique_clicked()
{
            s = new stats_age();

          s->setWindowTitle("statistique âge employée");
          s->stats();
          s->show();
}

void MainWindow::on_pushButton_2_clicked()
{
    QString strStream;
                QTextStream out(&strStream);
                const int rowCount = ui->tab_employe->model()->rowCount();
                const int columnCount =ui->tab_employe->model()->columnCount();


                out <<  "<html>\n"
                        "<head>\n"
                        "<meta Content=\"Text/html; charset=Windows-1251\">\n"
                        <<  QString("<title>%1</title>\n").arg("eleve")
                        <<  "</head>\n"
                        "<body bgcolor=#CFC4E1 link=#5000A0>\n"
                            "<h1>Liste des Evenements</h1>"

                            "<table border=1 cellspacing=0 cellpadding=2>\n";

                // headers
                    out << "<thead><tr bgcolor=#f0f0f0>";
                    for (int column = 0; column < columnCount; column++)
                        if (!ui->tab_employe->isColumnHidden(column))
                            out << QString("<th>%1</th>").arg(ui->tab_employe->model()->headerData(column, Qt::Horizontal).toString());
                    out << "</tr></thead>\n";
                    // data table
                       for (int row = 0; row < rowCount; row++) {
                           out << "<tr>";
                           for (int column = 0; column < columnCount; column++) {
                               if (!ui->tab_employe->isColumnHidden(column)) {
                                   QString data = ui->tab_employe->model()->data(ui->tab_employe->model()->index(row, column)).toString().simplified();
                                   out << QString("<td bkcolor=0>%1</td>").arg((!data.isEmpty()) ? data : QString("&nbsp;"));
                               }
                           }
                           out << "</tr>\n";
                       }
                       out <<  "</table>\n"
                           "</body>\n"
                           "</html>\n";



        QTextDocument *document= new QTextDocument();
        document->setHtml(strStream);


        //QTextDocument document;
        //document.setHtml(html);
        QPrinter printer(QPrinter::PrinterResolution);
        printer.setOutputFormat(QPrinter::PdfFormat);
        printer.setOutputFileName("employees_data.pdf");
        document->print(&printer);
}
void MainWindow::on_mdp_oubliee_bt_clicked()
{
    recuperer_mdp *mdp=new recuperer_mdp(this);
    if(!mdp->exec());

}



void MainWindow::on_sign_in_clicked()
{
    SignUpDialog *sign=new SignUpDialog(this);
      if(!sign->exec());
}

void MainWindow::on_quitter_button_clicked()
{
 ui->stackedWidget->setCurrentIndex(0);
}
void MainWindow::onMsg()
{

    while(A.getserial()->canReadLine())
       {//partie input
           data=A.getserial()->readLine();
           data.chop(2);


           char* a=data.data();QString b=a;
           QString data_inf="";
           for(int i=2;i<b.length();i++)
               data_inf+=a[i];

           QString role;
           QString nom=A.chercher(data_inf,&role);
           QMessageBox msg;

           qDebug()<<"Data Received: " <<data;
           //partie output

           if(data.split(':')[0] == "s")
                  {
                      if(data.split(':')[1] == "-1")
                      {
                         qDebug()<< "Not Detected"; // si les données reçues de arduino via la liaison série sont égales à 1
                         //msg.setText("erreur de scan!!!!!!");msg.exec();

                      }
                      else
                      {msg.setText("card scanned successfully!!!!!!");msg.exec();} // si les données reçues de arduino via la liaison série sont égales à 1
                      if(nom!="")
                          qDebug()<<role;
                      if(role=="admin")
                        {ui->stackedWidget->setCurrentIndex(1);nom+=" welcome";A.write_to_arduino("1");
                         msg.setText(nom);msg.exec();
                        }
                       else {if(role=="employe")
                                {ui->stackedWidget->setCurrentIndex(2);nom+=" welcome";A.write_to_arduino("2");
                                 msg.setText(nom);msg.exec();}
                             else
                                msg.setText("id nexiste pas !!!!!!");msg.exec();
                            }
                  }

    }
}
//}





 // //////////////////////////////////////////CHAKIRA////////////////////////////////////////////////////////////////////////////////////////


void MainWindow::on_pushButton_clicked()
{

    int identifiant=ui->lineEdit_id->text().toInt();
    QString destination=ui->lineEdit_destination->text();
    int voyageurs=ui->lineEdit_voyageurs->text().toInt();
    float prix=ui->lineEdit_prix->text().toFloat();
    QDate date=ui->dateEdit_date->date();
    QTime heure=ui->timeEdit_heure->time();
    QTime duree=ui->timeEdit_duree->time();
    QString matricule=ui->matricule->currentText();

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
        ui->comboBox_modif->setModel(V.afficher());
          ui->comboBox_supp->setModel(V.afficher());
    }

        else
            QMessageBox::critical(nullptr, QObject::tr("Not OK"),
                        QObject::tr("Suppression non effectuée.\n"
                                    "Click Cancel to exit."), QMessageBox::Cancel);
}



void MainWindow::on_pushButton_3_clicked()
{
    int identifiant=ui->lineEdit_id->text().toInt();
    identifiant = ui->comboBox_modif->currentText().toInt();
    QString destination=ui->lineEdit_destination->text();
    int voyageurs=ui->lineEdit_voyageurs->text().toInt();
    float prix=ui->lineEdit_prix->text().toFloat();
    QDate date=ui->dateEdit_date->date();
    QTime heure=ui->timeEdit_heure->time();
    QTime duree=ui->timeEdit_duree->time();
    QString matricule=ui->matricule->currentText();

    Vols V(identifiant,destination,voyageurs,prix,date,heure,duree,matricule);
    bool test =V.modifier(identifiant,destination,voyageurs,prix,date,heure,duree,matricule);
    if (test)
    {
    QMessageBox::information(nullptr, QObject::tr(" OK"),
                    QObject::tr("Modification effectuée.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);
                                 ui->tabaff->setModel(V.afficher());
                                 ui->comboBox_modif->setModel(V.afficher());
                                   ui->comboBox_supp->setModel(V.afficher());
    }


    else
        {QMessageBox::critical(nullptr, QObject::tr("Not OK"),
                    QObject::tr("Modification non effectué.\n"
                                "Click Cancel to exit."), QMessageBox::Cancel);}
}

void MainWindow::on_comboBox_modif_currentIndexChanged(const QString &arg1)
{
    int identifiant=ui-> comboBox_modif->currentText().toInt();
    QString id=QString::number(identifiant);
    QSqlQuery query;
                  query.prepare("select * from vols where ID_vol='"+id+"'");

                  if(query.exec()){

                      while(query.next())
                      {

                     ui->lineEdit_id->setText(query.value(0).toString());
                     ui->lineEdit_destination->setText(query.value(1).toString());
                     ui->lineEdit_voyageurs->setText(query.value(5).toString());
                      ui->lineEdit_prix->setText(query.value(6).toString());
                      ui->matricule->setCurrentText(query.value(7).toString());

                      }


}
}

void MainWindow::on_comboBox_supp_currentIndexChanged(const QString &arg1)
{
    int identifiant=ui-> comboBox_supp->currentText().toInt();
    QString id=QString::number(identifiant);
    QSqlQuery query;
                  query.prepare("select * from vols where ID_vol='"+id+"'");

                  if(query.exec()){

                      while(query.next())
                      {

                     ui->lineEdit_id->setText(query.value(0).toString());
                     ui->lineEdit_destination->setText(query.value(1).toString());
                     ui->lineEdit_voyageurs->setText(query.value(5).toString());
                      ui->lineEdit_prix->setText(query.value(6).toString());
                      ui->matricule->setCurrentText(query.value(7).toString());
                      }

}
}



void MainWindow::on_pushButton_5_clicked()
{
      int identifiant =ui->lineEdit_chercher->text().toInt();
      QString destination =ui->lineEdit_chercher->text();
      QString matricule =ui->lineEdit_chercher->text();
      if (ui->comboBox_chercher->currentText()=="Par identifiant")
      ui->tabaff->setModel (V.recherche_id(identifiant)) ;
else if (ui->comboBox_chercher->currentText()=="Par destination")
     ui->tabaff->setModel (V.recherche_destination(destination)) ;
    else if (ui->comboBox_chercher->currentText()=="Par matricule")
          ui->tabaff->setModel (V.recherche_matricule(matricule)) ;

}

void MainWindow::on_pushButton_trie_clicked()
{     if (ui->comboBox_trier->currentText()=="Par prix")
    ui->tabaff->setModel (V.trie_prix()) ;
    else if (ui->comboBox_trier->currentText()=="Par date")
    ui->tabaff->setModel (V.trie_date()) ;
      else if (ui->comboBox_trier->currentText()=="Par voyageurs")
    ui->tabaff->setModel (V.trie_voyageurs()) ;
}

void MainWindow::on_pushButton_stat_clicked()
{
  QSqlQueryModel * model= new QSqlQueryModel();
                         model->setQuery("select * from VOLS where prix_vol <1500 ");
                         float e=model->rowCount();
                         model->setQuery("select * from VOLS where prix_vol between 1500 and 3000 ");
                         float ee=model->rowCount();
                         model->setQuery("select * from VOLS where prix_vol > 3000 ");
                         float eee=model->rowCount();
                         float total=e+ee+eee;
                         QString a=QString("Moins de 1500 dinars "+QString::number((e*100)/total,'f',2)+"%" );
                         QString b=QString("Entre 1500 et 3000 dinars "+QString::number((ee*100)/total,'f',2)+"%" );
                         QString c=QString("Plus de 3000 dinars "+QString::number((eee*100)/total,'f',2)+"%" );
                         QPieSeries *series = new QPieSeries();
                         series->append(a,e);
                         series->append(b,ee);
                         series->append(c,eee);
                 if (e!=0)
                 {QPieSlice *slice = series->slices().at(0);
                  slice->setLabelVisible();
                  slice->setPen(QPen());}
                 if ( ee!=0)
                 {
                          // Add label, explode and define brush for 2nd slice
                          QPieSlice *slice1 = series->slices().at(1);
                          //slice1->setExploded();
                          slice1->setLabelVisible();
                 }
                 if(eee!=0)
                 {
                          // Add labels to rest of slices
                          QPieSlice *slice2 = series->slices().at(2);
                          //slice1->setExploded();
                          slice2->setLabelVisible();
                 }
                         // Create the chart widget
                         QChart *chart = new QChart();

                         // Add data to chart with title and hide legend
                         chart->addSeries(series);
                         chart->setTitle("Statistiques par Prix : "+ QString::number(total));
                         chart->legend()->hide();
                         // Used to display the chart
                         QChartView *chartView = new QChartView(chart);
                         chartView->setRenderHint(QPainter::Antialiasing);
                         chartView->resize(1000,500);
                         chartView->show();
}



void MainWindow::on_pushButton_pdf_clicked()
{

    QString strStream;
                        QTextStream out(&strStream);
                        const int rowCount = ui->tabaff->model()->rowCount();
                        const int columnCount =ui->tabaff->model()->columnCount();


                        out <<  "<html>\n"
                                "<head>\n"
                                "<meta Content=\"Text/html; charset=Windows-1251\">\n"
                                <<  QString("<title>%1</title>\n").arg("vols")
                                <<  "</head>\n"
                                "<body bgcolor=#B4E7F8 link=#5000A0>\n"
                                    "<h1>Liste des vols</h1>"

                                    "<table border=1.5 cellspacing=0 cellpadding=1>\n";

                        // headers
                            out << "<thead><tr bgcolor=#7CD5F3>";
                            for (int column = 0; column < columnCount; column++)
                                if (!ui->tabaff->isColumnHidden(column))
                                    out << QString("<th>%1</th>").arg(ui->tabaff->model()->headerData(column, Qt::Horizontal).toString());
                            out << "</tr></thead>\n";
                            // data table
                               for (int row = 0; row < rowCount; row++) {
                                   out << "<tr>";
                                   for (int column = 0; column < columnCount; column++) {
                                       if (!ui->tabaff->isColumnHidden(column)) {
                                           QString data = ui->tabaff->model()->data(ui->tabaff->model()->index(row, column)).toString().simplified();
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



                QPrinter printer(QPrinter::PrinterResolution);
                printer.setOutputFormat(QPrinter::PdfFormat);
                printer.setOutputFileName("Liste_vols1.pdf");
                document->print(&printer);

        }




void MainWindow::on_calendarWidget_clicked(const QDate &date)
{


   ui->dateEdit_date = new QDateEdit;
                       ui->dateEdit_date->setDisplayFormat("dd/MM/yyyy");
                       ui->dateEdit_date->setDate(date);
                       QString Date(ui->dateEdit_date->text());
                  //QString date=ui->currentdate->toString();
                   QSqlQueryModel* model=V.rechercherDate(date);
                   if (model != nullptr)
                   {
                      ui->tabcal->setModel(model);
                   }

}

void MainWindow::on_pushButton_excel_clicked()
{
      V.exporter(ui->facture);
    }

void MainWindow::update_label()
{
    data=A.read_from_arduino();
        if(data=="B"){
       A.write_to_arduino("1");
      // pr.update(data.toInt());   // TAL3 ACEE

        QMessageBox::information(this,"Parking Aireport","spots left = 1");
        qDebug() << data;

           }
        if(data=="C"){
       A.write_to_arduino("1");
      QMessageBox::information(this,"Parking Aireport","spots left = 2");
        qDebug() << data;

           }
        if(data=="D"){
       A.write_to_arduino("1");
       QMessageBox::information(this,"Parking Aireport","spots left = 3");
     qDebug() << data;
           }
        if(data=="E"){
       A.write_to_arduino("1");
       QMessageBox::information(this,"Parking Aireport","spots left = 4");
        qDebug() << data;

           }
        if(data=="F"){
       A.write_to_arduino("1");
       QMessageBox::information(this,"Parking Aireport","spots left = 5");
        qDebug() << data;

           }
           else if(data=="A"){
                QMessageBox::information(this,"Parking Aireport","spots left = 0");
                A.write_to_arduino("4");  // mafamch blassa
           }



}

// /////////////////////////////////////////////////////////////////////////////////////////////////


void MainWindow::on_services_bt_clicked()
{
    ui->stackedWidget->setCurrentIndex(2);
}
