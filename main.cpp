#include "mainwindow.h"
#include <QtWidgets>
#include <QApplication>
#include <QMessageBox>

#include "connection.h"


int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    Connection c;
      bool test=c.createconnect();

    MainWindow w;



  if(test)
  {



     w.show();
     QMessageBox::information(nullptr, QObject::tr("database is open"),QObject::tr("connection successful\n"
                                                                                            "click cancel to exit"),QMessageBox::Cancel);


   }
  else
  {QMessageBox::critical(nullptr, QObject::tr("database is not open"),QObject::tr("connection unsuccessful\n"
                                                                                  "click cancel to exit"),QMessageBox::Cancel);
  }
    //fenetreprincipale.show(); //on affiche la fenêtre
    //w.show();
    return a.exec();
}
