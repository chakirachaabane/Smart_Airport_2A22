#include "activatoncodeclass.h"
#include "ui_activatoncodeclass.h"
#include <QSqlQuery>
#include <QMessageBox>
#include <QToolTip>
#include <QSettings>
#include <QTimer>
#include <QDebug>
#include <QVariant>
static int attempt= 3;
ActivatonCodeClass::ActivatonCodeClass(QWidget *parent) :
  QDialog(parent),
  ui(new Ui::ActivatonCodeClass)
{
  timer = nullptr;
  ui->setupUi(this);
  QString st=QString::number(getstate());


  //connect(ui->pushButton,&QPushButton::clicked,this,&ActivatonCodeClass::checkCode);

         // connect(ui->pushButton,&QPushButton::clicked,this,&ActivatonCodeClass::checkCode2);

  QSettings settings("Comp","time");
  settings.beginGroup("Time");
//          settings.setValue("MyTime",QDateTime::currentDateTime());
  QDateTime dd=settings.value("mytime",0).toDateTime();
  settings.endGroup();
  qDebug()<<"GG"<<dd;
  connect(this,&ActivatonCodeClass::rejected,this,[=](){

      qDebug()<<"REJECT"<<st;
    if(timer!=nullptr){
      timer->stop();
    delete timer;
      }
    });

}

ActivatonCodeClass::~ActivatonCodeClass()
{
  delete ui;
}

void ActivatonCodeClass::checkCode()
{ QString id_str=QString::number(getid());
    QString tel_str=QString::number(gettel());
    QString age_str=QString::number(getage());
  int checker=ui->le_code->text().toInt();
  if(checker==getCode()){
      QSqlQuery query;
      if(query.exec("insert into EMPLOYES(CIN_EMPLOYE,NOM_EMP,PRENOM_EMP,NUMERO_TELEPHONE,AGE_EMP,ADRESSE_MAIL,MOT_DE_PASSE,ROLE,CARD_ID)"
 " values('"+id_str+"','"+getUname()+"','"+getPrenom()+"','"+tel_str+"','"+age_str+"','"+getEmail()+"','"+getPass()+"','"+getRole()+"','"+getcarte()+"')")){


          QMessageBox::information(this,"System Message!","User Created Succesfully!",QMessageBox::Ok);
          setResult(QDialog::Accepted);
          done(QDialog::Accepted);
          setResult(QDialog::Accepted);
          close();
          //accept();
        }

    }else{
      if(attempt!=0){
          QPoint point = QPoint(geometry().left() + ui->le_code->geometry().left(),
                                geometry().top() + ui->le_code->geometry().bottom());
          ui->le_code->clear();   // Reset previous text..
          QToolTip::showText(point,"Error Wrong Number Maximum Tries :"+ QString::number(attempt));
          attempt--;

        }else{
          qDebug() << "start timer code";
          ui->pushButton->setEnabled(false);
          current = QDateTime::currentDateTime();
          QSettings settings("Comp","time");
          settings.beginGroup("Time");
//          settings.setValue("MyTime",QDateTime::currentDateTime());
          expire = current.addSecs(120);
          settings.setValue("mytime",expire.currentDateTime().addSecs(300));
          settings.endGroup();

          timer = new QTimer(this);
          connect(timer, &QTimer::timeout, this, [&](){
              qDebug()<<"expire : "<<expire;
              qDebug()<<"current : "<<current;
              current = QDateTime::currentDateTime();
              if(expire <= current){
              timer->stop();
              delete timer;
              timer=0;
              attempt=3;
              ui->pushButton->setEnabled(true);
              }
            });
          if(timer!=0)
          timer->start(1000);
        }

    }
}

void ActivatonCodeClass::checkCode2()
{  QString id_str=QString::number(getid());
  int checker=ui->le_code->text().toInt();
  if(checker==getCode()){
      QSqlQuery query;
      query.prepare("UPDATE employes SET MOT_DE_PASSE=:MOT_DE_PASSE WHERE CIN_EMPLOYE=:CIN_EMPLOYE");
      query.bindValue(":CIN_EMPLOYE",id_str);
      query.bindValue(":MOT_DE_PASSE",getPass());QMessageBox::information(this,"System Message!","ahla!",QMessageBox::Ok);


      if(query.exec()){

          QMessageBox::information(this,"System Message!","password changed Succesfully!",QMessageBox::Ok);
          setResult(QDialog::Accepted);
          done(QDialog::Accepted);
          setResult(QDialog::Accepted);
          close();
          //accept();
        }

    }else{
      if(attempt!=0){
          QPoint point = QPoint(geometry().left() + ui->le_code->geometry().left(),
                                geometry().top() + ui->le_code->geometry().bottom());
          ui->le_code->clear();   // Reset previous text..
          QToolTip::showText(point,"Error Wrong Number Maximum Tries :"+ QString::number(attempt));
          attempt--;

        }else{
          qDebug() << "start timer code";
          ui->pushButton->setEnabled(false);
          current = QDateTime::currentDateTime();
          QSettings settings("Comp","time");
          settings.beginGroup("Time");
//          settings.setValue("MyTime",QDateTime::currentDateTime());
          expire = current.addSecs(120);
          settings.setValue("mytime",expire.currentDateTime().addSecs(300));
          settings.endGroup();

          timer = new QTimer(this);
          connect(timer, &QTimer::timeout, this, [&](){
              qDebug()<<"expire : "<<expire;
              qDebug()<<"current : "<<current;
              current = QDateTime::currentDateTime();
              if(expire <= current){
              timer->stop();
              delete timer;
              timer=0;
              attempt=3;
              ui->pushButton->setEnabled(true);
              }
            });
          if(timer!=0)
          timer->start(1000);
        }

    }
}

void ActivatonCodeClass::update()
{
  qDebug()<<"LOL";
}

QString ActivatonCodeClass::getEmail() const
{
  return email;
}

void ActivatonCodeClass::setEmail(const QString &value)
{
  email = value;
}

QString ActivatonCodeClass::getUname() const
{
  return uname;
}

void ActivatonCodeClass::setUname(QString value)
{
  uname = value;
}

QString ActivatonCodeClass::getPass() const
{
  return pass;
}

void ActivatonCodeClass::setPass(QString value)
{
  pass = value;
}

int ActivatonCodeClass::getCode() const
{
  return code;
}

void ActivatonCodeClass::setCode(int value)
{
  code = value;
}

void ActivatonCodeClass::on_pushButton_clicked()
{int i=getstate();
 if(i==2)
 {//connect(ui->pushButton,&QPushButton::clicked,this,&ActivatonCodeClass::checkCode2);
  ActivatonCodeClass::checkCode2();
 }
 else
 {if(i==1)
      ActivatonCodeClass::checkCode();   }
      //connect(ui->pushButton,&QPushButton::clicked,this,&ActivatonCodeClass::checkCode);
}
