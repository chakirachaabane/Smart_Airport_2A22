#include "connection.h"

Connection::Connection()
{

}

bool Connection::createconnect()
{bool test=false;
 db = QSqlDatabase::addDatabase("QODBC");
db.setDatabaseName("test-bd");
db.setUserName("salma");//inserer nom de l'utilisateur
db.setPassword("esprit18");//inserer mot de passe de cet utilisateur

if (db.open())
test=true;





    return  test;
}

  void Connection::closeConnection()
  {
      db.close();
  }
