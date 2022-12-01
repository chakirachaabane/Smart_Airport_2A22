#include "mainwindow.h"
#include "ui_mainwindow.h"
#include "employee.h"
#include<QMessageBox>
#include <QTextFormat>
#include "signupdialog.h"
#include <QDebug>
#include "recuperer_mdp.h"
#include "stats_age.h"
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
                        {ui->stackedWidget->setCurrentIndex(1);nom+=" welcome";
                         msg.setText(nom);msg.exec();
                        }
                       else {if(role=="employe")
                                {ui->stackedWidget->setCurrentIndex(2);nom+=" welcome";
                                 msg.setText(nom);msg.exec();}
                             else
                                msg.setText("id nexiste pas !!!!!!");msg.exec();
                            }
                  }

    }
}
