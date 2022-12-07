#ifndef RECUPERER_MDP_H
#define RECUPERER_MDP_H

#include <QDialog>
#include <QtSql>
#include "activatoncodeclass.h"
#include "smtp.h"
#include <QString>

namespace Ui {
class recuperer_mdp;
}

class recuperer_mdp : public QDialog
{
    Q_OBJECT

public:
    explicit recuperer_mdp(QWidget *parent = nullptr);
    ~recuperer_mdp();
    unsigned int getRan() const;
    void sendMail();
private slots:
    void on_confirmer_bt_clicked();
    void mailSent(QString);
private:
    Ui::recuperer_mdp *ui;
    QSqlDatabase mydb;
   unsigned int ran;
  Smtp* smtp ;
   QString msg;
   ActivatonCodeClass *act2;
};

#endif // RECUPERER_MDP_H
