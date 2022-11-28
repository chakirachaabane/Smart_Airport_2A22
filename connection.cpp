#include "connection.h"

Connection::Connection()
{

}

bool Connection::createconnect()
{bool test=false;
QSqlDatabase db = QSqlDatabase::addDatabase("QODBC");//api
db.setDatabaseName("test-bd");
db.setUserName("MedIlyes");//inserer nom de l'utilisateur
db.setPassword("ilyes");//inserer mot de passe de cet utilisateur

if (db.open())
test=true;





    return  test;
}
void Connection::closeconnection()
{
    db.close();
}

