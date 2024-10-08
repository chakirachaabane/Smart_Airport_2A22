#include "arduino.h"
#include <QSqlQuery>
#include <QSqlQueryModel>
#include <QSqlDatabase>
#include <QObject>
#include <QtSerialPort/QSerialPort>
#include <QtSerialPort/QSerialPortInfo>
Arduino::Arduino()
{
    data="";
    arduino_port_name="";
    arduino_is_available=false;
    serial=new QSerialPort;
}

QString Arduino::getarduino_port_name()
{
    return arduino_port_name;
}

QSerialPort *Arduino::getserial()
{
   return serial;
}
int Arduino::connect_arduino()
{   // recherche du port sur lequel la carte arduino identifée par  arduino_uno_vendor_id
    // est connectée
    serialbuffer="";
    foreach (const QSerialPortInfo &serial_port_info, QSerialPortInfo::availablePorts()){
           if(serial_port_info.hasVendorIdentifier() && serial_port_info.hasProductIdentifier()){
               if(serial_port_info.vendorIdentifier() == arduino_uno_vendor_id && serial_port_info.productIdentifier()
                       == arduino_uno_producy_id) {
                   arduino_is_available = true;qDebug()<<"mrgl";
                   arduino_port_name=serial_port_info.portName();
               } } }
        qDebug() << "arduino_port_name is :" << arduino_port_name;
        if(arduino_is_available){ // configuration de la communication ( débit...)
            serial->setPortName(arduino_port_name);
            if(serial->open(QSerialPort::ReadWrite)){
                serial->setBaudRate(QSerialPort::Baud9600); // débit : 9600 bits/s
                serial->setDataBits(QSerialPort::Data8); //Longueur des données : 8 bits,
                serial->setParity(QSerialPort::NoParity); //1 bit de parité optionnel
                serial->setStopBits(QSerialPort::OneStop); //Nombre de bits de stop : 1
                serial->setFlowControl(QSerialPort::NoFlowControl);
                return 0;
            }
            return 1;
        }
        return -1;
}

int Arduino::close_arduino()

{

    if(serial->isOpen()){
            serial->close();
            return 0;
        }
    return 1;


}


 QByteArray Arduino::read_from_arduino()
{

    if(serial->isReadable()){
        serial->waitForReadyRead(10);
         data=serial->readAll();
         return data;
    }
 }

 QString  Arduino::cherchercode(QString id){

     QSqlDatabase bd = QSqlDatabase::database();
     QString nom;
         QSqlQuery query;
         query.prepare("SELECT NOM_EMP FROM EMPLOYES WHERE CARD_ID=:CARD_ID");
  query.bindValue(":CARD_ID", id);

         query.exec();
         if (query.next())
         {

             nom=query.value(0).toString();
              return nom;
         }
         else {
             return NULL;
         }

 }
 QByteArray Arduino::getdata()
 {
     return data;
 }
int Arduino::write_to_arduino( QByteArray d)
{

    if(serial->isWritable()){
        serial->write(d);  // envoyer des donnés vers Arduino
    }else{
        qDebug() << "Couldn't write to serial!";
    }
}
QString Arduino::chercher(QString ID_EM,QString *role){

    QSqlDatabase bd = QSqlDatabase::database();
QString nom;
        QSqlQuery query;
        query.prepare("SELECT NOM_EMP,ROLE FROM EMPLOYES WHERE CARD_ID=:CARD_ID");
 query.bindValue(":CARD_ID",ID_EM );

        query.exec();
        if (query.next())
        {

            nom=query.value("NOM_EMP").toString();
            *role=query.value("ROLE").toString();
             return nom;
        }
        else {
            return "";
        }
    }



