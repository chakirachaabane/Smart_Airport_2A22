#ifndef ACTIVATONCODECLASS_H
#define ACTIVATONCODECLASS_H

#include <QDialog>
#include <QTimer>
#include <QDateTime>
namespace Ui {
  class ActivatonCodeClass;
}

class ActivatonCodeClass : public QDialog
{
  Q_OBJECT

public:

  explicit ActivatonCodeClass(QWidget *parent = 0);
  ~ActivatonCodeClass();
  int getCode() const;
  void setCode(int value);
  QString getPass() const;
  void setPass( QString value);

  QString getUname() const;
  void setUname( QString value);

  QString getEmail() const;
  void setEmail(const QString &value);

  QString getRole() const{return  role;}
  void setRole(QString value){role=value;}

  QString getPrenom() const{return  prenom;}
  void setPrenom(QString value){prenom=value;}
  QString getcarte() const{return  carteid;}
  void setcarte(QString value){carteid=value;}

  int gettel() const{return tel;}
  void settel(int value){tel=value;}

  int getage() const{return age;}
  void setage(int value){age=value;}

  int getid() const{return id;}
  void setid(int value){id=value;}
  int getstate()const{return state;}
  void setstate(int v){state=v;}

public  slots:
  void checkCode();
  void checkCode2();

  void update();

private slots:
  void on_pushButton_clicked();

private:
  Ui::ActivatonCodeClass *ui;
  int code;
  QString uname;
  QString pass;
  QString email;
  QString role,prenom,carteid;
  int age,tel,id;
  QDateTime current,expire;
  QTimer *timer;
  int state;

};

#endif // ACTIVATONCODECLASS_H
