#include "connection.h"

Connection::Connection()
{

}

bool Connection::createconnect()
{bool test=false;
QSqlDatabase db = QSqlDatabase::addDatabase("QODBC");
db.setDatabaseName("test.bd");
db.setUserName("gaidii");//inserer nom de l'utilisateur
db.setPassword("545541981");//inserer mot de passe de cet utilisateur

if (db.open())

test=true;





    return  test;
}
