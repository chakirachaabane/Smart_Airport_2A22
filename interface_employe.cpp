#include "interface_employe.h"
#include "ui_interface_employe.h"

interface_employe::interface_employe(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::interface_employe)
{
    ui->setupUi(this);
}

interface_employe::~interface_employe()
{
    delete ui;
}
