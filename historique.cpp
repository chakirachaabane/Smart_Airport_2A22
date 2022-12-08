#include<QSqlQuery>
#include<QDebug>
#include<QObject>
#include<QSqlQueryModel>
#include<QTableView>
#include<iostream>
#include <QString>
#include "historique.h"
#include<QMessageBox>
#include"QDateTime"
    historique::historique()
    {
    tmp="";
    }
    void historique::save(QString CIN_VOY ,QString NOM_VOY ,QString PRENOM_VOY ,QString NUMERO_VOY,QString AGE, QString ORIGINE,QString GENRE)
    {    QFile file ("C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt");
         if (!file.open(QIODevice::WriteOnly|QIODevice::Append | QIODevice::Text))
          qDebug()<<"erreur";
         QTextStream out(&file);
          QDateTime d=QDateTime::currentDateTime();
         out << CIN_VOY+"\n"+NOM_VOY << "\n" +PRENOM_VOY << "\n" +NUMERO_VOY << "\n" +AGE <<"\n" +ORIGINE <<"\n" +GENRE << "\n"+d.toString()<<"\n"<<"------------------------------------------------" << "\n";

    }

    QString historique::load()
    {   tmp="";
        QFile file("C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt");
        if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
             qDebug()<<"erreur";
          tmp="";

        QTextStream in(&file);

      while (!in.atEnd()) {

             QString myString = in.readLine();
             tmp+=myString+"\n";

       }

       return tmp;
    }

/*historique::historique()
{

}
void historique::save(QString CIN_VOY ,QString NOM_VOY ,QString PRENOM_VOY ,QString NUMERO_VOY,QString AGE, QString ORIGINE,QString GENRE)
{    QFile file ("C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt");
     if (!file.open(QIODevice::WriteOnly|QIODevice::Append | QIODevice::Text))
      qDebug()<<"erreur";
     QTextStream out(&file);
     out << CIN_VOY+"\n"+NOM_VOY << "\n" +PRENOM_VOY << "\n" +NUMERO_VOY << "\n" +AGE <<"\n" +ORIGINE <<"\n" +GENRE << "\n""------------------------------------------------" << "\n";
}
QString historique::load()
{   tmp="";
    QFile file("C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt");
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
      tmp="";

    QTextStream in(&file);

   while (!in.atEnd()) {

         QString myString = in.readLine();
         tmp+=myString+"\n";

   }
   return tmp;

   mFilename="C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt";
   mFilename1="C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt";
   }
   QString historique::read()
   {
   QFile mFile(mFilename);
   if (!mFile.open(QFile::ReadOnly | QFile::Text))
   {
       qDebug () <<"il ne peut pas";
   }
   QTextStream in (&mFile);
   QString text=mFile.readAll();
   mFile.close();
   return  text;
   }
   QString historique::read1()
   {
   QFile mFile(mFilename1);
   if (!mFile.open(QFile::ReadOnly | QFile::Text))
   {
       qDebug () <<"il ne peut pas";
   }
   QTextStream in (&mFile);
   QString text=mFile.readAll();
   mFile.close();
   return  text;
   }
   void historique::write(QString text)
   {
       QString aux=read();

       QDateTime datetime = QDateTime::currentDateTime();
       QString date =datetime.toString();
       date+= " ";
       aux+=date;
   QFile mFile(mFilename);
   if (!mFile.open(QFile::WriteOnly | QFile::Text))
   {
       qDebug () <<"il ne peut pas";
   }
   QTextStream out (&mFile);


   aux+=text;
   out << aux << "\n";
   mFile.flush();
   mFile.close();

   }
   void historique::write1(QString text)
   {
       QString aux=read();

       QDateTime datetime = QDateTime::currentDateTime();
       QString date =datetime.toString();
       date+= " ";
       aux+=date;
   QFile mFile(mFilename1);
   if (!mFile.open(QFile::WriteOnly | QFile::Text))
   {
       qDebug () <<"il ne peut pas";
   }
   QTextStream out (&mFile);


   aux+=text;
   out << aux << "\n";
   mFile.flush();
   mFile.close();

   }
   void historique::save1(QString CIN_VOY ,QString NOM_VOY ,QString PRENOM_VOY ,QString NUMERO_VOY,QString AGE, QString ORIGINE,QString GENRE)
   {    QFile file ("C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt");
        if (!file.open(QIODevice::WriteOnly|QIODevice::Append | QIODevice::Text))
         qDebug()<<"erreur";
        QTextStream out(&file);
       out << CIN_VOY+"\n"+NOM_VOY << "\n" +PRENOM_VOY << "\n" +NUMERO_VOY << "\n" +AGE <<"\n" +ORIGINE <<"\n" +GENRE << "\n""------------------------------------------------" << "\n";


   }
   QString historique::load1()
   {   tmp="";
       QFile file("C:/Users/asmaz/Desktop/Atelier_Connexion/historique.txt");
       if (!file.open(QIODevice::ReadOnly | QIODevice::Text))
         tmp="";

       QTextStream in(&file);

      while (!in.atEnd()) {

            QString myString = in.readLine();
            tmp+=myString+"\n";
}  return tmp;
   }*/
