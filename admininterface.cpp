#include "admininterface.h"
#include "ui_admininterface.h"
#include "ui_mainwindow.h"
#include "mainwindow.h"

adminInterface::adminInterface(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::adminInterface)
{

    ui->setupUi(this);

}

adminInterface::~adminInterface()
{
    delete ui;
}
