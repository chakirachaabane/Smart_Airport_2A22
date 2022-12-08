#ifndef HISTORIQUE_H
#define HISTORIQUE_H
#include <QFile>
#include <QTextStream>
#include <QString>
#include <QDate>
#include <QSqlQuery>
#include <QSqlQueryModel>
#include <QMainWindow>
#include <iostream>
#include <QObject>
#include <QDebug>
#include <QTimer>
#include <QDateTime>

class historique
{
    QString tmp;
     public:
         historique();
          void save(QString,QString,QString,QString,QString,QString,QString);
         QString load();
};
/*class historique
{
    QString tmp;

    void write(QString);
    QString read();
    void write1(QString);
    QString read1();
public:
    historique();
    void save(QString,QString,QString,QString,QString,QString,QString);
        QString load();
        void save1(QString,QString,QString,QString,QString,QString,QString);
        QString load1();
        QString mFilename;
      QString mFilename1;
};*/

#endif // HISTORIQUE_H
