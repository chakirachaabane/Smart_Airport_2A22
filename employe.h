#ifndef EMPLOYE_H
#define EMPLOYE_H
#include <QString>

class employe
{
public:
    void setuser(QString n){user=n;}
    void setpassword(QString n){mdp=n;}

    QString get_user(){return user;}
    QString getpassword(){return mdp; }

    employe();

private :
    QString user,mdp;




};


#endif // EMPLOYE_H
