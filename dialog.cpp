#include "dialog.h"
#include "ui_dialog.h"
//#include "vols.h"
#include <QPixmap>
Dialog::Dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog)
{    ui->setupUi(this);


}
Vols V;
Dialog::~Dialog()
{
    delete ui;
}

void Dialog :: setvols(Vols V) {

}
