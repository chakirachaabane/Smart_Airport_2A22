#include "recuperer_mdp.h"
#include "ui_recuperer_mdp.h"
#include <stdlib.h>
#include <ctime>
#include <QSqlQuery>
#include <QDebug>
recuperer_mdp::recuperer_mdp(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::recuperer_mdp)
{
    setFixedSize(451,260);
    act2 = nullptr;
    smtp = nullptr;
    ui->setupUi(this);

}

recuperer_mdp::~recuperer_mdp()
{
    delete ui;
}

void recuperer_mdp::on_confirmer_bt_clicked()
{
    QSqlQuery sql;
    QString id_str=QString::number(ui->LineEdit_ID->text().toInt());
    if(sql.exec("select * from employes where CIN_EMPLOYE ='" + id_str+ "'")){
        qDebug()<<"DONE DONE DONE";

        qDebug() << sql.lastError().text();

        int count{0};
        if(sql.next()){
            count++;

          }
        if(count !=1){
            QMessageBox::warning(this,"System Message !", "id  not found!",QMessageBox::Ok);

            return;
          }
      }




    sendMail();
    ui->confirmer_bt->setEnabled(false);


}

void recuperer_mdp::sendMail()
{
    QSqlQuery query;
    QString id_str=QString::number(ui->LineEdit_ID->text().toInt());

    query.prepare(QString("select * from employes WHERE cin_employe=:cin_employe "));
    query.bindValue(":cin_employe",id_str);
    query.exec();
     qDebug()<<id_str;
  if(query.next())
    {QString IdFromDB=query.value("cin_employe").toString();
      if(IdFromDB==id_str)
        {  QMessageBox::information(this,"System Message !", "id  existe!",QMessageBox::Ok);
        QString email=query.value("adresse_mail").toString();
       //your email ,your password , smtp server ,port
       smtp = new Smtp("mohamedilyes.fakhfakh@esprit.tn" , "211JMT8896", "smtp.gmail.com",465);
       connect(smtp, SIGNAL(status(QString)), this, SLOT(mailSent(QString)));
       std::srand(static_cast<unsigned int>(std::time(nullptr)));
       ran=std::rand();
       msg ="Welcome To SmartAirport Application please copy this number and place it : "+QString::number(ran);
       // qDebug()<<msg;
       //your email
       smtp->sendMail("mohamedilyes.fakhfakh@esprit.tn", email , "SmartAirport Application code : "+QString::number(ran),msg);
      }
    }else {QMessageBox::information(this,"System Message !", "error!",QMessageBox::Ok);}


}
unsigned int recuperer_mdp::getRan() const
{
  return ran;
}
void recuperer_mdp::mailSent(QString status)
{
  //  if(smtp == nullptr) return;
  if(status == "Message sent"){
      //      disconnect(SIGNAL(status(QString)), this, SLOT(mailSent(QString)));
      //      if(smtp != nullptr){
      //          smtp->deleteLater();
      //          smtp = nullptr;
      //        }
      if(!(ui->LineEdit_ID->text()==""||ui->pass->text()=="")){

          //          if(act == nullptr){
          act2= new ActivatonCodeClass(this);
            /*connect(act2,&ActivatonCodeClass::accepted,this,[](){
                  qDebug()<<"Acccepted!";
                });*/

          act2->setCode(ran);


          act2->setPass(ui->pass->text());

          //              if(!act->exec()){
          //                  if(act->result() == QDialog::Accepted)
          //                    qDebug() << "acepted .......";
          //                }

          act2->setid(ui->LineEdit_ID->text().toInt());
          QSqlQuery query;
          QString id_str=QString::number(ui->LineEdit_ID->text().toInt());

          query.prepare(QString("select * from employes WHERE cin_employe=:cin_employe "));
          query.bindValue(":cin_employe",id_str);
          act2->setage(query.value("age_emp").toInt());
          act2->settel(query.value("numero_telephone").toInt());
          act2->setEmail(query.value("adresse_emp").toString());
          act2->setRole(query.value("age_emp").toString());
          act2->setPrenom(query.value("prenom_emp").toString());
          act2->setUname(query.value("nom_emp").toString());
          act2->setstate(2);

          act2->raise();
          act2->activateWindow();
          act2->show();

          this->hide();

        }
    }else{
      ui->confirmer_bt->setEnabled(true);

    }

}











