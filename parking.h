#ifndef PARKING_H
#define PARKING_H
#include <QSerialPort>

class parking
{
public:
    parking();
   int dispo_place();
   void update(int);
private:
   int carnum;
   int dispo;
};

#endif // PARKING_H
