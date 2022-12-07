#ifndef ADMININTERFACE_H
#define ADMININTERFACE_H
#include "employe.h"
#include "mainwindow.h"
#include <QDialog>
#include "ui_mainwindow.h"
namespace Ui {
class adminInterface;
}

class adminInterface : public QDialog
{
    Q_OBJECT

public:
    explicit adminInterface(QWidget *parent = nullptr);

    ~adminInterface();

private:
    Ui::adminInterface *ui;

};

#endif // ADMININTERFACE_H
